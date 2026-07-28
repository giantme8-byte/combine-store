"use client";

import Image from "next/image";
import { ChangeEvent } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

import type { ProductImageItem } from "@/types/product-image";

type Props = {
  colors: ProductImageItem[];
  onChange: (
    colors: ProductImageItem[]
  ) => void;
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
        url: "",
        publicId: null,
        isNew: true,
      },
    ]);
  }

function removeColor(id: string) {
  onChange(
    colors.filter(
      (color) => color.id !== id
    )
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

function updateColorImage(
  id: string,
  e: ChangeEvent<HTMLInputElement>
) {
  const file =
    e.target.files?.[0];

  if (!file) return;

  onChange(
    colors.map((color) =>
      color.id === id
        ? {
            ...color,
            file,
            url: URL.createObjectURL(file),
            isNew: true,
          }
        : color
    )
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

                  {colors.map((color) => (

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

              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Color Name
                </label>

                <input
                  type="text"
                  value={color.name ?? ""}
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

                    <Image
                      src={color.url}
                      alt={color.name || "Color"}
                      width={180}
                      height={180}
                      className="
                        h-36
                        w-auto
                        object-contain
                      "
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