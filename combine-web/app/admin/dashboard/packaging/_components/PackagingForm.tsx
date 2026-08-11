"use client";

import {
  ChangeEvent,
  useState,
} from "react";

type PackagingImage = {
  id: number;
  url: string;
  publicId: string;
  altText: string | null;
  caption: string | null;
  sortOrder: number;
};

type PackagingItem = {
  id: number;
  name: string;
  sortOrder: number;
};

type PackagingData = {
  id: number;
  key: string;
  name: string;
  brand: string | null;
  title: string | null;
  description: string | null;
  active: boolean;
  images: PackagingImage[];
  items: PackagingItem[];
};

type Brand = {
  id: number;
  name: string;
};

type PackagingFormProps = {
  action: (
    formData: FormData
  ) => void | Promise<void>;

  brands: Brand[];

  submitText: string;

  packaging?: PackagingData;
};

type ImageItem = {
  id: string;
  url: string;
  publicId: string | null;
  file: File | null;
  isNew: boolean;
  deleted: boolean;
  sortOrder: number;
};

export default function PackagingForm({
  action,
  brands,
  submitText,
  packaging,
}: PackagingFormProps) {
  const isEdit = Boolean(packaging);

  const [type, setType] =
    useState<"default" | "brand">(
      packaging?.brand
        ? "brand"
        : "default"
    );

  const [items, setItems] =
    useState<string[]>(
      packaging?.items.map(
        (item) => item.name
      ) ?? []
    );

  const [itemInput, setItemInput] =
    useState("");

  const [images, setImages] =
    useState<ImageItem[]>(
      packaging?.images.map(
        (image) => ({
          id: String(image.id),
          url: image.url,
          publicId:
            image.publicId,
          file: null,
          isNew: false,
          deleted: false,
          sortOrder:
            image.sortOrder,
        })
      ) ?? []
    );

  const visibleImages =
    images.filter(
      (image) =>
        !image.deleted
    );

  function addItem() {
    const value =
      itemInput.trim();

    if (!value) return;

    setItems((current) => [
      ...current,
      value,
    ]);

    setItemInput("");
  }

  function removeItem(
    index: number
  ) {
    setItems((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  }

  function moveItem(
    index: number,
    direction: "up" | "down"
  ) {
    setItems((current) => {
      const next = [
        ...current,
      ];

      const target =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        target < 0 ||
        target >= next.length
      ) {
        return current;
      }

      [
        next[index],
        next[target],
      ] = [
        next[target],
        next[index],
      ];

      return next;
    });
  }

  function handleImageUpload(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      e.target.files ?? []
    );

    if (!files.length) return;

    const newImages: ImageItem[] =
      files.map(
        (file, index) => ({
          id:
            crypto.randomUUID(),
          url:
            URL.createObjectURL(
              file
            ),
          publicId: null,
          file,
          isNew: true,
          deleted: false,
          sortOrder:
            visibleImages.length +
            index +
            1,
        })
      );

    setImages((current) => [
      ...current,
      ...newImages,
    ]);

    e.target.value = "";
  }

  function removeImage(
    id: string
  ) {
    setImages((current) =>
      current.flatMap(
        (image) => {
          if (
            image.id !== id
          ) {
            return [image];
          }

          if (image.isNew) {
            URL.revokeObjectURL(
              image.url
            );

            return [];
          }

          return [
            {
              ...image,
              deleted: true,
            },
          ];
        }
      )
    );
  }

  function moveImage(
    index: number,
    direction: "left" | "right"
  ) {
    setImages((current) => {
      const visible =
        current.filter(
          (image) =>
            !image.deleted
        );

      const deleted =
        current.filter(
          (image) =>
            image.deleted
        );

      const target =
        direction === "left"
          ? index - 1
          : index + 1;

      if (
        target < 0 ||
        target >= visible.length
      ) {
        return current;
      }

      [
        visible[index],
        visible[target],
      ] = [
        visible[target],
        visible[index],
      ];

      const reordered =
        visible.map(
          (image, imageIndex) => ({
            ...image,
            sortOrder:
              imageIndex + 1,
          })
        );

      return [
        ...reordered,
        ...deleted,
      ];
    });
  }

  return (
    <form
      action={action}
      className="space-y-10"
    >
      {/* Packaging Type */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">
            Packaging Type
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Choose whether this packaging
            is the default packaging or
            belongs to a specific brand.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Default */}
          <button
            type="button"
            onClick={() =>
              setType("default")
            }
            className={`
              rounded-2xl
              border
              p-5
              text-left
              transition
              ${
                type === "default"
                  ? "border-black bg-black text-white"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }
            `}
          >
            <p className="font-medium">
              Default Packaging
            </p>

            <p
              className={`
                mt-2 text-sm
                ${
                  type === "default"
                    ? "text-white/70"
                    : "text-neutral-500"
                }
              `}
            >
              Used when no brand-specific
              packaging is available.
            </p>
          </button>

          {/* Brand */}
          <button
            type="button"
            onClick={() =>
              setType("brand")
            }
            className={`
              rounded-2xl
              border
              p-5
              text-left
              transition
              ${
                type === "brand"
                  ? "border-black bg-black text-white"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }
            `}
          >
            <p className="font-medium">
              Brand Packaging
            </p>

            <p
              className={`
                mt-2 text-sm
                ${
                  type === "brand"
                    ? "text-white/70"
                    : "text-neutral-500"
                }
              `}
            >
              Automatically used for
              products from this brand.
            </p>
          </button>
        </div>

        <input
          type="hidden"
          name="type"
          value={type}
        />
      </section>

      {/* Brand */}
      {type === "brand" && (
        <section className="space-y-2">
          <label
            htmlFor="brand"
            className="block text-sm font-medium"
          >
            Brand
          </label>

          <select
            id="brand"
            name="brand"
            required
            defaultValue={
              packaging?.brand ?? ""
            }
            className="
              w-full
              rounded-xl
              border
              border-neutral-200
              bg-white
              p-3
              outline-none
              transition
              focus:border-black
              focus:ring-2
              focus:ring-black/10
            "
          >
            <option
              value=""
              disabled
            >
              Select a brand
            </option>

            {brands.map(
              (brand) => (
                <option
                  key={brand.id}
                  value={brand.name}
                >
                  {brand.name}
                </option>
              )
            )}
          </select>
        </section>
      )}

      {/* Name */}
      <section className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium"
        >
          Packaging Name
        </label>

        <input
          id="name"
          name="name"
          defaultValue={
            packaging?.name ?? ""
          }
          placeholder={
            type === "default"
              ? "Default Packaging"
              : "e.g. Louis Vuitton Packaging"
          }
          className="
            w-full
            rounded-xl
            border
            border-neutral-200
            p-3
            outline-none
            transition
            focus:border-black
            focus:ring-2
            focus:ring-black/10
          "
          required
        />
      </section>

      {/* Title */}
      <section className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium"
        >
          Packaging Title
        </label>

        <input
          id="title"
          name="title"
          defaultValue={
            packaging?.title ?? ""
          }
          placeholder="e.g. Signature Packaging"
          className="
            w-full
            rounded-xl
            border
            border-neutral-200
            p-3
            outline-none
            transition
            focus:border-black
            focus:ring-2
            focus:ring-black/10
          "
        />
      </section>

      {/* Description */}
      <section className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={
            packaging?.description ?? ""
          }
          placeholder="Describe the packaging..."
          className="
            w-full
            rounded-xl
            border
            border-neutral-200
            p-3
            outline-none
            transition
            focus:border-black
            focus:ring-2
            focus:ring-black/10
          "
        />
      </section>

      {/* Packaging Items */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">
            Packaging Includes
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Add everything included in
            this packaging.
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={itemInput}
            onChange={(e) =>
              setItemInput(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                e.preventDefault();
                addItem();
              }
            }}
            placeholder="e.g. Branded Box"
            className="
              min-w-0
              flex-1
              rounded-xl
              border
              border-neutral-200
              p-3
              outline-none
              focus:border-black
            "
          />

          <button
            type="button"
            onClick={addItem}
            className="
              rounded-xl
              bg-black
              px-5
              text-sm
              text-white
              transition
              hover:bg-neutral-800
            "
          >
            Add
          </button>
        </div>

        {items.length > 0 && (
          <div className="space-y-2">
            {items.map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    p-3
                  "
                >
                  <span className="w-6 text-sm text-neutral-400">
                    {index + 1}
                  </span>

                  <span className="flex-1 text-sm">
                    {item}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      moveItem(
                        index,
                        "up"
                      )
                    }
                    disabled={
                      index === 0
                    }
                    className="rounded-lg border px-2 py-1 text-xs disabled:opacity-30"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      moveItem(
                        index,
                        "down"
                      )
                    }
                    disabled={
                      index ===
                      items.length - 1
                    }
                    className="rounded-lg border px-2 py-1 text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        index
                      )
                    }
                    className="
                      rounded-lg
                      px-2
                      py-1
                      text-xs
                      text-red-600
                      hover:bg-red-50
                    "
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        )}

        <input
          type="hidden"
          name="items"
          value={JSON.stringify(
            items
          )}
        />
      </section>

      {/* Packaging Images */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-medium">
            Packaging Images
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Upload packaging photos.
            The first image will be the
            main image.
          </p>
        </div>

        {/* Upload */}
        <label
          htmlFor="packaging-images"
          className="
            flex
            h-32
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
          <span className="text-3xl text-neutral-400">
            +
          </span>

          <span className="mt-2 text-sm font-medium">
            Add Packaging Images
          </span>

          <span className="mt-1 text-xs text-neutral-500">
            Select multiple images
          </span>

          <input
            id="packaging-images"
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="hidden"
            onChange={
              handleImageUpload
            }
          />
        </label>

        {/* Images */}
        {visibleImages.length >
          0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {visibleImages.map(
              (
                image,
                index
              ) => (
                <div
                  key={image.id}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-white
                  "
                >
                  <div className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={`Packaging image ${
                        index + 1
                      }`}
                      className="h-full w-full object-cover"
                    />

                    {index ===
                      0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                        Cover
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 p-3">
                    <button
                      type="button"
                      onClick={() =>
                        moveImage(
                          index,
                          "left"
                        )
                      }
                      disabled={
                        index === 0
                      }
                      className="rounded-lg border px-2 py-1 text-xs disabled:opacity-30"
                    >
                      ←
                    </button>

                    <span className="text-xs text-neutral-400">
                      {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        moveImage(
                          index,
                          "right"
                        )
                      }
                      disabled={
                        index ===
                        visibleImages.length -
                          1
                      }
                      className="rounded-lg border px-2 py-1 text-xs disabled:opacity-30"
                    >
                      →
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          image.id
                        )
                      }
                      className="ml-auto rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Existing image state */}
        <input
          type="hidden"
          name="existingImages"
          value={JSON.stringify(
            visibleImages
              .filter(
                (image) =>
                  !image.isNew
              )
              .map(
                (image) => ({
                  id: Number(
                    image.id
                  ),
                  sortOrder:
                    image.sortOrder,
                })
              )
          )}
        />

        {/* Deleted images */}
        <input
          type="hidden"
          name="deletedImages"
          value={JSON.stringify(
            images
              .filter(
                (image) =>
                  image.deleted &&
                  !image.isNew
              )
              .map(
                (image) =>
                  Number(
                    image.id
                  )
              )
          )}
        />
      </section>

      {/* Active */}
      <section>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="active"
            defaultChecked={
              packaging?.active ?? true
            }
            className="h-4 w-4"
          />

          <span className="text-sm">
            Active Packaging
          </span>
        </label>
      </section>

      {/* Submit */}
      <button
        type="submit"
        className="
          rounded-xl
          bg-black
          px-7
          py-3
          text-white
          transition
          hover:bg-neutral-800
        "
      >
        {submitText}
      </button>
    </form>
  );
}