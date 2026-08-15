"use client";

import {
  ChangeEvent,
} from "react";

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
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  ImagePlus,
  Trash2,
  X,
} from "lucide-react";

import type {
  ColorImage,
  ColorImageItem,
} from "@/types/color-image";

type GlobalColor = {
  id: number;
  name: string;
  slug: string;
  hexCode: string | null;
  active: boolean;
};

type Props = {
  colors: ColorImageItem[];
  globalColors: GlobalColor[];
  onChange: (
    colors: ColorImageItem[]
  ) => void;
};

/* =========================================================
 * Sortable Color Image
 * ======================================================= */

function SortableColorImage({
  image,
  index,
  colorName,
  onRemove,
}: {
  image: ColorImage;
  index: number;
  colorName: string;
  onRemove: () => void;
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
    transition:
      transition ??
      "transform 180ms cubic-bezier(0.2, 0, 0, 1)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        bg-white
        transition-shadow
        duration-200
        ${
          isDragging
            ? `
              z-50
              border-black
              shadow-2xl
              ring-2
              ring-black/10
            `
            : `
              border-neutral-200
              shadow-sm
              hover:shadow-md
            `
        }
      `}
    >
      {/* =====================================================
       * IMAGE AREA
       *
       * Entire image area is draggable.
       * =================================================== */}

      <div
        {...attributes}
        {...listeners}
        className={`
          relative
          aspect-square
          overflow-hidden
          bg-neutral-50
          select-none
          ${
            isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
          }
        `}
      >
        <img
          src={image.url}
          alt={`${colorName || "Color"} image ${index + 1}`}
          draggable={false}
          className={`
            pointer-events-none
            h-full
            w-full
            select-none
            object-contain
            ${
              isDragging
                ? ""
                : "transition-transform duration-200 ease-out group-hover:scale-[1.01]"
            }
          `}
        />

        {/* =================================================
         * IMAGE NUMBER
         * ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            left-3
            top-3
            rounded-lg
            bg-black/80
            px-2.5
            py-1.5
            text-xs
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
         * DELETE X
         *
         * Prevents drag from starting.
         * ================================================= */}

        <button
          type="button"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-neutral-700
            opacity-0
            shadow-md
            backdrop-blur-sm
            transition-all
            duration-150
            hover:bg-white
            hover:text-red-600
            group-hover:opacity-100
          "
          aria-label="Remove image"
          title="Remove image"
        >
          <X
            size={18}
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
 * Color Upload
 * ======================================================= */

export default function ColorUpload({
  colors,
  globalColors,
  onChange,
}: Props) {
  const sensors =
    useSensors(
      useSensor(
        PointerSensor,
        {
          activationConstraint: {
            distance: 4,
          },
        }
      )
    );

  /* =======================================================
   * Add Color
   * ===================================================== */

  function addColor() {
    onChange([
      ...colors,
      {
        id: crypto.randomUUID(),
        colorId: null,
        name: "",
        model: "",
        url: "",
        publicId: null,
        images: [],
        isNew: true,
        sortOrder:
          colors.length,
        deleted: false,
      },
    ]);
  }

  /* =======================================================
   * Remove Color
   * ===================================================== */

  function removeColor(
    id: string
  ) {
    const color =
      colors.find(
        (item) =>
          item.id === id
      );

    if (!color) {
      return;
    }

    color.images.forEach(
      (image) => {
        if (
          image.url.startsWith(
            "blob:"
          )
        ) {
          URL.revokeObjectURL(
            image.url
          );
        }
      }
    );

    if (
      color.url.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        color.url
      );
    }

    onChange(
      colors
        .map((item) => {
          if (
            item.id !== id
          ) {
            return item;
          }

          if (item.isNew) {
            return null;
          }

          return {
            ...item,
            deleted: true,
          };
        })
        .filter(
          Boolean
        ) as ColorImageItem[]
    );
  }

  /* =======================================================
   * Update Global Color
   * ===================================================== */

  function updateColor(
    id: string,
    colorId: number | null
  ) {
    const selectedColor =
      globalColors.find(
        (color) =>
          color.id ===
          colorId
      );

    onChange(
      colors.map(
        (color) =>
          color.id === id
            ? {
                ...color,
                colorId,
                name:
                  selectedColor?.name ??
                  "",
              }
            : color
      )
    );
  }

  /* =======================================================
   * Update Color Model
   * ===================================================== */

  function updateColorModel(
    id: string,
    model: string
  ) {
    onChange(
      colors.map(
        (color) =>
          color.id === id
            ? {
                ...color,
                model,
              }
            : color
      )
    );
  }

  /* =======================================================
   * Add Color Gallery Images
   * ===================================================== */

  function addColorImages(
    id: string,
    e: ChangeEvent<HTMLInputElement>
  ) {
    const files =
      Array.from(
        e.target.files ??
          []
      );

    if (
      files.length === 0
    ) {
      return;
    }

    onChange(
      colors.map(
        (color) => {
          if (
            color.id !== id
          ) {
            return color;
          }

          const existingImages =
            color.images ??
            [];

          const newImages: ColorImage[] =
            files.map(
              (
                file,
                index
              ) => ({
                id: crypto.randomUUID(),
                url: URL.createObjectURL(
                  file
                ),
                publicId:
                  null,
                file,
                isNew:
                  true,
                deleted:
                  false,
                sortOrder:
                  existingImages.length +
                  index,
              })
            );

          return {
            ...color,
            images: [
              ...existingImages,
              ...newImages,
            ],
          };
        }
      )
    );

    e.target.value = "";
  }

  /* =======================================================
   * Remove Color Gallery Image
   * ===================================================== */

  function removeColorImage(
    colorId: string,
    imageId: string
  ) {
    onChange(
      colors.map(
        (color) => {
          if (
            color.id !==
            colorId
          ) {
            return color;
          }

          const image =
            color.images.find(
              (item) =>
                item.id ===
                imageId
            );

          if (!image) {
            return color;
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

          return {
            ...color,
            images:
              color.images
                .map(
                  (item) => {
                    if (
                      item.id !==
                      imageId
                    ) {
                      return item;
                    }

                    if (
                      item.isNew
                    ) {
                      return null;
                    }

                    return {
                      ...item,
                      deleted:
                        true,
                    };
                  }
                )
                .filter(
                  Boolean
                )
                .map(
                  (
                    item,
                    index
                  ) => ({
                    ...(item as ColorImage),
                    sortOrder:
                      index,
                  })
                ),
          };
        }
      )
    );
  }

  /* =======================================================
   * Drag / Reorder Color Gallery
   * ===================================================== */

  function handleColorImageDragEnd(
    colorId: string,
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

    onChange(
      colors.map(
        (color) => {
          if (
            color.id !==
            colorId
          ) {
            return color;
          }

          const visibleImages =
            color.images.filter(
              (image) =>
                !image.deleted
            );

          const oldIndex =
            visibleImages.findIndex(
              (image) =>
                image.id ===
                active.id
            );

          const newIndex =
            visibleImages.findIndex(
              (image) =>
                image.id ===
                over.id
            );

          if (
            oldIndex === -1 ||
            newIndex === -1
          ) {
            return color;
          }

          const reordered =
            arrayMove(
              visibleImages,
              oldIndex,
              newIndex
            ).map(
              (
                image,
                index
              ) => ({
                ...image,
                sortOrder:
                  index,
              })
            );

          const deletedImages =
            color.images.filter(
              (image) =>
                image.deleted
            );

          return {
            ...color,
            images: [
              ...reordered,
              ...deletedImages,
            ],
          };
        }
      )
    );
  }

  /* =======================================================
   * Check Duplicate Global Color
   * ===================================================== */

  function isColorAlreadyUsed(
    colorId: number,
    currentColorId: string
  ) {
    return colors.some(
      (color) =>
        color.id !==
          currentColorId &&
        !color.deleted &&
        color.colorId ===
          colorId
    );
  }

  /* =======================================================
   * Render
   * ===================================================== */

  return (
    <div className="space-y-6">
      {/* ===================================================
       * Header
       * ================================================= */}

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-neutral-700">
          Available Colors
        </label>

        <button
          type="button"
          onClick={
            addColor
          }
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

      {/* ===================================================
       * Empty State
       * ================================================= */}

      {colors.length ===
      0 ? (
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
          No color variants
          added.
        </div>
      ) : (
        <div className="space-y-6">
          {colors
            .filter(
              (color) =>
                !color.deleted
            )
            .map(
              (color) => {
                const visibleImages =
                  color.images.filter(
                    (image) =>
                      !image.deleted
                  );

                return (
                  <div
                    key={
                      color.id
                    }
                    className="
                      space-y-5
                      rounded-2xl
                      border
                      border-neutral-200
                      p-5
                    "
                  >
                    {/* =======================================
                     * Color
                     * ===================================== */}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Color
                      </label>

                      <select
                        value={
                          color.colorId ??
                          ""
                        }
                        onChange={(
                          e
                        ) => {
                          const value =
                            e.target
                              .value;

                          updateColor(
                            color.id,
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
                          focus:border-black
                          focus:outline-none
                          focus:ring-2
                          focus:ring-black/5
                        "
                      >
                        <option value="">
                          Select a
                          color
                        </option>

                        {globalColors.map(
                          (
                            globalColor
                          ) => {
                            const used =
                              isColorAlreadyUsed(
                                globalColor.id,
                                color.id
                              );

                            return (
                              <option
                                key={
                                  globalColor.id
                                }
                                value={
                                  globalColor.id
                                }
                                disabled={
                                  used
                                }
                              >
                                {
                                  globalColor.name
                                }
                                {used
                                  ? " — Already added"
                                  : ""}
                              </option>
                            );
                          }
                        )}
                      </select>

                      {color.colorId ===
                        null && (
                        <p className="text-xs text-amber-600">
                          Please
                          select a
                          Global
                          Color.
                        </p>
                      )}

                      {color.colorId !==
                        null && (
                        <p className="text-xs text-neutral-500">
                          This
                          Product
                          Color is
                          linked to
                          the
                          Global
                          Color
                          Master.
                        </p>
                      )}
                    </div>

                    {/* =======================================
                     * Model
                     * ===================================== */}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Model
                      </label>

                      <input
                        type="text"
                        value={
                          color.model
                        }
                        placeholder="M45831"
                        onChange={(
                          e
                        ) =>
                          updateColorModel(
                            color.id,
                            e.target
                              .value
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
                          focus:ring-2
                          focus:ring-black/5
                        "
                      />
                    </div>

                    {/* =======================================
                     * Color Gallery
                     * ===================================== */}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">
                            Color
                            Gallery
                          </label>

                          <p className="mt-1 text-xs text-neutral-500">
                            Drag the
                            image
                            itself to
                            reorder.
                          </p>
                        </div>

                        <span className="text-xs text-neutral-500">
                          {
                            visibleImages.length
                          }{" "}
                          {visibleImages.length ===
                          1
                            ? "image"
                            : "images"}
                        </span>
                      </div>

                      {/* =====================================
                       * 2 COLUMN GALLERY
                       * =================================== */}

                      {visibleImages.length >
                        0 && (
                        <DndContext
                          sensors={
                            sensors
                          }
                          collisionDetection={
                            closestCenter
                          }
                          onDragEnd={(
                            event
                          ) =>
                            handleColorImageDragEnd(
                              color.id,
                              event
                            )
                          }
                        >
                          <SortableContext
                            items={visibleImages.map(
                              (
                                image
                              ) =>
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
                                gap-6
                              "
                            >
                              {visibleImages.map(
                                (
                                  image,
                                  index
                                ) => (
                                  <SortableColorImage
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
                                      color.name
                                    }
                                    onRemove={() =>
                                      removeColorImage(
                                        color.id,
                                        image.id
                                      )
                                    }
                                  />
                                )
                              )}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}

                      {/* =====================================
                       * Upload More Images
                       * =================================== */}

                      <input
                        id={`color-gallery-${color.id}`}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(
                          e
                        ) =>
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
                          size={
                            32
                          }
                          className="text-neutral-400"
                        />

                        <p className="mt-3 text-sm font-medium">
                          {visibleImages.length >
                          0
                            ? "Add More Images"
                            : "Upload Color Images"}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          Select
                          multiple
                          images at
                          once
                        </p>
                      </label>
                    </div>

                    {/* =======================================
                     * Remove Color
                     * ===================================== */}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          removeColor(
                            color.id
                          )
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
                        <Trash2
                          size={
                            18
                          }
                        />

                        Remove
                        Color
                      </button>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      )}
    </div>
  );
}