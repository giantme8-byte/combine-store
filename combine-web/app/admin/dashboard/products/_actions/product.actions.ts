"use server";

import { Availability, UserRole, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Buffer } from "buffer";
import { generateProductSlug } from "@/lib/generate-product-slug";

type UploadedImage = {
  url: string;
  publicId: string;
  sortOrder: number;
};

type ColorGalleryImage = {
  url: string;
  publicId: string;
  sortOrder: number;
  deleted?: boolean;
};


async function getProductCategoryRelations(
  formData: FormData
) {
  const categoryIdValue =
    formData
      .get("categoryId")
      ?.toString()
      .trim() ?? "";

  const subCategoryIdValue =
    formData
      .get("subCategoryId")
      ?.toString()
      .trim() ?? "";

  if (!categoryIdValue) {
    throw new Error(
      "Category is required."
    );
  }

  const categoryId =
    Number(categoryIdValue);

  if (
    !Number.isInteger(categoryId) ||
    categoryId <= 0
  ) {
    throw new Error(
      "Invalid category."
    );
  }

  const category =
    await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
      },
    });

  if (!category) {
    throw new Error(
      "Selected category does not exist."
    );
  }

  let subCategoryId:
    number | null = null;

  let subCategoryName:
    string | null = null;

  if (subCategoryIdValue) {
    const parsedSubCategoryId =
      Number(subCategoryIdValue);

    if (
      !Number.isInteger(
        parsedSubCategoryId
      ) ||
      parsedSubCategoryId <= 0
    ) {
      throw new Error(
        "Invalid sub-category."
      );
    }

    const subCategory =
      await prisma.subCategory.findUnique({
        where: {
          id: parsedSubCategoryId,
        },
        select: {
          id: true,
          name: true,
          categoryId: true,
        },
      });

    if (!subCategory) {
      throw new Error(
        "Selected sub-category does not exist."
      );
    }

    if (
      subCategory.categoryId !==
      category.id
    ) {
      throw new Error(
        "Selected sub-category does not belong to the selected category."
      );
    }

    subCategoryId =
      subCategory.id;

    subCategoryName =
      subCategory.name;
  }

  return {
    categoryId: category.id,
    categoryName: category.name,
    subCategoryId,
    subCategoryName,
  };
}

function getCustomPackagingId(formData: FormData) {
  const value = formData
    .get("customPackagingId")
    ?.toString()
    .trim();

  if (!value) {
    return null;
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid custom packaging.");
  }

  return id;
}

export async function quickUpdateProductPrice(
  productId: number,
  price: number
) {
  await requireRole([
    UserRole.STAFF,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);

  await prisma.product.update({
    where: {
      id: productId,
    },

    data: {
      price,
    },
  });

  revalidatePath(
    "/admin/dashboard/products"
  );
}

export async function createProduct(
  formData: FormData
) {
  try {
    console.log(
      "=== CREATE PRODUCT START ==="
    );

    // =========================================================
    // Gallery Images
    // =========================================================

    type ImageOrderItem = {
      id: string;
      url: string;
      publicId: string | null;
      sortOrder: number;
      isNew: boolean;
      deleted: boolean;
    };

    const imageOrder =
      formData
        .getAll("imageOrder")
        .map((item) =>
          JSON.parse(
            item.toString()
          )
        ) as ImageOrderItem[];

    const uploadedImages: UploadedImage[] =
      imageOrder
        .filter(
          (image) =>
            !image.deleted &&
            image.url &&
            image.publicId
        )
        .map((image) => ({
          url: image.url,
          publicId:
            image.publicId!,
          sortOrder:
            image.sortOrder,
        }));

    console.log(
      "Gallery images received:",
      uploadedImages.length
    );

    // =========================================================
    // Product Colors
    // =========================================================


    type ColorOrderItem = {
      id: string;
      colorId: number | null;
      publicId: string | null;
      name: string;
      model: string;
      sortOrder: number;
      isNew: boolean;
      deleted: boolean;
      images?: ColorGalleryImage[];
    };

    const colorOrder =
      formData
        .getAll("colorOrder")
        .map((item) =>
          JSON.parse(
            item.toString()
          )
        ) as ColorOrderItem[];

    // =========================================================
    // Product Variants
    // =========================================================

    type VariantOrderItem = {
      id: string;
      colorId: number | null;
      size: string;
      model: string;
      dimensions: string;
      imageUrl?: string;
      publicId?: string;
      hasNewImage?: boolean;
      images?: {
        id: string;
        url: string;
        publicId: string;
        sortOrder: number;
        isNew?: boolean;
        deleted?: boolean;
      }[];
      sortOrder: number;
      isNew: boolean;
      deleted: boolean;
    };

    const variantOrder =
      formData
        .getAll("variantOrder")
        .map((item) =>
          JSON.parse(
            item.toString()
          )
        ) as VariantOrderItem[];

    const activeVariants =
      variantOrder.filter(
        (variant) =>
          !variant.deleted
      );

    // =========================================================
    // New Colors
    // =========================================================

    const newColorOrder =
      colorOrder.filter(
        (color) =>
          color.isNew &&
          !color.deleted
      );


    const uploadedColors = newColorOrder
      .map((color) => {
        const galleryImages =
          Array.isArray(color.images)
            ? color.images
                .filter(
                  (image) =>
                    image &&
                    image.url &&
                    image.publicId &&
                    !image.deleted
                )
                .map(
                  (image, imageIndex) => ({
                    url: image.url,
                    publicId:
                      image.publicId,
                    sortOrder:
                      image.sortOrder ??
                      imageIndex,
                  })
                )
            : [];

        if (galleryImages.length === 0) {
          return null;
        }

        return {
          colorId: color.colorId,
          name: color.name,
          model: color.model,
          imageUrl:
            galleryImages[0].url,
          publicId:
            galleryImages[0].publicId,
          sortOrder: color.sortOrder,
          images: galleryImages,
        };
      })
      .filter(
        (
          color
        ): color is NonNullable<
          typeof color
        > => color !== null
      );

    // =========================================================
    // Generate Slug
    // =========================================================

    console.log(
      "Before prisma.product.create"
    );

    const slug =
      await generateProductSlug(
        formData.get(
          "name"
        ) as string,
        formData
          .get("model")
          ?.toString() || null
      );

    const customPackagingId =
      getCustomPackagingId(
        formData
      );
    const categoryRelations =
      await getProductCategoryRelations(
        formData
      );

    // =========================================================
    // Create Product
    // =========================================================

    await prisma.product.create({
      data: {
        brand:
          formData.get(
            "brand"
          ) as string,

        sku:
          formData
            .get("sku")
            ?.toString() || null,

        name:
          formData.get(
            "name"
          ) as string,

        slug,

        model:
          formData
            .get("model")
            ?.toString() || null,

        shortDescription:
          formData
            .get(
              "shortDescription"
            )
            ?.toString() || null,

        costPriceCny:
          Number(
            formData.get(
              "costPriceCny"
            )
          ) || null,

        priceRemark:
          formData
            .get(
              "priceRemark"
            )
            ?.toString() || null,

        price:
          Number(
            formData.get(
              "price"
            )
          ),

        description:
          formData.get(
            "description"
          ) as string,

        category:
          categoryRelations.categoryName,

        subCategory:
          categoryRelations.subCategoryName,

        categoryId:
          categoryRelations.categoryId,

        subCategoryId:
          categoryRelations.subCategoryId,

        mainColor:
          formData
            .get("mainColor")
            ?.toString() || null,

        dimensions:
          formData
            .get("dimensions")
            ?.toString() || null,

        customPackagingId,

        availability:
          formData.get(
            "availability"
          ) as Availability,

        featured:
          formData.get(
            "featured"
          ) === "on",

        newArrival:
          formData.get(
            "newArrival"
          ) === "on",

        bestSeller:
          formData.get(
            "bestSeller"
          ) === "on",

        limited:
          formData.get(
            "limited"
          ) === "on",

        onSale:
          formData.get(
            "onSale"
          ) === "on",

        images: {
          create:
            uploadedImages,
        },

        colors: {
          create:
            uploadedColors.map(
              (color) => ({
                colorId:
                  color.colorId,

                name:
                  color.name,

                model:
                  color.model,

                imageUrl:
                  color.imageUrl,

                publicId:
                  color.publicId,

                sortOrder:
                  color.sortOrder,

                images: {
                  create:
                    color.images.map(
                      (image) => ({
                        url:
                          image.url,
                        publicId:
                          image.publicId,
                        sortOrder:
                          image.sortOrder,
                      })
                    ),
                },
              })
            ),
        },

        variants: {
          create:
            activeVariants.map(
              (
                variant,
                index
              ) => {
                const galleryImages =
                  Array.isArray(
                    variant.images
                  )
                    ? variant.images
                        .filter(
                          (image) =>
                            image &&
                            image.url &&
                            image.publicId &&
                            !image.deleted
                        )
                        .map(
                          (
                            image,
                            imageIndex
                          ) => ({
                            url:
                              image.url,
                            publicId:
                              image.publicId,
                            sortOrder:
                              image.sortOrder ??
                              imageIndex,
                          })
                        )
                    : [];

                return {
                  colorId:
                    variant.colorId,

                  size:
                    variant.size,

                  model:
                    variant.model ||
                    null,

                  dimensions:
                    variant.dimensions ||
                    null,

                  imageUrl:
                    galleryImages[0]
                      ?.url ??
                    variant.imageUrl ??
                    null,

                  publicId:
                    galleryImages[0]
                      ?.publicId ??
                    variant.publicId ??
                    null,

                  sortOrder:
                    variant.sortOrder,

                  images:
                    galleryImages.length
                      ? {
                          create:
                            galleryImages,
                        }
                      : undefined,
                };
              }
            ),
        },
      },
    });

    console.log(
      "After prisma.product.create"
    );
  } catch (err) {
    console.error(
      "========== CREATE PRODUCT ERROR =========="
    );

    console.error(err);

    if (err instanceof Error) {
      console.error(
        err.message
      );

      console.error(
        err.stack
      );
    }

    throw err;
  }

  // =========================================================
  // SUCCESS
  // =========================================================
  //
  // Do not redirect here. ProductForm handles navigation after
  // the Server Action resolves successfully. This keeps create
  // and update behaviour consistent and prevents NEXT_REDIRECT
  // from being mistaken for a failed save on the client.
  //

  console.log(
    "Product created successfully"
  );

  revalidatePath(
    "/admin/dashboard/products"
  );

  return {
    success: true,
  };
}

export async function updateProduct(
  id: number,
  formData: FormData
) {
  try {
    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },

          colors: {
            orderBy: {
              sortOrder: "asc",
            },
          },

          variants: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    // =========================================================
    // PRODUCT IMAGES
    // =========================================================

    type ImageOrderItem = {
      id: string;
      url: string;
      publicId: string | null;
      sortOrder: number;
      isNew: boolean;
      deleted: boolean;
    };

    const imageOrder =
      formData
        .getAll("imageOrder")
        .map((item) =>
          JSON.parse(
            item.toString()
          )
        ) as ImageOrderItem[];

    /*
     * Existing images:
     *   isNew = false
     *
     * Newly uploaded images:
     *   isNew = true
     *
     * Only NEW images should be inserted
     * into ProductImage.
     */

    const uploadedImages: UploadedImage[] =
      imageOrder
        .filter(
          (image) =>
            image.isNew &&
            !image.deleted &&
            image.url &&
            image.publicId
        )
        .map((image) => ({
          url: image.url,
          publicId:
            image.publicId!,
          sortOrder:
            image.sortOrder,
        }));

    console.log(
      "Existing images:",
      imageOrder.filter(
        (image) =>
          !image.isNew &&
          !image.deleted
      ).length
    );

    console.log(
      "New images:",
      uploadedImages.length
    );

    // =========================================================
    // PRODUCT COLORS
    // =========================================================


    type ColorOrderItem = {
      id: string;
      colorId: number | null;
      publicId: string | null;
      name: string;
      model: string;
      sortOrder: number;
      isNew: boolean;
      deleted: boolean;
      hasNewImage: boolean;
      images?: ColorGalleryImage[];
    };

    const colorOrder =
      formData
        .getAll("colorOrder")
        .map((item) =>
          JSON.parse(
            item.toString()
          )
        ) as ColorOrderItem[];

    const newColorOrder =
      colorOrder.filter(
        (color) =>
          color.isNew &&
          !color.deleted
      );


    // =========================================================
    // PRODUCT VARIANTS
    // =========================================================

    type VariantOrderItem = {
      id: string;
      colorId: number | null;
      size: string;
      model: string;
      dimensions: string;
      imageUrl?: string;
      publicId?: string;
      hasNewImage?: boolean;
      images?: {
        id: string;
        url: string;
        publicId: string;
        sortOrder: number;
        isNew?: boolean;
        deleted?: boolean;
      }[];
      sortOrder: number;
      isNew: boolean;
      deleted: boolean;
    };

    const variantOrder =
      formData
        .getAll("variantOrder")
        .map((item) =>
          JSON.parse(
            item.toString()
          )
        ) as VariantOrderItem[];


    const uploadedColors = newColorOrder
      .map((color, colorIndex) => {
        const galleryImages =
          Array.isArray(color.images)
            ? color.images
                .filter(
                  (image) =>
                    image &&
                    image.url &&
                    image.publicId &&
                    !image.deleted
                )
                .map((image, imageIndex) => ({
                  url: image.url,
                  publicId: image.publicId,
                  sortOrder:
                    image.sortOrder ??
                    imageIndex + 1,
                }))
            : [];


        if (galleryImages.length === 0) {
          return null;
        }

        return {
          colorId: color.colorId,
          name: color.name,
          model: color.model,
          imageUrl:
            galleryImages[0].url,
          publicId:
            galleryImages[0].publicId,
          sortOrder: color.sortOrder,
          images: galleryImages,
        };
      })
      .filter(
        (
          color
        ): color is NonNullable<
          typeof color
        > => color !== null
      );

    // =========================================================
    // PRODUCT BASIC INFORMATION
    // =========================================================

    const slug =
      await generateProductSlug(
        formData.get(
          "name"
        ) as string,
        formData
          .get("model")
          ?.toString() || null,
        id
      );

    const customPackagingId =
      getCustomPackagingId(
        formData
      );
    const categoryRelations =
      await getProductCategoryRelations(
        formData
      );

    await prisma.product.update({
      where: {
        id,
      },

      data: {
        brand:
          formData.get(
            "brand"
          ) as string,

        sku:
          formData
            .get("sku")
            ?.toString() || null,

        name:
          formData.get(
            "name"
          ) as string,

        slug,

        model:
          formData
            .get("model")
            ?.toString() || null,

        shortDescription:
          formData
            .get(
              "shortDescription"
            )
            ?.toString() || null,

        costPriceCny:
          Number(
            formData.get(
              "costPriceCny"
            )
          ) || null,

        priceRemark:
          formData
            .get("priceRemark")
            ?.toString() || null,

        price:
          Number(
            formData.get(
              "price"
            )
          ),

        description:
          formData.get(
            "description"
          ) as string,

        category:
          categoryRelations.categoryName,

        subCategory:
          categoryRelations.subCategoryName,

        categoryId:
          categoryRelations.categoryId,

        subCategoryId:
          categoryRelations.subCategoryId,

        mainColor:
          formData
            .get("mainColor")
            ?.toString() || null,

        dimensions:
          formData
            .get("dimensions")
            ?.toString() || null,

        customPackagingId,

        availability:
          formData.get(
            "availability"
          ) as Availability,

        featured:
          formData.get(
            "featured"
          ) === "on",

        newArrival:
          formData.get(
            "newArrival"
          ) === "on",

        bestSeller:
          formData.get(
            "bestSeller"
          ) === "on",

        limited:
          formData.get(
            "limited"
          ) === "on",

        onSale:
          formData.get(
            "onSale"
          ) === "on",
      },
    });

    // =========================================================
    // DELETE PRODUCT IMAGES
    // =========================================================

    const deletedImages =
      imageOrder.filter(
        (image) =>
          image.deleted
      );

    console.log(
      "deletedImages:",
      deletedImages
    );

    for (
      const image of
        deletedImages
    ) {
      if (image.publicId) {
        console.log(
          "Deleting Cloudinary:",
          image.publicId
        );

        await cloudinary.uploader.destroy(
          image.publicId
        );
      }

      const databaseId =
        Number(image.id);

      if (
        Number.isInteger(
          databaseId
        ) &&
        databaseId > 0
      ) {
        console.log(
          "Deleting DB Image:",
          databaseId
        );

        await prisma.productImage.delete({
          where: {
            id: databaseId,
          },
        });
      }
    }

    // =========================================================
    // UPDATE EXISTING PRODUCT IMAGE ORDER
    // =========================================================

    await prisma.productImage.updateMany({
      where: {
        productId: id,
      },

      data: {
        sortOrder: {
          increment: 1000,
        },
      },
    });

    for (
      const image of
        imageOrder.filter(
          (image) =>
            !image.isNew &&
            !image.deleted
        )
    ) {
      await prisma.productImage.update({
        where: {
          id: Number(
            image.id
          ),
        },

        data: {
          sortOrder:
            image.sortOrder,
        },
      });
    }

    // =========================================================
    // CREATE NEW PRODUCT IMAGES
    // =========================================================

    if (
      uploadedImages.length >
      0
    ) {
      await prisma.productImage.createMany({
        data: uploadedImages.map(
          (image) => ({
            productId: id,
            url: image.url,
            publicId:
              image.publicId,
            sortOrder:
              image.sortOrder,
          })
        ),
      });
    }

    // =========================================================
    // DELETE PRODUCT COLORS
    // =========================================================

    const deletedColors =
      colorOrder.filter(
        (color) =>
          !color.isNew &&
          color.deleted
      );

    for (
      const color of
        deletedColors
    ) {
      const databaseId =
        Number(color.id);

      const colorRecord =
        await prisma.productColor.findUnique({
          where: {
            id: databaseId,
          },
          include: {
            images: true,
          },
        });

      if (colorRecord) {
        const publicIds = new Set<string>();

        if (colorRecord.publicId) {
          publicIds.add(
            colorRecord.publicId
          );
        }

        for (
          const image of
            colorRecord.images
        ) {
          if (image.publicId) {
            publicIds.add(
              image.publicId
            );
          }
        }

        for (
          const publicId of
            publicIds
        ) {
          await cloudinary.uploader.destroy(
            publicId
          );
        }
      }

      await prisma.productColor.delete({
        where: {
          id: databaseId,
        },
      });
    }

    // =========================================================
    // UPDATE EXISTING PRODUCT COLORS
    // =========================================================

    await prisma.productColor.updateMany({
      where: {
        productId: id,
      },
      data: {
        sortOrder: {
          increment: 1000,
        },
      },
    });

    for (
      const color of
        colorOrder.filter(
          (color) =>
            !color.isNew &&
            !color.deleted
        )
    ) {
      const databaseId =
        Number(color.id);

      await prisma.productColor.update({
        where: {
          id: databaseId,
        },
        data: {
          colorId: color.colorId,
          name: color.name,
          model: color.model,
          sortOrder:
            color.sortOrder,
        },
      });

      const newGallery =
        Array.isArray(color.images)
          ? color.images
              .filter(
                (image) =>
                  image &&
                  image.url &&
                  image.publicId &&
                  !image.deleted
              )
              .map(
                (image, index) => ({
                  url: image.url,
                  publicId:
                    image.publicId,
                  sortOrder:
                    image.sortOrder ??
                    index + 1,
                })
              )
          : [];

      /*
       * If the new Color Gallery is present,
       * replace the existing gallery.
       *
       * If no gallery is supplied, keep the
       * existing legacy image/data untouched.
       */
      if (newGallery.length > 0) {
        const existingColor =
          await prisma.productColor.findUnique({
            where: {
              id: databaseId,
            },
            include: {
              images: true,
            },
          });

        if (existingColor) {
          const newPublicIds =
            new Set(
              newGallery.map(
                (image) =>
                  image.publicId
              )
            );

          const oldPublicIds =
            new Set<string>();

          if (
            existingColor.publicId &&
            !newPublicIds.has(
              existingColor.publicId
            )
          ) {
            oldPublicIds.add(
              existingColor.publicId
            );
          }

          for (
            const image of
              existingColor.images
          ) {
            if (
              image.publicId &&
              !newPublicIds.has(
                image.publicId
              )
            ) {
              oldPublicIds.add(
                image.publicId
              );
            }
          }

          for (
            const publicId of
              oldPublicIds
          ) {
            await cloudinary.uploader.destroy(
              publicId
            );
          }

          await prisma.productColorImage.deleteMany({
            where: {
              colorId: databaseId,
            },
          });

          await prisma.productColorImage.createMany({
            data: newGallery.map(
              (image) => ({
                colorId: databaseId,
                url: image.url,
                publicId:
                  image.publicId,
                sortOrder:
                  image.sortOrder,
              })
            ),
          });

          await prisma.productColor.update({
            where: {
              id: databaseId,
            },
            data: {
              imageUrl:
                newGallery[0].url,
              publicId:
                newGallery[0].publicId,
            },
          });
        }
      }
    }

    // =========================================================
    // CREATE NEW PRODUCT COLORS
    // =========================================================

    for (
      const color of
        uploadedColors
    ) {
      await prisma.productColor.create({
        data: {
          productId: id,
          colorId: color.colorId,
          name: color.name,
          model: color.model,
          imageUrl:
            color.imageUrl,
          publicId:
            color.publicId,
          sortOrder:
            color.sortOrder,
          images: {
            create:
              color.images.map(
                (image) => ({
                  url:
                    image.url,
                  publicId:
                    image.publicId,
                  sortOrder:
                    image.sortOrder,
                })
              ),
          },
        },
      });
    }

    // =========================================================
    // DELETE VARIANTS
    // =========================================================

    const deletedVariants =
      variantOrder.filter(
        (variant) =>
          !variant.isNew &&
          variant.deleted
      );

    for (
      const variant of
        deletedVariants
    ) {
      if (variant.publicId) {
        await cloudinary.uploader.destroy(
          variant.publicId
        );
      }

      await prisma.productVariant.delete({
        where: {
          id: Number(
            variant.id
          ),
        },
      });
    }

    // =========================================================
    // UPDATE EXISTING VARIANTS

    const existingVariants =
      variantOrder.filter(
        (variant) =>
          !variant.isNew &&
          !variant.deleted
      );

    for (
      const variant of
        existingVariants
    ) {
      const galleryImages =
        Array.isArray(
          variant.images
        )
          ? variant.images
              .filter(
                (image) =>
                  image &&
                  image.url &&
                  image.publicId &&
                  !image.deleted
              )
              .map(
                (
                  image,
                  imageIndex
                ) => ({
                  url:
                    image.url,
                  publicId:
                    image.publicId,
                  sortOrder:
                    image.sortOrder ??
                    imageIndex,
                })
              )
          : [];

      const firstGalleryImage =
        galleryImages[0];

      await prisma.productVariant.update({
        where: {
          id: Number(
            variant.id
          ),
        },

        data: {
          colorId:
            variant.colorId,

          size:
            variant.size,

          model:
            variant.model ||
            null,

          dimensions:
            variant.dimensions ||
            null,

          imageUrl:
            firstGalleryImage
              ?.url ??
            variant.imageUrl ??
            null,

          publicId:
            firstGalleryImage
              ?.publicId ??
            variant.publicId ??
            null,

          sortOrder:
            variant.sortOrder,
        },
      });

      if (
        galleryImages.length >
        0
      ) {
        const existingImages =
          await prisma.productVariantImage.findMany({
            where: {
              variantId:
                Number(
                  variant.id
                ),
            },
            select: {
              publicId: true,
            },
          });

        const newPublicIds =
          new Set(
            galleryImages.map(
              (image) =>
                image.publicId
            )
          );

        for (
          const image of
            existingImages
        ) {
          if (
            image.publicId &&
            !newPublicIds.has(
              image.publicId
            )
          ) {
            await cloudinary.uploader.destroy(
              image.publicId
            );
          }
        }

        await prisma.productVariantImage.deleteMany({
          where: {
            variantId:
              Number(
                variant.id
              ),
          },
        });

        await prisma.productVariantImage.createMany({
          data:
            galleryImages.map(
              (image) => ({
                variantId:
                  Number(
                    variant.id
                  ),
                url:
                  image.url,
                publicId:
                  image.publicId,
                sortOrder:
                  image.sortOrder,
              })
            ),
        });
      }
    }

    // CREATE NEW VARIANTS

    const newVariants =
      variantOrder.filter(
        (variant) =>
          variant.isNew &&
          !variant.deleted
      );

    for (
      const variant of
        newVariants
    ) {
      const galleryImages =
        Array.isArray(
          variant.images
        )
          ? variant.images
              .filter(
                (image) =>
                  image &&
                  image.url &&
                  image.publicId &&
                  !image.deleted
              )
              .map(
                (
                  image,
                  imageIndex
                ) => ({
                  url:
                    image.url,
                  publicId:
                    image.publicId,
                  sortOrder:
                    image.sortOrder ??
                    imageIndex,
                })
              )
          : [];

      const createdVariant =
        await prisma.productVariant.create({
          data: {
            productId: id,

            colorId:
              variant.colorId,

            size:
              variant.size,

            model:
              variant.model ||
              null,

            dimensions:
              variant.dimensions ||
              null,

            imageUrl:
              galleryImages[0]
                ?.url ??
              variant.imageUrl ??
              null,

            publicId:
              galleryImages[0]
                ?.publicId ??
              variant.publicId ??
              null,

            sortOrder:
              variant.sortOrder,
          },
        });

      if (
        galleryImages.length >
        0
      ) {
        await prisma.productVariantImage.createMany({
          data:
            galleryImages.map(
              (image) => ({
                variantId:
                  createdVariant.id,
                url:
                  image.url,
                publicId:
                  image.publicId,
                sortOrder:
                  image.sortOrder,
              })
            ),
        });
      }
    }

    // REVALIDATE
    // =========================================================

    revalidatePath(
      "/admin/dashboard/products"
    );

    return {
      success: true,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function duplicateProduct(
  id: number
) {
  const product =
    await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        colors: {
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },

        variants: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

  if (!product) {
    redirect(
      "/admin/dashboard/products"
    );
  }

  const slug =
    await generateProductSlug(
      `${product.name} (Copy)`,
      product.model
    );

  const newProduct =
    await prisma.product.create({
      data: {
        slug,

        sku: null,

        brand:
          product.brand,

        category:
          product.category,

        subCategory:
          product.subCategory,

        categoryId:
          product.categoryId,

        subCategoryId:
          product.subCategoryId,

        name:
          `${product.name} (Copy)`,

        model:
          product.model,

        shortDescription:
          product.shortDescription,

        description:
          product.description,

        costPriceCny:
          product.costPriceCny,

        priceRemark:
          product.priceRemark,

        price:
          product.price,

        mainColor:
          product.mainColor,

        dimensions:
          product.dimensions,

        customPackagingId:
          product.customPackagingId,

        availability:
          product.availability,

        featured:
          product.featured,

        newArrival:
          product.newArrival,

        bestSeller:
          product.bestSeller,

        limited:
          product.limited,

        onSale:
          product.onSale,

        images: {
          create:
            product.images.map(
              (image) => ({
                url: image.url,
                publicId:
                  image.publicId,
                sortOrder:
                  image.sortOrder,
              })
            ),
        },

        colors: {
          create:
            product.colors.map(
              (color) => ({
                colorId:
                  color.colorId,

                name:
                  color.name,

                model:
                  color.model,

                imageUrl:
                  color.imageUrl,

                publicId:
                  color.publicId,

                sortOrder:
                  color.sortOrder,

                images: {
                  create:
                    color.images.map(
                      (image) => ({
                        url:
                          image.url,
                        publicId:
                          image.publicId,
                        sortOrder:
                          image.sortOrder,
                      })
                    ),
                },
              })
            ),
        },

        variants: {
          create:
            product.variants.map(
              (variant) => ({
                colorId:
                  variant.colorId,

                size:
                  variant.size,

                model:
                  variant.model,

                dimensions:
                  variant.dimensions,

                imageUrl:
                  variant.imageUrl,

                publicId:
                  variant.publicId,

                sortOrder:
                  variant.sortOrder,
              })
            ),
        },
      },
    });

  redirect(
    `/admin/dashboard/products/${newProduct.id}/edit`
  );
}

export async function deleteProduct(
  id: number
) {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);

  const product =
    await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        images: true,
        colors: {
          include: {
            images: true,
          },
        },
        variants: true,
      },
    });

  if (!product) {
    redirect(
      "/admin/dashboard/products"
    );
  }

  for (
    const image of
      product.images
  ) {
    await cloudinary.uploader.destroy(
      image.publicId
    );
  }

  for (
    const color of
      product.colors
  ) {
    const publicIds = new Set<string>();

    if (color.publicId) {
      publicIds.add(
        color.publicId
      );
    }

    for (
      const image of
        color.images
    ) {
      if (image.publicId) {
        publicIds.add(
          image.publicId
        );
      }
    }

    for (
      const publicId of
        publicIds
    ) {
      await cloudinary.uploader.destroy(
        publicId
      );
    }
  }

  for (
    const variant of
      product.variants
  ) {
    if (variant.publicId) {
      await cloudinary.uploader.destroy(
        variant.publicId
      );
    }
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath(
    "/admin/dashboard/products"
  );
}

export async function deleteProducts(
  ids: number[]
) {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);

  const products =
    await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },

      include: {
        images: true,
        colors: {
          include: {
            images: true,
          },
        },
        variants: true,
      },
    });

  for (
    const product of
      products
  ) {
    for (
      const image of
        product.images
    ) {
      await cloudinary.uploader.destroy(
        image.publicId
      );
    }

    for (
      const color of
        product.colors
    ) {
      const publicIds = new Set<string>();

      if (color.publicId) {
        publicIds.add(
          color.publicId
        );
      }

      for (
        const image of
          color.images
      ) {
        if (image.publicId) {
          publicIds.add(
            image.publicId
          );
        }
      }

      for (
        const publicId of
          publicIds
      ) {
        await cloudinary.uploader.destroy(
          publicId
        );
      }
    }

    for (
      const variant of
        product.variants
    ) {
      if (variant.publicId) {
        await cloudinary.uploader.destroy(
          variant.publicId
        );
      }
    }
  }

  await prisma.product.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  revalidatePath(
    "/admin/dashboard/products"
  );
}

export async function updateProducts(
  ids: number[],
  data: {
    brand?: string;
    category?: string;
    availability?: Availability;
    featured?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
    limited?: boolean;
    onSale?: boolean;
    price?: number;
  }
) {
  await prisma.product.updateMany({
    where: {
      id: {
        in: ids,
      },
    },

    data,
  });

  revalidatePath(
    "/admin/dashboard/products"
  );
}

export async function updateProductDisplayOrder(
  orderedIds: number[]
) {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);

  if (orderedIds.length === 0) {
    return;
  }

  /*
   * =========================================================
   * REMOVE DUPLICATES
   * =========================================================
   */

  const uniqueOrderedIds =
    Array.from(
      new Set(orderedIds)
    );

  /*
   * =========================================================
   * STEP 1
   * LOAD THE COMPLETE GLOBAL PRODUCT ORDER
   * =========================================================
   *
   * displayOrder is global, so we must read every product
   * before calculating the new positions.
   */

  const allProducts =
    await prisma.product.findMany({
      select: {
        id: true,
        displayOrder: true,
      },

      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

  if (allProducts.length === 0) {
    return;
  }

  /*
   * =========================================================
   * STEP 2
   * CURRENT GLOBAL ORDER
   * =========================================================
   */

  const globalIds =
    allProducts.map(
      (product) =>
        product.id
    );

  const globalIdSet =
    new Set(globalIds);

  /*
   * =========================================================
   * STEP 3
   * VALIDATE CLIENT IDS
   * =========================================================
   */

  const hasInvalidId =
    uniqueOrderedIds.some(
      (id) =>
        !globalIdSet.has(id)
    );

  if (hasInvalidId) {
    throw new Error(
      "Invalid product IDs in reorder request."
    );
  }

  /*
   * =========================================================
   * STEP 4
   * FIND THE GLOBAL POSITIONS
   * =========================================================
   *
   * Example:
   *
   * Global:
   *
   * A B C D E F G H
   *
   * Visible products:
   *
   * B D F H
   *
   * Their global positions are:
   *
   * 1 3 5 7
   *
   * New visible order:
   *
   * H B F D
   *
   * Final global order:
   *
   * A H C B E F G D
   */

  const orderedIdSet =
    new Set(
      uniqueOrderedIds
    );

  const targetIndexes =
    globalIds
      .map(
        (
          id,
          index
        ) =>
          orderedIdSet.has(id)
            ? index
            : -1
      )
      .filter(
        (index) =>
          index !== -1
      );

  if (
    targetIndexes.length !==
    uniqueOrderedIds.length
  ) {
    throw new Error(
      "Product reorder data is invalid."
    );
  }

  /*
   * =========================================================
   * STEP 5
   * BUILD THE NEW GLOBAL ORDER
   * =========================================================
   */

  const reorderedGlobalIds =
    [...globalIds];

  uniqueOrderedIds.forEach(
    (
      productId,
      index
    ) => {
      const targetIndex =
        targetIndexes[index];

      reorderedGlobalIds[
        targetIndex
      ] = productId;
    }
  );

  /*
   * =========================================================
   * STEP 6
   * UPDATE ALL DISPLAY ORDERS IN ONE SQL QUERY
   * =========================================================
   *
   * IMPORTANT:
   *
   * Do not use hundreds of individual tx.product.update()
   * calls here.
   *
   * The previous implementation used an interactive Prisma
   * transaction with many sequential updates. With a larger
   * catalogue, the transaction could close before all updates
   * completed and produce:
   *
   * "Transaction API error: Transaction not found."
   *
   * One SQL UPDATE avoids that problem.
   */

  const cases =
    reorderedGlobalIds.map(
      (
        productId,
        index
      ) =>
        Prisma.sql`
          WHEN ${productId}
          THEN ${index}
        `
    );

  const ids =
    Prisma.join(
      reorderedGlobalIds
    );

  await prisma.$executeRaw(
    Prisma.sql`
      UPDATE "Product"
      SET "displayOrder" =
        CASE "id"
          ${Prisma.join(
            cases,
            " "
          )}
          ELSE "displayOrder"
        END
      WHERE "id" IN (${ids})
    `
  );

  /*
   * =========================================================
   * REVALIDATE
   * =========================================================
   */

  revalidatePath(
    "/admin/dashboard/products"
  );
}