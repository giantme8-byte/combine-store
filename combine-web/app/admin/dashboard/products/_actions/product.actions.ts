"use server";

import { Availability, UserRole } from "@prisma/client";
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

async function uploadImage(
  file: File,
  folder: string
) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(
              new Error(
                "Cloudinary upload returned no result."
              )
            );
          }
        }
      ).end(buffer);
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/**
 * Upload one image with automatic retry.
 *
 * A failed upload is retried up to 3 times so a temporary
 * network/Cloudinary error does not fail the whole product.
 */
async function uploadImageWithRetry(
  file: File,
  folder: string,
  maxRetries = 3
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Uploading ${file.name} - attempt ${attempt}/${maxRetries}`
      );

      return await uploadImage(file, folder);
    } catch (error) {
      lastError = error;

      console.error(
        `Upload failed: ${file.name} - attempt ${attempt}`,
        error
      );

      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 500 * attempt)
        );
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to upload ${file.name}`);
}

/**
 * Upload files with controlled concurrency.
 *
 * 9 images become:
 * 3 uploads -> 3 uploads -> 3 uploads
 *
 * This is faster than uploading one-by-one while being much
 * more stable than opening 9 Cloudinary uploads at once.
 */
async function uploadImages(
  files: File[],
  folder: string,
  concurrency = 3
) {
  const validFiles = files
    .map((file, index) => ({ file, index }))
    .filter(({ file }) => file && file.size > 0);

  const results: {
    index: number;
    url: string;
    publicId: string;
  }[] = [];

  for (let i = 0; i < validFiles.length; i += concurrency) {
    const batch = validFiles.slice(i, i + concurrency);

    console.log(
      `Uploading batch ${
        Math.floor(i / concurrency) + 1
      }/${Math.ceil(validFiles.length / concurrency)}`
    );

    const batchResults = await Promise.all(
      batch.map(async ({ file, index }) => {
        const uploaded = await uploadImageWithRetry(
          file,
          folder
        );

        return {
          index,
          url: uploaded.url,
          publicId: uploaded.publicId,
        };
      })
    );

    results.push(...batchResults);
  }

  return results.sort((a, b) => a.index - b.index);
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

  revalidatePath("/admin/dashboard/products");
}

export async function createProduct(
  formData: FormData
) {

try {
  console.log("=== CREATE PRODUCT START ===");

  // Gallery Images
  const files =
    formData.getAll("images") as File[];

  const uploadedImages: UploadedImage[] = [];

const galleryUploads = await uploadImages(
  files,
  "combine-store/gallery",
  3
);

for (const uploaded of galleryUploads) {
  uploadedImages.push({
    url: uploaded.url,
    publicId: uploaded.publicId,
    sortOrder: uploaded.index,
  });
}

console.log(
  "Gallery uploaded:",
  uploadedImages.length
);

  // Product Colors
  const colorFiles =
    formData.getAll("colorImages") as File[];

type ColorOrderItem = {
  id: string;

  publicId: string | null;

  name: string;

  model: string;

  sortOrder: number;

  isNew: boolean;

  deleted: boolean;
};

  const colorOrder =
    formData
      .getAll("colorOrder")
      .map((item) =>
        JSON.parse(item.toString())
      ) as ColorOrderItem[];

type VariantOrderItem = {
  id: string;

  size: string;

  model: string;

  dimensions: string;

  imageUrl?: string;

  publicId?: string;

  hasNewImage?: boolean;

  sortOrder: number;

  isNew: boolean;

  deleted: boolean;
};

const variantOrder = formData
  .getAll("variantOrder")
  .map((item) =>
    JSON.parse(item.toString())
  ) as VariantOrderItem[];   
  
const activeVariants = variantOrder.filter(
  (variant) => !variant.deleted
);  

const variantFiles =
  formData.getAll("variantImages") as File[];

const uploadedVariants: {
  imageUrl: string;
  publicId: string;
}[] = [];


const variantUploads = await uploadImages(
  variantFiles,
  "combine-store/variants",
  3
);

for (const uploaded of variantUploads) {
  uploadedVariants.push({
    imageUrl: uploaded.url,
    publicId: uploaded.publicId,
  });
}

  const newColorOrder =
    colorOrder.filter(
      (color) =>
        color.isNew &&
        !color.deleted
    );

const uploadedColors: {
  name: string;

  model: string;

  imageUrl: string;

  publicId: string;

  sortOrder: number;
}[] = [];

  const colorUploads = await uploadImages(
    colorFiles,
    "combine-store/colors",
    3
  );

  for (const uploaded of colorUploads) {
    const color = newColorOrder[uploaded.index];

    if (!color) continue;

    uploadedColors.push({
      name: color.name,
      model: color.model,
      imageUrl: uploaded.url,
      publicId: uploaded.publicId,
      sortOrder: color.sortOrder,
    });
  }

console.log("Before prisma.product.create");

const slug = await generateProductSlug(
  formData.get("name") as string,
  formData.get("model")?.toString() || null
);

const customPackagingId =
  getCustomPackagingId(formData);

await prisma.product.create({

      data:{


brand:
  formData.get("brand") as string,

sku:
  formData.get("sku")?.toString() || null,

name:
  formData.get("name") as string,

slug,

model:
          formData.get(
            "model"
          )?.toString()
          || null,


        shortDescription:
          formData.get(
            "shortDescription"
          )?.toString()
          || null,


        costPriceCny:
          Number(
            formData.get(
              "costPriceCny"
            )
          ) || null,


        priceRemark:
          formData.get(
            "priceRemark"
          )?.toString()
          || null,


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
          formData.get(
            "category"
          ) as string,


        subCategory:
          formData.get(
            "subCategory"
          )?.toString()
          || null,



        mainColor:
          formData.get(
            "mainColor"
          )?.toString()
          || null,



        dimensions:
          formData.get(
            "dimensions"
          )?.toString()
          || null,

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



        images:{
          create:
            uploadedImages,
        },

colors: {
  create: uploadedColors.map((color) => ({
    name: color.name,

    model: color.model,

    imageUrl: color.imageUrl,

    publicId: color.publicId,

    sortOrder: color.sortOrder,
  })),
},

variants: {
  create: activeVariants.map(
    (variant, index) => ({
      size: variant.size,

      model:
        variant.model || null,

      dimensions:
        variant.dimensions || null,

      imageUrl:
        uploadedVariants[index]?.imageUrl ||
        null,

      publicId:
        uploadedVariants[index]?.publicId ||
        null,

      sortOrder:
        variant.sortOrder,
    })
  ),
},


      },

    });



console.log("After prisma.product.create");

console.log("Before redirect");

redirect(
  "/admin/dashboard/products"
);


} catch (err) {
  console.error("========== CREATE PRODUCT ERROR ==========");
  console.error(err);

  if (err instanceof Error) {
    console.error(err.message);
    console.error(err.stack);
  }

  throw err;
}

}
export async function updateProduct(
  id:number,
  formData:FormData
){

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



    if(!product){

      throw new Error(
        "Product not found"
      );

    }




const files =
  formData.getAll("images") as File[];

type ImageOrderItem = {
  id: string;
  publicId: string | null;
  sortOrder: number;
  isNew: boolean;
  deleted: boolean;
};

const imageOrder = formData
  .getAll("imageOrder")
  .map((item) => JSON.parse(item.toString())) as ImageOrderItem[];

const newImageOrder = imageOrder.filter(
  (image) => image.isNew && !image.deleted
);  

const uploadedImages: UploadedImage[] = [];

const colorFiles =
  formData.getAll("colorImages") as File[];

type ColorOrderItem = {
  id: string;

  publicId: string | null;

  name: string;

  model: string;

  sortOrder: number;

  isNew: boolean;

  deleted: boolean;

  hasNewImage: boolean;
};

const colorOrder = formData
  .getAll("colorOrder")
  .map((item) =>
    JSON.parse(item.toString())
  ) as ColorOrderItem[];

const newColorOrder =
  colorOrder.filter(
    (color) =>
      color.isNew &&
      !color.deleted
  );

const replaceColors =
  colorOrder.filter(
    (color) =>
      !color.isNew &&
      !color.deleted &&
      color.hasNewImage
  );

const uploadedColors: {
  name: string;

  model: string;

  imageUrl: string;

  publicId: string;

  sortOrder: number;
}[] = [];

type VariantOrderItem = {
  id: string;

  size: string;

  model: string;

  dimensions: string;

  imageUrl?: string;

  publicId?: string;

  hasNewImage?: boolean;

  sortOrder: number;

  isNew: boolean;

  deleted: boolean;
};

const variantOrder = formData
  .getAll("variantOrder")
  .map((item) =>
    JSON.parse(item.toString())
  ) as VariantOrderItem[];

const variantFiles =
  formData.getAll("variantImages") as File[];


const uploadedVariants: {
  imageUrl: string;
  publicId: string;
}[] = [];


const variantUploads = await uploadImages(
  variantFiles,
  "combine-store/variants",
  3
);

for (const uploaded of variantUploads) {
  uploadedVariants.push({
    imageUrl: uploaded.url,
    publicId: uploaded.publicId,
  });
}

    if (files.length > 0) {
      const galleryUploads = await uploadImages(
        files,
        "combine-store/gallery",
        3
      );

      for (const uploaded of galleryUploads) {
        const image = newImageOrder[uploaded.index];

        if (!image) continue;

        uploadedImages.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
          sortOrder: image.sortOrder,
        });
      }
    }


    const colorUploads = await uploadImages(
      colorFiles,
      "combine-store/colors",
      3
    );

    for (const uploaded of colorUploads) {
      const color = newColorOrder[uploaded.index];

      if (!color) continue;

      uploadedColors.push({
        name: color.name,
        model: color.model,
        imageUrl: uploaded.url,
        publicId: uploaded.publicId,
        sortOrder: color.sortOrder,
      });
    }

const slug = await generateProductSlug(
  formData.get("name") as string,
  formData.get("model")?.toString() || null,
  id
);

const customPackagingId =
  getCustomPackagingId(formData);

    await prisma.product.update({

      where:{
        id,
      },


      data:{


brand:
  formData.get("brand") as string,

sku:
  formData.get("sku")?.toString() || null,

name:
  formData.get("name") as string,

slug,

model:
          formData.get(
            "model"
          )?.toString()
          || null,


        shortDescription:
          formData.get(
            "shortDescription"
          )?.toString()
          || null,


        costPriceCny:
          Number(
            formData.get(
              "costPriceCny"
            )
          ) || null,


        priceRemark:
          formData.get(
            "priceRemark"
          )?.toString()
          || null,


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
          formData.get(
            "category"
          ) as string,


        subCategory:
          formData.get(
            "subCategory"
          )?.toString()
          || null,



        mainColor:
          formData.get(
            "mainColor"
          )?.toString()
          || null,



        dimensions:
          formData.get(
            "dimensions"
          )?.toString()
          || null,

        customPackagingId,

        availability:
          formData.get(
            "availability"
          ) as Availability,



        featured:
          formData.get(
            "featured"
          )
          === "on",


        newArrival:
          formData.get(
            "newArrival"
          )
          === "on",


        bestSeller:
          formData.get(
            "bestSeller"
          )
          === "on",


        limited:
          formData.get(
            "limited"
          )
          === "on",


        onSale:
          formData.get(
            "onSale"
          )
          === "on",

      },

    });

const deletedImages = imageOrder.filter(
  (image) => !image.isNew && image.deleted
);

console.log("deletedImages:", deletedImages);

for (const image of deletedImages) {

  console.log("Deleting Cloudinary:", image.publicId);

  if (image.publicId) {
    await cloudinary.uploader.destroy(image.publicId);
  }

  console.log("Deleting DB Image:", image.id);

  await prisma.productImage.delete({
    where: {
      id: Number(image.id),
    },
  });
}

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

for (const image of imageOrder.filter(
  (image) => !image.isNew && !image.deleted
)) {
  await prisma.productImage.update({
    where: {
      id: Number(image.id),
    },
    data: {
      sortOrder: image.sortOrder,
    },
  });
}

if (uploadedImages.length > 0) {
  await prisma.productImage.createMany({
    data: uploadedImages.map((image) => ({
      productId: id,
      url: image.url,
      publicId: image.publicId,
      sortOrder: image.sortOrder,
    })),
  });
}

const deletedColors = colorOrder.filter(
  (color) => !color.isNew && color.deleted
);

for (const color of deletedColors) {

  if (color.publicId) {
    await cloudinary.uploader.destroy(
      color.publicId
    );
  }

  await prisma.productColor.delete({
    where: {
      id: Number(color.id),
    },
  });

}

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
  const color of colorOrder.filter(
    (color) =>
      !color.isNew &&
      !color.deleted
  )
) {

await prisma.productColor.update({
  where: {
    id: Number(color.id),
  },
  data: {
    name: color.name,

    model: color.model,

    sortOrder: color.sortOrder,
  },
});

}

if (uploadedColors.length > 0) {

  await prisma.productColor.createMany({

data: uploadedColors.map(
  (color) => ({
    productId: id,

    name: color.name,

    model: color.model,

    imageUrl: color.imageUrl,

    publicId: color.publicId,

    sortOrder: color.sortOrder,
  })
),

  });

}

// Delete variants
const deletedVariants = variantOrder.filter(
  (variant) => !variant.isNew && variant.deleted
);

for (const variant of deletedVariants) {

  if (variant.publicId) {
    await cloudinary.uploader.destroy(
      variant.publicId
    );
  }


  await prisma.productVariant.delete({
    where: {
      id: Number(variant.id),
    },
  });

}

// Update existing variants
const existingVariants = variantOrder.filter(
  (variant) =>
    !variant.isNew &&
    !variant.deleted
);

for (
  let index = 0;
  index < existingVariants.length;
  index++
) {
  const variant = existingVariants[index];

  await prisma.productVariant.update({
    where: {
      id: Number(variant.id),
    },
    data: {
      size: variant.size,

      model: variant.model || null,

      dimensions: variant.dimensions || null,

      imageUrl: variant.hasNewImage
        ? uploadedVariants[index]?.imageUrl ??
          variant.imageUrl ??
          null
        : variant.imageUrl ?? null,

      publicId: variant.hasNewImage
        ? uploadedVariants[index]?.publicId ??
          variant.publicId ??
          null
        : variant.publicId ?? null,

      sortOrder: variant.sortOrder,
    },
  });
}

// Create new variants
const newVariants = variantOrder.filter(
  (variant) =>
    variant.isNew &&
    !variant.deleted
);

if (newVariants.length > 0) {
  await prisma.productVariant.createMany({
data: newVariants.map(
  (variant, index) => ({
    productId: id,

    size: variant.size,

    model:
      variant.model || null,

    dimensions:
      variant.dimensions || null,


    imageUrl:
      uploadedVariants[index]?.imageUrl ??
      null,


    publicId:
      uploadedVariants[index]?.publicId ??
      null,


    sortOrder:
      variant.sortOrder,
  })
),
  });
}


    revalidatePath(
      "/admin/dashboard/products"
    );

    // Do not redirect here.
    // ProductForm handles returning to the user's
    // previous products page and scroll position.

  }catch(err){

    console.error(err);

    throw err;

  }

}








export async function duplicateProduct(id: number) {
  const product = await prisma.product.findUnique({
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
    redirect("/admin/dashboard/products");
  }

const slug = await generateProductSlug(
  `${product.name} (Copy)`,
  product.model
);

const newProduct = await prisma.product.create({
  data: {
    slug,

    sku: null,

    brand: product.brand,
    category: product.category,
    subCategory: product.subCategory,

    name: `${product.name} (Copy)`,
    model: product.model,

    shortDescription: product.shortDescription,
    description: product.description,

    costPriceCny: product.costPriceCny,
    priceRemark: product.priceRemark,

    price: product.price,

    mainColor: product.mainColor,
    dimensions: product.dimensions,

    customPackagingId:
      product.customPackagingId,

    availability: product.availability,

    featured: product.featured,
    newArrival: product.newArrival,
    bestSeller: product.bestSeller,
    limited: product.limited,
    onSale: product.onSale,

    images: {
      create: product.images.map((image) => ({
        url: image.url,
        publicId: image.publicId,
        sortOrder: image.sortOrder,
      })),
    },

colors: {
  create: product.colors.map((color) => ({
    name: color.name,

    model: color.model,

    imageUrl: color.imageUrl,

    publicId: color.publicId,

    sortOrder: color.sortOrder,
  })),
},

    variants: {
create: product.variants.map((variant) => ({
  size: variant.size,
  model: variant.model,
  dimensions: variant.dimensions,

  imageUrl: variant.imageUrl,
  publicId: variant.publicId,

  sortOrder: variant.sortOrder,
}))
    },
  },
});

redirect(`/admin/dashboard/products/${newProduct.id}/edit`);
}

export async function deleteProduct(id: number) {
await requireRole([
  UserRole.MANAGER,
  UserRole.ADMIN,
  UserRole.OWNER,
]);

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
      colors: true,
      variants: true,
    },
  });

  if (!product) {
    redirect("/admin/dashboard/products");
  }

  for (const image of product.images) {
    await cloudinary.uploader.destroy(image.publicId);
  }

for (const color of product.colors) {
  if (color.publicId) {
    await cloudinary.uploader.destroy(color.publicId);
  }
}

  for (const variant of product.variants) {
  if (variant.publicId) {
    await cloudinary.uploader.destroy(variant.publicId);
  }
}

  await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/dashboard/products");
}

export async function deleteProducts(ids: number[]) {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      images: true,
      colors: true,
      variants: true
    },
  });

for (const product of products) {
  for (const image of product.images) {
    await cloudinary.uploader.destroy(image.publicId);
  }

  for (const color of product.colors) {
    if (color.publicId) {
      await cloudinary.uploader.destroy(color.publicId);
    }
  }

  for (const variant of product.variants) {
    if (variant.publicId) {
      await cloudinary.uploader.destroy(variant.publicId);
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

  revalidatePath("/admin/dashboard/products");
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

  revalidatePath("/admin/dashboard/products");
}

export async function updateProductDisplayOrder(
  items: {
    id: number;
    displayOrder: number;
  }[]
) {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);

  await prisma.$transaction(
    items.map((item) =>
      prisma.product.update({
        where: {
          id: item.id,
        },
        data: {
          displayOrder: item.displayOrder,
        },
      })
    )
  );

  revalidatePath("/admin/dashboard/products");
}