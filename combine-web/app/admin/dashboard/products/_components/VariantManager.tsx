"use client";

import { ProductVariantItem } from "@/types";

type VariantManagerProps = {
  variants: ProductVariantItem[];
  onChange: (
    variants: ProductVariantItem[]
  ) => void;
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
        isNew: true,
        deleted: false,
      },
    ]);
  }

  function updateVariant(
    index: number,
    field: keyof ProductVariantItem,
    value: string
  ) {
    const next = [...variants];

    next[index] = {
      ...next[index],
      [field]: value,
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
            Manage different sizes and specifications.
          </p>
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
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
              className="rounded-xl border border-neutral-200 p-5"
            >
              <div className="grid gap-4 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-medium">
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
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
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
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
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
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

              </div>

              <div className="mt-4 flex justify-end">

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

      </div>

    </div>
  );
}