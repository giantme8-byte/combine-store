"use client";

import Image from "next/image";
import { useState } from "react";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  Eye,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

import { ProductVariantItem } from "@/types";
import type { ColorImageItem } from "@/types/color-image";
import type { ProductVariantImageItem } from "@/types/product-variant";

import ImagePreviewModal from "./ImagePreviewModal";

type VariantManagerProps = {
  variants: ProductVariantItem[];
  colors: ColorImageItem[];
  onChange: (variants: ProductVariantItem[]) => void;
};

/* =========================================================
 * Sortable Variant Image
 * ======================================================= */

function SortableVariantImage({
  image,
  index,
  colorName,
  onPreview,
  onDelete,
}: {
  image: ProductVariantImageItem;
  index: number;
  colorName: string;
  onPreview: (
    src: string,
    alt: string
  ) => void;
  onDelete: (
    id: string
  ) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
  });

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group
        relative
        overflow-hidden
        rounded-xl
        border
        bg-white
        shadow-sm
        transition-all
        duration-200
        ${
          isDragging
            ? `
              z-50
              scale-[1.02]
              border-black
              shadow-2xl
              ring-2
              ring-black/10
            `
            : `
              border-neutral-200
              hover:-translate-y-0.5
              hover:shadow-md
            `
        }
      `}
    >
      {/* =====================================================
       * IMAGE
       * =================================================== */}

      <div
        {...attributes}
        {...listeners}
        className={`
          relative
          aspect-square
          cursor-grab
          select-none
          overflow-hidden
          bg-neutral-50
          active:cursor-grabbing
          ${
            isDragging
              ? "cursor-grabbing"
              : ""
          }
        `}
      >
        <Image
          src={image.url}
          alt={`${colorName} Variant image ${
            index + 1
          }`}
          fill
          unoptimized
          draggable={false}
          className="
            pointer-events-none
            select-none
            object-contain
            transition-transform
            duration-300
            ease-out
            group-hover:scale-[1.02]
          "
        />

        {/* =================================================
         * IMAGE NUMBER
         * ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            left-2.5
            top-2.5
            z-10
            rounded-md
            bg-black/80
            px-2
            py-1
            text-[10px]
            font-semibold
            tracking-wide
            text-white
            shadow-sm
            backdrop-blur-sm
          "
        >
          {String(
            index + 1
          ).padStart(2, "0")}
        </div>

        {/* =================================================
         * ACTIONS
         * ================================================= */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            z-20
            flex
            items-center
            justify-between
            p-2
            opacity-0
            transition-opacity
            duration-200
            group-hover:opacity-100
          "
        >
          {/* Preview */}

          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();

              if (!image.url) {
                return;
              }

              onPreview(
                image.url,
                `${colorName} Variant image ${
                  index + 1
                }`
              );
            }}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/95
              text-neutral-800
              shadow-md
              backdrop-blur-sm
              transition
              hover:bg-white
              hover:text-black
            "
            title="Preview / Zoom"
            aria-label="Preview variant image"
          >
            <Eye size={16} />
          </button>

          {/* Delete */}

          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(image.id);
            }}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/95
              text-neutral-700
              shadow-md
              backdrop-blur-sm
              transition
              hover:bg-white
              hover:text-red-600
            "
            title="Remove image"
            aria-label="Remove variant image"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* =================================================
         * NEW IMAGE
         * ================================================= */}

        {image.isNew && (
          <div
            className="
              pointer-events-none
              absolute
              bottom-2
              left-2
              rounded-md
              bg-black/80
              px-2
              py-1
              text-[10px]
              font-medium
              text-white
              backdrop-blur-sm
            "
          >
            NEW
          </div>
        )}

        {/* =================================================
         * IMAGE TYPE
         * ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-2
            right-2
            flex
            items-center
            gap-1
            rounded-md
            bg-black/70
            px-2
            py-1
            text-[10px]
            font-medium
            text-white
            backdrop-blur-sm
          "
        >
          <ImageIcon size={11} />

          Image
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 * Variant Image Gallery
 * ======================================================= */

function VariantImageGallery({
  images,
  colorName,
  onChange,
}: {
  images: ProductVariantImageItem[];
  colorName: string;
  onChange: (
    images: ProductVariantImageItem[]
  ) => void;
}) {
  const [preview, setPreview] =
    useState<{
      src: string;
      alt: string;
    } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const activeImages =
    images.filter(
      (image) =>
        !image.deleted
    );

  function handleFiles(
    files: FileList | null
  ) {
    if (!files) {
      return;
    }

    const selectedFiles =
      Array.from(files);

    if (
      selectedFiles.length ===
      0
    ) {
      return;
    }

    const currentMaxOrder =
      activeImages.reduce(
        (
          max,
          image
        ) =>
          Math.max(
            max,
            image.sortOrder ?? 0
          ),
        0
      );

    const newImages =
      selectedFiles.map(
        (
          file,
          index
        ) => ({
          id: crypto.randomUUID(),
          url:
            URL.createObjectURL(
              file
            ),
          publicId: "",
          sortOrder:
            currentMaxOrder +
            index +
            1,
          file,
          isNew: true,
          deleted: false,
        })
      );

    onChange([
      ...images,
      ...newImages,
    ]);
  }

  function handleDelete(
    imageId: string
  ) {
    const image =
      images.find(
        (item) =>
          item.id === imageId
      );

    if (!image) {
      return;
    }

    if (
      image.url.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        image.url
      );
    }

    if (image.isNew) {
      onChange(
        images.filter(
          (item) =>
            item.id !==
            imageId
        )
      );

      return;
    }

    onChange(
      images.map(
        (item) =>
          item.id === imageId
            ? {
                ...item,
                deleted:
                  true,
              }
            : item
      )
    );
  }

  function handleDragEnd(
    event: DragEndEvent
  ) {
    const {
      active,
      over,
    } = event;

    if (
      !over ||
      active.id ===
        over.id
    ) {
      return;
    }

    const oldIndex =
      activeImages.findIndex(
        (image) =>
          image.id ===
          active.id
      );

    const newIndex =
      activeImages.findIndex(
        (image) =>
          image.id ===
          over.id
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    const reordered = [
      ...activeImages,
    ];

    const [
      movedImage,
    ] = reordered.splice(
      oldIndex,
      1
    );

    reordered.splice(
      newIndex,
      0,
      movedImage
    );

    const updatedImages =
      reordered.map(
        (
          image,
          index
        ) => ({
          ...image,
          sortOrder:
            index + 1,
        })
      );

    const deletedImages =
      images.filter(
        (image) =>
          image.deleted
      );

    onChange([
      ...updatedImages,
      ...deletedImages,
    ]);
  }

  return (
    <>
      <div className="space-y-4">
        {/* =================================================
         * HEADER
         * ================================================= */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-700">
              Variant Images
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Upload multiple images and
              drag to reorder them.
            </p>
          </div>

          <div className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
            {activeImages.length}{" "}
            {activeImages.length ===
            1
              ? "image"
              : "images"}
          </div>
        </div>

        {/* =================================================
         * IMAGE GRID
         * ================================================= */}

        <DndContext
          sensors={sensors}
          collisionDetection={
            closestCenter
          }
          onDragEnd={
            handleDragEnd
          }
        >
          <SortableContext
            items={activeImages.map(
              (image) =>
                image.id
            )}
            strategy={
              rectSortingStrategy
            }
          >
            <div
              className="
                grid
                grid-cols-2
                gap-4
                sm:grid-cols-3
                lg:grid-cols-4
              "
            >
              {activeImages.map(
                (
                  image,
                  index
                ) => (
                  <SortableVariantImage
                    key={
                      image.id
                    }
                    image={
                      image
                    }
                    index={
                      index
                    }
                    colorName={
                      colorName
                    }
                    onPreview={(
                      src,
                      alt
                    ) =>
                      setPreview(
                        {
                          src,
                          alt,
                        }
                      )
                    }
                    onDelete={
                      handleDelete
                    }
                  />
                )
              )}

              {/* =================================================
               * UPLOAD
               * ================================================= */}

              <label
                className="
                  flex
                  aspect-square
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-dashed
                  border-neutral-300
                  bg-neutral-50
                  transition-all
                  duration-200
                  hover:border-black
                  hover:bg-white
                  hover:shadow-sm
                "
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(
                    event
                  ) => {
                    handleFiles(
                      event.target
                        .files
                    );

                    event.target.value =
                      "";
                  }}
                />

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-neutral-200
                    bg-white
                    text-neutral-500
                    shadow-sm
                    transition
                    group-hover:text-black
                  "
                >
                  <ImageIcon
                    size={20}
                  />
                </div>

                <span className="mt-3 text-sm font-semibold text-neutral-800">
                  Add Images
                </span>

                <span className="mt-1 px-3 text-center text-xs text-neutral-500">
                  Select multiple photos
                </span>
              </label>
            </div>
          </SortableContext>
        </DndContext>

        {/* =================================================
         * EMPTY STATE
         * ================================================= */}

        {activeImages.length ===
          0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-5 text-center">
            <p className="text-sm font-medium text-neutral-700">
              No Variant images yet.
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Add one or more images for
              this specific Color + Size
              combination.
            </p>
          </div>
        )}
      </div>

      {preview && (
        <ImagePreviewModal
          open
          src={preview.src}
          alt={preview.alt}
          onClose={() =>
            setPreview(null)
          }
        />
      )}
    </>
  );
}

/* =========================================================
 * Variant Manager
 * ======================================================= */

export default function VariantManager({
  variants,
  colors,
  onChange,
}: VariantManagerProps) {
  const availableColors =
    colors.filter(
      (color) =>
        !color.deleted
    );

  const activeVariants =
    variants.filter(
      (variant) =>
        !variant.deleted
    );

  function addVariant() {
    onChange([
      ...variants,
      {
        id: crypto.randomUUID(),

        colorId: null,

        size: "",
        model: "",
        dimensions: "",

        imageUrl: "",
        publicId: "",

        images: [],

        file: undefined,

        isNew: true,
        deleted: false,
      },
    ]);
  }

  function updateVariant(
    index: number,
    field: keyof ProductVariantItem,
    value: ProductVariantItem[keyof ProductVariantItem]
  ) {
    const next = [
      ...variants,
    ];

    next[index] = {
      ...next[index],
      [field]: value,
    };

    onChange(next);
  }

  function updateVariantImages(
    index: number,
    images: ProductVariantImageItem[]
  ) {
    const next = [
      ...variants,
    ];

    const firstActiveImage =
      images.find(
        (image) =>
          !image.deleted
      );

    next[index] = {
      ...next[index],

      images,

      // Keep the legacy primary image
      // synchronized with the first
      // Variant gallery image.
      imageUrl:
        firstActiveImage?.url ??
        next[index].imageUrl ??
        "",

      publicId:
        firstActiveImage?.publicId ??
        next[index].publicId ??
        "",
    };

    onChange(next);
  }

  function removeVariant(
    index: number
  ) {
    const next = [
      ...variants,
    ];

    const variant =
      next[index];

    if (!variant) {
      return;
    }

    // Revoke local preview URLs
    // for newly uploaded images.
    variant.images
      .filter(
        (image) =>
          image.isNew &&
          image.url.startsWith(
            "blob:"
          )
      )
      .forEach(
        (image) => {
          URL.revokeObjectURL(
            image.url
          );
        }
      );

    // Legacy image fallback
    if (
      variant.imageUrl?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        variant.imageUrl
      );
    }

    if (variant.isNew) {
      next.splice(index, 1);
    } else {
      next[index] = {
        ...variant,
        deleted: true,
      };
    }

    onChange([
      ...next,
    ]);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* =====================================================
       * HEADER
       * =================================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Variants
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Manage color, size, specifications
            and Variant image galleries.
          </p>
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="
            rounded-xl
            bg-black
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-neutral-800
          "
        >
          + Add Variant
        </button>
      </div>

      {/* =====================================================
       * NO COLORS WARNING
       * =================================================== */}

      {availableColors.length ===
        0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-medium text-amber-800">
            Add at least one Product Color
            first.
          </p>

          <p className="mt-1 text-xs text-amber-700">
            Variant colors can only be selected
            from the Product Colors added above.
          </p>
        </div>
      )}

      {/* =====================================================
       * EMPTY STATE
       * =================================================== */}

      {activeVariants.length ===
        0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-neutral-700">
            No variants added yet.
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Add a variant if this product has
            different colors, sizes or
            specifications.
          </p>
        </div>
      )}

      {/* =====================================================
       * VARIANTS
       * =================================================== */}

      <div className="space-y-6">
        {variants.map(
          (
            variant,
            index
          ) => {
            if (
              variant.deleted
            ) {
              return null;
            }

            const actualIndex =
              index;

            const selectedColor =
              availableColors.find(
                (color) =>
                  color.colorId ===
                  variant.colorId
              );

            const colorName =
              selectedColor?.name ??
              "Variant";

            return (
              <div
                key={
                  variant.id
                }
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:shadow-md
                "
              >
                {/* =================================================
                 * VARIANT HEADER
                 * ================================================= */}

                <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Variant #
                      {activeVariants.findIndex(
                        (item) =>
                          item.id ===
                          variant.id
                      ) + 1}
                    </h3>

                    <p className="text-xs text-neutral-500">
                      Configure color, size,
                      model, dimensions and
                      image gallery.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeVariant(
                        actualIndex
                      )
                    }
                    className="
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-red-600
                      transition
                      hover:bg-red-50
                    "
                  >
                    Delete
                  </button>
                </div>

                <div className="space-y-6 p-5">
                  {/* =================================================
                   * COLOR
                   * ================================================= */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      Color
                    </label>

                    <select
                      value={
                        variant.colorId ??
                        ""
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value;

                        updateVariant(
                          actualIndex,
                          "colorId",
                          value ===
                            ""
                            ? null
                            : Number(
                                value
                              )
                        );
                      }}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-neutral-300
                        bg-white
                        px-4
                        py-3
                        transition-all
                        duration-200
                        focus:border-black
                        focus:outline-none
                        focus:ring-2
                        focus:ring-black/5
                      "
                    >
                      <option value="">
                        Select Product Color
                      </option>

                      {availableColors.map(
                        (
                          color
                        ) => (
                          <option
                            key={
                              color.id
                            }
                            value={
                              color.colorId ??
                              ""
                            }
                            disabled={
                              color.colorId ===
                              null
                            }
                          >
                            {color.name ||
                              "Unnamed Color"}
                          </option>
                        )
                      )}
                    </select>

                    {availableColors.length ===
                      0 && (
                      <p className="mt-2 text-xs text-amber-600">
                        Please add a Product
                        Color before creating
                        a Variant.
                      </p>
                    )}

                    {availableColors.length >
                      0 &&
                      !variant.colorId && (
                        <p className="mt-2 text-xs text-amber-600">
                          Please select a Product
                          Color.
                        </p>
                      )}

                    {selectedColor && (
                      <p className="mt-2 text-xs text-neutral-500">
                        This Variant is linked
                        to{" "}
                        <span className="font-medium text-neutral-800">
                          {
                            selectedColor.name
                          }
                        </span>
                        .
                      </p>
                    )}
                  </div>

                  {/* =================================================
                   * VARIANT IMAGE GALLERY
                   * ================================================= */}

                  <VariantImageGallery
                    images={
                      variant.images ??
                      []
                    }
                    colorName={
                      colorName
                    }
                    onChange={(
                      images
                    ) =>
                      updateVariantImages(
                        actualIndex,
                        images
                      )
                    }
                  />

                  {/* =================================================
                   * FIELDS
                   * ================================================= */}

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Size */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Size
                      </label>

                      <input
                        value={
                          variant.size
                        }
                        onChange={(
                          e
                        ) =>
                          updateVariant(
                            actualIndex,
                            "size",
                            e.target
                              .value
                          )
                        }
                        placeholder="25cm (Small)"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-neutral-300
                          bg-white
                          px-4
                          py-3
                          transition-all
                          duration-200
                          focus:border-black
                          focus:outline-none
                          focus:ring-2
                          focus:ring-black/5
                        "
                      />
                    </div>

                    {/* Model */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Model
                      </label>

                      <input
                        value={
                          variant.model
                        }
                        onChange={(
                          e
                        ) =>
                          updateVariant(
                            actualIndex,
                            "model",
                            e.target
                              .value
                          )
                        }
                        placeholder="M46703"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-neutral-300
                          bg-white
                          px-4
                          py-3
                          transition-all
                          duration-200
                          focus:border-black
                          focus:outline-none
                          focus:ring-2
                          focus:ring-black/5
                        "
                      />
                    </div>

                    {/* Dimensions */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Dimensions
                      </label>

                      <input
                        value={
                          variant.dimensions
                        }
                        onChange={(
                          e
                        ) =>
                          updateVariant(
                            actualIndex,
                            "dimensions",
                            e.target
                              .value
                          )
                        }
                        placeholder="30 × 22 × 10 cm"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-neutral-300
                          bg-white
                          px-4
                          py-3
                          transition-all
                          duration-200
                          focus:border-black
                          focus:outline-none
                          focus:ring-2
                          focus:ring-black/5
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}