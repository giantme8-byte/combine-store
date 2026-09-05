"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Buffer } from "buffer";

/*
 * =========================================================
 * Cloudinary Upload
 * =========================================================
 */

async function uploadImage(
  file: File,
  folder: string
) {
  const bytes =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(bytes);

  const result =
    await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
          },
          (
            error,
            result
          ) => {
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
    url:
      result.secure_url,

    publicId:
      result.public_id,
  };
}


/*
 * =========================================================
 * Cloudinary Upload With Retry
 * =========================================================
 */

async function uploadImageWithRetry(
  file: File,
  folder: string,
  maxRetries = 3
) {
  let lastError: unknown;

  for (
    let attempt = 1;
    attempt <= maxRetries;
    attempt++
  ) {
    try {
      return await uploadImage(
        file,
        folder
      );
    } catch (error) {
      lastError = error;

      console.error(
        `Upload failed: ${file.name}`,
        error
      );

      if (
        attempt <
        maxRetries
      ) {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500 * attempt
            )
        );
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(
        `Failed to upload ${file.name}`
      );
}


/*
 * =========================================================
 * Upload Multiple Images
 * =========================================================
 */

async function uploadImages(
  files: File[],
  folder: string,
  concurrency = 3
) {
  const validFiles =
    files.filter(
      (file) =>
        file &&
        file.size > 0
    );

  const results: {
    index: number;
    url: string;
    publicId: string;
  }[] = [];

  for (
    let i = 0;
    i < validFiles.length;
    i += concurrency
  ) {
    const batch =
      validFiles.slice(
        i,
        i + concurrency
      );

    const batchResults =
      await Promise.all(
        batch.map(
          async (
            file,
            batchIndex
          ) => {
            const uploaded =
              await uploadImageWithRetry(
                file,
                folder
              );

            return {
              index:
                i +
                batchIndex,

              url:
                uploaded.url,

              publicId:
                uploaded.publicId,
            };
          }
        )
      );

    results.push(
      ...batchResults
    );
  }

  return results;
}


/*
 * =========================================================
 * Parse Packaging Items
 * =========================================================
 */

function parseItems(
  formData: FormData
) {
  const raw =
    formData
      .get("items")
      ?.toString() ?? "[]";

  try {
    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error();
    }

    return parsed
      .map((item) =>
        String(item).trim()
      )
      .filter(Boolean);
  } catch {
    throw new Error(
      "Invalid packaging items."
    );
  }
}


/*
 * =========================================================
 * Parse Existing Images
 * =========================================================
 */

function parseImages(
  formData: FormData
) {
  const raw =
    formData
      .get(
        "existingImages"
      )
      ?.toString() ?? "[]";

  try {
    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error();
    }

    return parsed;
  } catch {
    throw new Error(
      "Invalid packaging images."
    );
  }
}


/*
 * =========================================================
 * Parse Deleted Images
 * =========================================================
 */

function parseDeletedImages(
  formData: FormData
) {
  const raw =
    formData
      .get(
        "deletedImages"
      )
      ?.toString() ?? "[]";

  try {
    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error();
    }

    return parsed
      .map(Number)
      .filter(
        Number.isInteger
      );
  } catch {
    throw new Error(
      "Invalid deleted images."
    );
  }
}


/*
 * =========================================================
 * Get Packaging Form Data
 * =========================================================
 */

function getData(
  formData: FormData
) {
  const type =
    formData
      .get("type")
      ?.toString() ?? "";

  const brand =
    formData
      .get("brand")
      ?.toString()
      .trim() || null;

  const name =
    formData
      .get("name")
      ?.toString()
      .trim() ?? "";

  const title =
    formData
      .get("title")
      ?.toString()
      .trim() || null;

  const description =
    formData
      .get("description")
      ?.toString()
      .trim() || null;

  const active =
    formData.get("active") ===
    "on";

  if (
    type !== "default" &&
    type !== "brand"
  ) {
    throw new Error(
      "Invalid packaging type."
    );
  }

  if (
    type === "brand" &&
    !brand
  ) {
    throw new Error(
      "Please select a brand."
    );
  }

  if (!name) {
    throw new Error(
      "Packaging name is required."
    );
  }

  return {
    type,

    brand:
      type === "brand"
        ? brand
        : null,

    name,

    title,

    description,

    active,
  };
}


/*
 * =========================================================
 * Generate Unique Packaging Key
 * =========================================================
 */

function getKey(
  type: string,
  brand: string | null
) {
  return type === "default"
    ? "__DEFAULT__"
    : `brand:${brand}`;
}


/*
 * =========================================================
 * Delete Cloudinary Image
 * =========================================================
 */

async function deleteCloudinaryImage(
  publicId: string
) {
  try {
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type:
          "image",
      }
    );
  } catch (error) {
    console.error(
      `Failed to delete Cloudinary image: ${publicId}`,
      error
    );
  }
}


/*
 * =========================================================
 * CREATE PACKAGING
 * =========================================================
 */

export async function createPackaging(
  formData: FormData
) {
  const data =
    getData(formData);

  const key =
    getKey(
      data.type,
      data.brand
    );

  /*
   * Prevent duplicate packaging.
   */
  const existing =
    await prisma.packagingProfile.findUnique(
      {
        where: {
          key,
        },
      }
    );

  if (existing) {
    throw new Error(
      "This packaging profile already exists."
    );
  }

  /*
   * Make sure selected brand exists.
   */
  if (data.type === "brand") {
    const brand =
      await prisma.brand.findUnique(
        {
          where: {
            name:
              data.brand!,
          },
        }
      );

    if (!brand) {
      throw new Error(
        "Selected brand was not found."
      );
    }
  }

  const items =
    parseItems(formData);

  const files =
    formData.getAll(
      "images"
    ) as File[];

  /*
   * Upload packaging images.
   */
  const uploads =
    await uploadImages(
      files,
      "combine-store/packaging"
    );

  /*
   * Create packaging profile.
   */
  await prisma.packagingProfile.create(
    {
      data: {
        key,

        name:
          data.name,

        brand:
          data.brand,

        title:
          data.title,

        description:
          data.description,

        active:
          data.active,

        images: {
          create:
            uploads.map(
              (
                image,
                index
              ) => ({
                url:
                  image.url,

                publicId:
                  image.publicId,

                sortOrder:
                  index + 1,
              })
            ),
        },

        items: {
          create:
            items.map(
              (
                item,
                index
              ) => ({
                name:
                  item,

                sortOrder:
                  index + 1,
              })
            ),
        },
      },
    }
  );

  revalidatePath(
    "/admin/dashboard/packaging"
  );

  redirect(
    "/admin/dashboard/packaging"
  );
}


/*
 * =========================================================
 * UPDATE PACKAGING
 * =========================================================
 */

export async function updatePackaging(
  id: number,
  formData: FormData
) {
  const data =
    getData(formData);

  /*
   * Find existing packaging.
   */
  const existing =
    await prisma.packagingProfile.findUnique(
      {
        where: {
          id,
        },

        include: {
          images: true,
        },
      }
    );

  if (!existing) {
    throw new Error(
      "Packaging not found."
    );
  }

  const key =
    getKey(
      data.type,
      data.brand
    );

  /*
   * Prevent duplicate key.
   */
  const duplicate =
    await prisma.packagingProfile.findFirst(
      {
        where: {
          key,

          id: {
            not: id,
          },
        },
      }
    );

  if (duplicate) {
    throw new Error(
      "This packaging profile already exists."
    );
  }

  /*
   * Make sure selected brand exists.
   */
  if (data.type === "brand") {
    const brand =
      await prisma.brand.findUnique(
        {
          where: {
            name:
              data.brand!,
          },
        }
      );

    if (!brand) {
      throw new Error(
        "Selected brand was not found."
      );
    }
  }

  const items =
    parseItems(formData);

  const existingImages =
    parseImages(formData);

  const deletedImageIds =
    parseDeletedImages(
      formData
    );

  /*
   * Find images that should
   * be deleted.
   */
  const imagesToDelete =
    existing.images.filter(
      (image) =>
        deletedImageIds.includes(
          image.id
        )
    );

  /*
   * Delete removed images
   * from Cloudinary.
   */
  for (
    const image of imagesToDelete
  ) {
    await deleteCloudinaryImage(
      image.publicId
    );
  }

  /*
   * Upload new images.
   */
  const files =
    formData.getAll(
      "images"
    ) as File[];

  const uploads =
    await uploadImages(
      files,
      "combine-store/packaging"
    );

  /*
   * Keep existing images.
   */
  const existingImageIds =
    new Set(
      existingImages.map(
        (image: {
          id: number;
        }) =>
          Number(image.id)
      )
    );

  const imagesToKeep =
    existing.images.filter(
      (image) =>
        existingImageIds.has(
          image.id
        ) &&
        !deletedImageIds.includes(
          image.id
        )
    );

  /*
   * Existing image order.
   */
  const imageUpdates =
    existingImages
      .filter(
        (image: {
          id: number;
        }) =>
          !deletedImageIds.includes(
            Number(image.id)
          )
      )
      .map(
        (image: {
          id: number;
          sortOrder: number;
        }) => ({
          id: Number(
            image.id
          ),

          sortOrder:
            Number(
              image.sortOrder
            ),
        })
      );

  /*
   * Keep TypeScript aware that
   * imagesToKeep is intentionally
   * calculated for validation /
   * consistency with existing images.
   */
  void imagesToKeep;

  /*
   * New images start after
   * existing images.
   */
  const maxExistingOrder =
    imageUpdates.reduce(
      (
        max: number,
        image: {
          sortOrder: number;
        }
      ) =>
        Math.max(
          max,
          image.sortOrder
        ),
      0
    );

  /*
   * Update everything inside
   * one database transaction.
   */
  await prisma.$transaction(
    async (tx) => {
      /*
       * Update packaging profile.
       */
      await tx.packagingProfile.update(
        {
          where: {
            id,
          },

          data: {
            key,

            name:
              data.name,

            brand:
              data.brand,

            title:
              data.title,

            description:
              data.description,

            active:
              data.active,
          },
        }
      );

      /*
       * Delete removed DB images.
       */
      if (
        deletedImageIds.length
      ) {
        await tx.packagingImage.deleteMany(
          {
            where: {
              id: {
                in:
                  deletedImageIds,
              },

              packagingId:
                id,
            },
          }
        );
      }

      /*
       * Update existing image
       * order.
       */
      for (
        const image of imageUpdates
      ) {
        await tx.packagingImage.update(
          {
            where: {
              id:
                image.id,
            },

            data: {
              sortOrder:
                image.sortOrder,
            },
          }
        );
      }

      /*
       * Create new images.
       */
      if (uploads.length) {
        await tx.packagingImage.createMany(
          {
            data:
              uploads.map(
                (
                  image,
                  index
                ) => ({
                  packagingId:
                    id,

                  url:
                    image.url,

                  publicId:
                    image.publicId,

                  sortOrder:
                    maxExistingOrder +
                    index +
                    1,
                })
              ),
          }
        );
      }

      /*
       * Replace packaging items.
       */
      await tx.packagingItem.deleteMany(
        {
          where: {
            packagingId:
              id,
          },
        }
      );

      if (items.length) {
        await tx.packagingItem.createMany(
          {
            data:
              items.map(
                (
                  item,
                  index
                ) => ({
                  packagingId:
                    id,

                  name:
                    item,

                  sortOrder:
                    index + 1,
                })
              ),
          }
        );
      }
    }
  );

  /*
   * Refresh admin pages.
   */
  revalidatePath(
    "/admin/dashboard/packaging"
  );

  revalidatePath(
    `/admin/dashboard/packaging/${id}`
  );

  redirect(
    "/admin/dashboard/packaging"
  );
}


/*
 * =========================================================
 * DELETE PACKAGING
 * =========================================================
 */

export async function deletePackaging(
  id: number
) {
  /*
   * Find packaging and all
   * associated images.
   */
  const packaging =
    await prisma.packagingProfile.findUnique(
      {
        where: {
          id,
        },

        include: {
          images: true,
        },
      }
    );

  if (!packaging) {
    throw new Error(
      "Packaging not found."
    );
  }

  /*
   * Delete all Cloudinary images
   * before deleting the database
   * record.
   */
  for (
    const image of packaging.images
  ) {
    await deleteCloudinaryImage(
      image.publicId
    );
  }

  /*
   * Delete packaging profile.
   *
   * PackagingImage:
   *   onDelete: Cascade
   *
   * PackagingItem:
   *   onDelete: Cascade
   *
   * Product.customPackaging:
   *   onDelete: SetNull
   */
  await prisma.packagingProfile.delete(
    {
      where: {
        id,
      },
    }
  );

  /*
   * Refresh packaging list.
   */
  revalidatePath(
    "/admin/dashboard/packaging"
  );

  /*
   * Return to packaging list.
   */
  redirect(
    "/admin/dashboard/packaging"
  );
}