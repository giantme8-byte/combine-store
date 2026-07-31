"use client";

import Image from "next/image";
import { ProductVariantItem } from "@/types";

type VariantManagerProps = {
  variants: ProductVariantItem[];
  onChange: (variants: ProductVariantItem[]) => void;
};

export default function VariantManager({
  variants,
  onChange,
}: VariantManagerProps) {
  function addVariant() {
    onChange([
      ...variants,
      {
        id: crypto.randomUUID(),
        size: "",
        model: "",
        dimensions: "",
        imageUrl: "",
        publicId: "",
        file: undefined,
        isNew: true,
        deleted: false,
      },
    ]);
  }

  function updateVariant(
    index: number,
    field: keyof ProductVariantItem,
    value: any
  ) {
    const next = [...variants];

    next[index] = {
      ...next[index],
      [field]: value,
    };

    onChange(next);
  }

  function handleImage(
    index: number,
    file: File
  ) {
    const next = [...variants];

    next[index] = {
      ...next[index],
      file,
      imageUrl: URL.createObjectURL(file),
    };

    onChange(next);
  }

  function removeVariant(index: number) {
    const next = [...variants];

    if (next[index].isNew) {
      next.splice(index, 1);
    } else {
      next[index].deleted = true;
    }

    onChange([...next]);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Variants
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Manage different sizes, specifications and images.
          </p>
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          + Add Variant
        </button>
      </div>

      <div className="space-y-6">
        {variants
          .filter((v) => !v.deleted)
          .map((variant, index) => (
            <div
              key={variant.id}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {/* Header */}

              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    Variant #{index + 1}
                  </h3>

                  <p className="text-xs text-neutral-500">
                    Configure size, model, dimensions and image.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>

              {/* Body */}

              <div className="space-y-6 p-5">
                {/* Image */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Variant Image
                  </label>

                  <div className="flex flex-wrap items-center gap-5">
                    {variant.imageUrl && (
                      <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100 shadow-sm">
                        <Image
                          src={variant.imageUrl}
                          alt="Variant"
                          fill
                          className="object-cover"
                        />

                        <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
                          Preview
                        </div>
                      </div>
                    )}

                    <label className="group flex h-32 w-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 transition-all duration-200 hover:border-black hover:bg-white hover:shadow-sm">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            handleImage(index, file);
                          }
                        }}
                      />

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-8 w-8 text-neutral-500 transition group-hover:text-black"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4-4 4 4 6-6 2 2v6H4z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 8h.01"
                        />
                      </svg>

                      <span className="mt-2 text-sm font-semibold text-neutral-800">
                        {variant.imageUrl
                          ? "Change Image"
                          : "Upload Image"}
                      </span>

                      <span className="text-xs text-neutral-500">
                        JPG • PNG • WEBP
                      </span>
                    </label>
                  </div>
                </div>

                {/* Fields */}

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      Size
                    </label>

                    <input
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "size",
                          e.target.value
                        )
                      }
                      placeholder="25cm (Small)"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      Model
                    </label>

                    <input
                      value={variant.model}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "model",
                          e.target.value
                        )
                      }
                      placeholder="M46703"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      Dimensions
                    </label>

                    <input
                      value={variant.dimensions}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "dimensions",
                          e.target.value
                        )
                      }
                      placeholder="30 × 22 × 10 cm"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}