"use client";

import { ChangeEvent } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

import type { ColorImageItem } from "@/types/color-image";

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
        isNew: true,
        sortOrder: colors.length,
        deleted: false,
      },
    ]);
  }

  function removeColor(id: string) {
    onChange(
      colors
        .map((color) => {
          if (color.id !== id) return color;

          if (color.isNew) {
            return null;
          }

          return {
            ...color,
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

  function updateColorImage(
    id: string,
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    onChange(
      colors.map((color) => {
        if (color.id !== id) return color;

        if (color.url.startsWith("blob:")) {
          URL.revokeObjectURL(color.url);
        }

        return {
          ...color,
          file,
          url: URL.createObjectURL(file),
        };
      })
    );

    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-neutral-700">
          Available Colors
        </label>

        <button
          type="button"
          onClick={addColor}
          className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100"
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
            .map((color) => (
              <div
                key={color.id}
                className="
                  rounded-2xl
                  border
                  border-neutral-200
                  p-5
                  space-y-5
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

                {/* Image */}
                <div className="space-y-3">
                  <input
                    id={`color-${color.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      updateColorImage(
                        color.id,
                        e
                      )
                    }
                  />

                  <label
                    htmlFor={`color-${color.id}`}
                    className="
                      flex
                      h-44
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border-2
                      border-dashed
                      border-neutral-300
                      bg-neutral-50
                      transition
                      hover:border-black
                      hover:bg-neutral-100
                    "
                  >
                    {color.url ? (
                      <img
                        src={color.url}
                        alt={color.name || "Color"}
                        className="h-36 w-auto object-contain"
                      />
                    ) : (
                      <>
                        <ImagePlus
                          size={36}
                          className="text-neutral-400"
                        />

                        <p className="mt-3 text-sm font-medium">
                          Upload Color Image
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {/* Remove */}
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

                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}