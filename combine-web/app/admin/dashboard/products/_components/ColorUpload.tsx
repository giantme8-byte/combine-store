"use client";

import { ChangeEvent } from "react";

import { ImagePlus, Trash2, X } from "lucide-react";

import type {
  ColorImage,
  ColorImageItem,
} from "@/types/color-image";

type Props = {
  colors: ColorImageItem[];
  onChange: (colors: ColorImageItem[]) => void;
};

export default function ColorUpload({
  colors,
  onChange,
}: Props) {
  function addColor() {
    onChange([
      ...colors,
      {
        id: crypto.randomUUID(),
        name: "",
        model: "",
        url: "",
        publicId: null,
        images: [],
        isNew: true,
        sortOrder: colors.length,
        deleted: false,
      },
    ]);
  }

  function removeColor(id: string) {
    const color = colors.find(
      (item) => item.id === id
    );

    if (!color) return;

    // Revoke local blob URLs before removing
    color.images.forEach((image) => {
      if (image.url.startsWith("blob:")) {
        URL.revokeObjectURL(image.url);
      }
    });

    if (color.url.startsWith("blob:")) {
      URL.revokeObjectURL(color.url);
    }

    onChange(
      colors
        .map((item) => {
          if (item.id !== id) return item;

          if (item.isNew) {
            return null;
          }

          return {
            ...item,
            deleted: true,
          };
        })
        .filter(Boolean) as ColorImageItem[]
    );
  }

  function updateColorName(
    id: string,
    name: string
  ) {
    onChange(
      colors.map((color) =>
        color.id === id
          ? {
              ...color,
              name,
            }
          : color
      )
    );
  }

  function updateColorModel(
    id: string,
    model: string
  ) {
    onChange(
      colors.map((color) =>
        color.id === id
          ? {
              ...color,
              model,
            }
          : color
      )
    );
  }

  function addColorImages(
    id: string,
    e: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      e.target.files ?? []
    );

    if (files.length === 0) return;

    onChange(
      colors.map((color) => {
        if (color.id !== id) return color;

        const existingImages =
          color.images ?? [];

        const newImages: ColorImage[] =
          files.map((file, index) => ({
            id: crypto.randomUUID(),
            url: URL.createObjectURL(file),
            publicId: null,
            file,
            isNew: true,
            deleted: false,
            sortOrder:
              existingImages.length + index,
          }));

        return {
          ...color,
          images: [
            ...existingImages,
            ...newImages,
          ],
        };
      })
    );

    e.target.value = "";
  }

  function removeColorImage(
    colorId: string,
    imageId: string
  ) {
    onChange(
      colors.map((color) => {
        if (color.id !== colorId) {
          return color;
        }

        const image = color.images.find(
          (item) => item.id === imageId
        );

        if (!image) return color;

        if (image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }

        return {
          ...color,
          images: color.images
            .map((item) => {
              if (item.id !== imageId) {
                return item;
              }

              /*
               * Existing images are kept in the
               * array and marked deleted.
               *
               * New images can simply be removed.
               */
              if (item.isNew) {
                return null;
              }

              return {
                ...item,
                deleted: true,
              };
            })
            .filter(Boolean)
            .map((item, index) => ({
              ...(item as ColorImage),
              sortOrder: index,
            })),
        };
      })
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-neutral-700">
          Available Colors
        </label>

        <button
          type="button"
          onClick={addColor}
          className="
            rounded-xl
            border
            border-neutral-300
            px-4
            py-2
            text-sm
            font-medium
            transition
            hover:bg-neutral-100
          "
        >
          + Add Color
        </button>
      </div>

      {colors.length === 0 ? (
        <div
          className="
            rounded-2xl
            border-2
            border-dashed
            border-neutral-300
            bg-neutral-50
            p-10
            text-center
            text-sm
            text-neutral-500
          "
        >
          No color variants added.
        </div>
      ) : (
        <div className="space-y-6">
          {colors
            .filter((color) => !color.deleted)
            .map((color) => {
              const visibleImages =
                color.images.filter(
                  (image) => !image.deleted
                );

              return (
                <div
                  key={color.id}
                  className="
                    space-y-5
                    rounded-2xl
                    border
                    border-neutral-200
                    p-5
                  "
                >
                  {/* Color Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Color Name
                    </label>

                    <input
                      type="text"
                      value={color.name}
                      placeholder="Black"
                      onChange={(e) =>
                        updateColorName(
                          color.id,
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-neutral-300
                        px-4
                        py-3
                        focus:border-black
                        focus:outline-none
                      "
                    />
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Model
                    </label>

                    <input
                      type="text"
                      value={color.model}
                      placeholder="M45831"
                      onChange={(e) =>
                        updateColorModel(
                          color.id,
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-neutral-300
                        px-4
                        py-3
                        focus:border-black
                        focus:outline-none
                      "
                    />
                  </div>

                  {/* Color Gallery */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Color Gallery
                      </label>

                      <span className="text-xs text-neutral-500">
                        {visibleImages.length}{" "}
                        {visibleImages.length === 1
                          ? "image"
                          : "images"}
                      </span>
                    </div>

                    {/* Image Grid */}
                    {visibleImages.length > 0 && (
                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-4
                          sm:grid-cols-3
                          md:grid-cols-4
                        "
                      >
                        {visibleImages.map(
                          (image, index) => (
                            <div
                              key={image.id}
                              className="
                                group
                                relative
                                aspect-square
                                overflow-hidden
                                rounded-2xl
                                border
                                border-neutral-200
                                bg-neutral-50
                              "
                            >
                              <img
                                src={image.url}
                                alt={
                                  color.name ||
                                  "Color"
                                }
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                "
                              />

                              {/* Image Number */}
                              <div
                                className="
                                  absolute
                                  left-2
                                  top-2
                                  rounded-lg
                                  bg-black/70
                                  px-2
                                  py-1
                                  text-xs
                                  font-medium
                                  text-white
                                "
                              >
                                {String(
                                  index + 1
                                ).padStart(2, "0")}
                              </div>

                              {/* Remove Image */}
                              <button
                                type="button"
                                onClick={() =>
                                  removeColorImage(
                                    color.id,
                                    image.id
                                  )
                                }
                                className="
                                  absolute
                                  right-2
                                  top-2
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-white/90
                                  text-red-600
                                  opacity-0
                                  shadow-sm
                                  transition
                                  group-hover:opacity-100
                                  hover:bg-white
                                "
                                aria-label="Remove image"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Upload More Images */}
                    <input
                      id={`color-gallery-${color.id}`}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        addColorImages(
                          color.id,
                          e
                        )
                      }
                    />

                    <label
                      htmlFor={`color-gallery-${color.id}`}
                      className="
                        flex
                        min-h-32
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        rounded-2xl
                        border-2
                        border-dashed
                        border-neutral-300
                        bg-neutral-50
                        px-6
                        py-6
                        text-center
                        transition
                        hover:border-black
                        hover:bg-neutral-100
                      "
                    >
                      <ImagePlus
                        size={32}
                        className="text-neutral-400"
                      />

                      <p className="mt-3 text-sm font-medium">
                        {visibleImages.length > 0
                          ? "Add More Images"
                          : "Upload Color Images"}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Select multiple images at once
                      </p>
                    </label>
                  </div>

                  {/* Remove Color */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        removeColor(color.id)
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-red-300
                        px-4
                        py-2
                        text-red-600
                        transition
                        hover:bg-red-50
                      "
                    >
                      <Trash2 size={18} />

                      Remove Color
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}