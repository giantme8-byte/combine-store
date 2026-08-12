"use client";

import { ChangeEvent, useState } from "react";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import {
  ProductImageItem,
} from "@/types/product-image";

import UploadDropzone from "./UploadDropzone";
import GalleryGrid from "./GalleryGrid";

type ImageUploadProps = {
  images: ProductImageItem[];

  onChange: (
    images: ProductImageItem[]
  ) => void;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;

  error?: {
    message?: string;
  };
};

export default function ImageUpload({
  images,
  onChange,
}: ImageUploadProps) {
  const [uploading, setUploading] =
    useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const visibleImages = images.filter(
    (image) => !image.deleted
  );

  async function uploadToCloudinary(
    image: ProductImageItem
  ) {
    if (!image.file) {
      return;
    }

    try {
      /*
       * Mark image as uploading.
       */
      onChange(
        images.map((item) =>
          item.id === image.id
            ? {
                ...item,
                status: "uploading",
                progress: 0,
                error: undefined,
              }
            : item
        )
      );

      /*
       * Request a signed Cloudinary upload.
       *
       * IMPORTANT:
       * The API secret never reaches the browser.
       */
      const signatureResponse =
        await fetch(
          "/api/cloudinary/sign",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      if (!signatureResponse.ok) {
        throw new Error(
          "Failed to create Cloudinary upload signature."
        );
      }

      const signatureData =
        await signatureResponse.json();

      /*
       * Build Cloudinary upload request.
       */
      const formData = new FormData();

      formData.append(
        "file",
        image.file
      );

      formData.append(
        "api_key",
        signatureData.apiKey
      );

      formData.append(
        "timestamp",
        String(
          signatureData.timestamp
        )
      );

      formData.append(
        "signature",
        signatureData.signature
      );

      formData.append(
        "folder",
        signatureData.folder
      );

      const uploadUrl =
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;

      /*
       * XMLHttpRequest is used instead of fetch
       * because it provides upload progress.
       */
      const result =
        await new Promise<{
          url: string;
          publicId: string;
        }>(
          (resolve, reject) => {
            const xhr =
              new XMLHttpRequest();

            xhr.open(
              "POST",
              uploadUrl
            );

            xhr.upload.onprogress = (
              event
            ) => {
              if (!event.lengthComputable) {
                return;
              }

              const progress =
                Math.round(
                  (event.loaded /
                    event.total) *
                    100
                );

              onChange(
                images.map((item) =>
                  item.id === image.id
                    ? {
                        ...item,
                        status:
                          "uploading",
                        progress,
                      }
                    : item
                )
              );
            };

            xhr.onload = () => {
              if (
                xhr.status < 200 ||
                xhr.status >= 300
              ) {
                reject(
                  new Error(
                    `Cloudinary upload failed with status ${xhr.status}.`
                  )
                );

                return;
              }

              let data:
                | CloudinaryUploadResponse
                | null = null;

              try {
                data =
                  JSON.parse(
                    xhr.responseText
                  );
              } catch {
                reject(
                  new Error(
                    "Invalid response from Cloudinary."
                  )
                );

                return;
              }

              if (
                !data?.secure_url ||
                !data?.public_id
              ) {
                reject(
                  new Error(
                    data?.error
                      ?.message ||
                      "Cloudinary did not return image information."
                  )
                );

                return;
              }

              resolve({
                url: data.secure_url,
                publicId:
                  data.public_id,
              });
            };

            xhr.onerror = () => {
              reject(
                new Error(
                  "Network error while uploading image."
                )
              );
            };

            xhr.onabort = () => {
              reject(
                new Error(
                  "Image upload was cancelled."
                )
              );
            };

            xhr.send(formData);
          }
        );

      /*
       * Upload succeeded.
       *
       * IMPORTANT:
       * The local File is removed from the item.
       * From this point onward, the product only needs
       * Cloudinary URL + publicId.
       */
      onChange(
        images.map((item) =>
          item.id === image.id
            ? {
                ...item,
                url: result.url,
                publicId:
                  result.publicId,
                file: undefined,
                isNew: true,
                status: "uploaded",
                progress: 100,
                error: undefined,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      onChange(
        images.map((item) =>
          item.id === image.id
            ? {
                ...item,
                status: "failed",
                progress: 0,
                error:
                  error instanceof Error
                    ? error.message
                    : "Upload failed.",
              }
            : item
        )
      );
    }
  }

  async function handleUpload(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      e.target.files ?? []
    );

    if (!files.length) {
      return;
    }

    /*
     * Keep the existing validation.
     */
    const newImages: ProductImageItem[] =
      files.map((file, index) => ({
        id: crypto.randomUUID(),

        url: URL.createObjectURL(file),

        publicId: null,

        file,

        isNew: true,

        sortOrder:
          images.length + index,

        deleted: false,

        status: "idle",

        progress: 0,
      }));

    const updatedImages = [
      ...images,
      ...newImages,
    ];

    onChange(updatedImages);

    e.target.value = "";

    /*
     * Upload sequentially.
     *
     * This avoids sending multiple large files
     * through the Next.js server at once.
     */
    setUploading(true);

    try {
      for (const image of newImages) {
        await uploadToCloudinary(
          image
        );
      }
    } finally {
      setUploading(false);
    }
  }

  function handleDragEnd(
    event: DragEndEvent
  ) {
    const {
      active,
      over,
    } = event;

    if (!over) {
      return;
    }

    if (active.id === over.id) {
      return;
    }

    const oldIndex =
      visibleImages.findIndex(
        (image) =>
          image.id === active.id
      );

    const newIndex =
      visibleImages.findIndex(
        (image) =>
          image.id === over.id
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    const reordered =
      arrayMove(
        visibleImages,
        oldIndex,
        newIndex
      ).map((image, index) => ({
        ...image,
        sortOrder: index,
      }));

    const deletedImages =
      images.filter(
        (image) => image.deleted
      );

    onChange([
      ...reordered,
      ...deletedImages,
    ]);
  }

  function removeImage(
    id: string
  ) {
    const updated =
      images.flatMap((image) => {
        if (image.id !== id) {
          return [image];
        }

        /*
         * Local-only image.
         */
        if (
          image.isNew &&
          image.status !== "uploaded"
        ) {
          if (
            image.url.startsWith(
              "blob:"
            )
          ) {
            URL.revokeObjectURL(
              image.url
            );
          }

          return [];
        }

        /*
         * Uploaded image or existing image.
         *
         * Keep it in state as deleted so the
         * server can process deletion on Save.
         */
        return [
          {
            ...image,
            deleted: true,
          },
        ];
      });

    const visible =
      updated
        .filter(
          (image) =>
            !image.deleted
        )
        .map(
          (image, index) => ({
            ...image,
            sortOrder: index,
          })
        );

    const deleted =
      updated.filter(
        (image) =>
          image.deleted
      );

    onChange([
      ...visible,
      ...deleted,
    ]);
  }

  return (
    <div className="space-y-8">
      <UploadDropzone
        hasImages={
          visibleImages.length > 0
        }
        onUpload={
          handleUpload
        }
      />

      {uploading && (
        <p className="text-sm text-neutral-500">
          Uploading images...
        </p>
      )}

      {visibleImages.length >
        0 && (
        <GalleryGrid
          images={
            visibleImages
          }
          sensors={sensors}
          onDragEnd={
            handleDragEnd
          }
          onDelete={
            removeImage
          }
        />
      )}
    </div>
  );
}