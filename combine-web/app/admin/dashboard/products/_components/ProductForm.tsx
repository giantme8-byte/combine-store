"use client";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import ImageUpload from "./ImageUpload";
import CategorySelect from "./CategorySelect";
import type { ProductImageItem } from "@/types/product-image";
import type { ColorImageItem } from "@/types/color-image";
import ColorUpload from "./ColorUpload";
import type { ProductVariantItem } from "@/types";
import VariantManager from "./VariantManager";

import type {
  Brand,
  Category,
  SubCategory,
  Product,
  ProductImage,
  ProductColor,
  ProductColorImage,
  ProductVariant,
  ProductVariantImage,
  PackagingProfile,
  Color,
} from "@prisma/client";

type ProductColorWithImages = ProductColor & {
  images?: ProductColorImage[];
};

type ProductVariantWithImages =
  ProductVariant & {
    images: ProductVariantImage[];
  };

type ProductWithRelations = Product & {
  images: ProductImage[];
  colors: ProductColorWithImages[];
  variants: ProductVariantWithImages[];
};

type ProductFormProps = {
  action: (
    formData: FormData
  ) => void | Promise<unknown>;

  product?: ProductWithRelations;

  submitText: string;

  categories: Category[];

  subCategories: SubCategory[];

  brands: Brand[];

  packagingProfiles: PackagingProfile[];

  globalColors: Color[];

  exchangeRate: number;

  returnTo?: string;
};

function formatCreatedDate(
  date: Date | string
) {
  return new Intl.DateTimeFormat(
    "en-MY",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    }
  ).format(new Date(date));
}

export default function ProductForm({
  action,
  product,
  submitText,
  categories,
  subCategories,
  brands,
  packagingProfiles,
  globalColors,
  exchangeRate,
  returnTo,
}: ProductFormProps) {
  const router = useRouter();

  const formRef =
    useRef<HTMLFormElement>(null);

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [
    images,
    setImages,
  ] = useState<ProductImageItem[]>([]);

  const [colors, setColors] =
    useState<ColorImageItem[]>([]);

  const [variants, setVariants] =
    useState<ProductVariantItem[]>([]);

  const [
    costPriceCny,
    setCostPriceCny,
  ] = useState<number>(
    product?.costPriceCny ?? 0
  );

  const [
    sellingPrice,
    setSellingPrice,
  ] = useState<number>(
    product?.price ?? 0
  );

  const [slug, setSlug] = useState(
    product?.slug ?? ""
  );

  const slugEdited =
    useRef(false);

  useEffect(() => {
    if (!product) {
      return;
    }

    /*
     * =========================================================
     * PRODUCT IMAGES
     * =========================================================
     */

    setImages(
      product.images.map(
        (image) => ({
          id:
            image.id.toString(),

          url:
            image.url,

          publicId:
            image.publicId,

          isNew:
            false,

          sortOrder:
            image.sortOrder,

          deleted:
            false,
        })
      )
    );

    /*
     * =========================================================
     * COLORS
     * =========================================================
     */

    setColors(
      product.colors.map(
        (color) => {
          const galleryImages =
            color.images?.map(
              (image) => ({
                id:
                  image.id.toString(),

                url:
                  image.url,

                publicId:
                  image.publicId ??
                  "",

                isNew:
                  false,

                sortOrder:
                  image.sortOrder,

                deleted:
                  false,
              })
            ) ?? [];

          /*
           * Backward compatibility:
           *
           * Old Colors may only have
           * ProductColor.imageUrl/publicId.
           */

          if (
            galleryImages.length ===
              0 &&
            color.imageUrl
          ) {
            galleryImages.push({
              id:
                `legacy-${color.id}`,

              url:
                color.imageUrl,

              publicId:
                color.publicId ??
                "",

              isNew:
                false,

              sortOrder:
                0,

              deleted:
                false,
            });
          }

          return {
            id:
              color.id.toString(),

            colorId:
              color.colorId ??
              null,

            name:
              color.name,

            model:
              color.model ??
              "",

            url:
              color.imageUrl,

            publicId:
              color.publicId,

            images:
              galleryImages,

            isNew:
              false,

            sortOrder:
              color.sortOrder,

            deleted:
              false,
          };
        }
      )
    );

    /*
     * =========================================================
     * VARIANTS
     * =========================================================
     *
     * IMPORTANT:
     *
     * A Variant can now contain multiple images.
     *
     * Example:
     *
     * Black / Small
     *   ├── Front
     *   ├── Back
     *   └── Side
     *
     * Black / Medium
     *   ├── Front
     *   └── Detail
     *
     * We also keep the legacy imageUrl/publicId fields
     * for backward compatibility.
     */

    setVariants(
      product.variants.map(
        (variant) => ({
          id:
            variant.id.toString(),

          colorId:
            variant.colorId ??
            null,

          size:
            variant.size,

          model:
            variant.model ??
            "",

          dimensions:
            variant.dimensions ??
            "",

          /*
           * Legacy single Variant image.
           */
          imageUrl:
            variant.imageUrl ??
            "",

          publicId:
            variant.publicId ??
            "",

          /*
           * New Variant gallery.
           */
          images:
            variant.images.map(
              (image) => ({
                id:
                  image.id.toString(),

                url:
                  image.url,

                publicId:
                  image.publicId,

                sortOrder:
                  image.sortOrder,

                isNew:
                  false,

                deleted:
                  false,
              })
            ),

          file:
            undefined,

          isNew:
            false,

          deleted:
            false,
        })
      )
    );

    setCostPriceCny(
      product.costPriceCny ?? 0
    );

    setSellingPrice(
      product.price ?? 0
    );

    setSlug(
      product.slug ?? ""
    );

    slugEdited.current =
      false;
  }, [product]);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(
        /&/g,
        "and"
      )
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      );
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }

    if (isPending) {
      return;
    }

    /*
     * =========================================================
     * IMAGE UPLOAD CHECK
     * =========================================================
     */

    const uploadingImages =
      images.filter(
        (image) =>
          image.isNew &&
          !image.deleted &&
          image.status ===
            "uploading"
      );

    if (
      uploadingImages.length >
      0
    ) {
      alert(
        "Please wait for all images to finish uploading."
      );

      return;
    }

    const failedImages =
      images.filter(
        (image) =>
          image.isNew &&
          !image.deleted &&
          image.status ===
            "failed"
      );

    if (
      failedImages.length >
      0
    ) {
      alert(
        "Some images failed to upload. Please remove them and upload again."
      );

      return;
    }

    const incompleteImages =
      images.filter(
        (image) =>
          image.isNew &&
          !image.deleted &&
          (
            !image.url ||
            !image.publicId ||
            image.status !==
              "uploaded"
          )
      );

    if (
      incompleteImages.length >
      0
    ) {
      alert(
        "Some images are not ready yet. Please wait for the upload to finish."
      );

      return;
    }

    /*
     * =========================================================
     * CREATE FORM DATA
     * =========================================================
     */

    const formData =
      new FormData(
        formRef.current
      );

    /*
     * =========================================================
     * PRODUCT IMAGE LIMIT
     * =========================================================
     */

    const MAX_IMAGES = 20;

    const visibleImages =
      images.filter(
        (image) =>
          !image.deleted
      );

    if (
      visibleImages.length >
      MAX_IMAGES
    ) {
      alert(
        "Maximum 20 images."
      );

      return;
    }

    /*
     * =========================================================
     * PRODUCT IMAGES
     * =========================================================
     */

    images.forEach(
      (
        image,
        index
      ) => {
        formData.append(
          "imageOrder",
          JSON.stringify({
            id:
              image.id,

            url:
              image.url,

            publicId:
              image.publicId,

            sortOrder:
              index,

            isNew:
              image.isNew,

            deleted:
              image.deleted ??
              false,
          })
        );
      }
    );

    /*
     * =========================================================
     * COLORS
     * =========================================================
     */

    async function uploadColorImage(
      file: File
    ): Promise<{
      url: string;
      publicId: string;
    }> {
      const signatureResponse =
        await fetch(
          "/api/cloudinary/sign",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      if (
        !signatureResponse.ok
      ) {
        throw new Error(
          "Failed to create Cloudinary upload signature."
        );
      }

      const signatureData =
        await signatureResponse.json();

      if (
        !signatureData.signature ||
        !signatureData.timestamp ||
        !signatureData.folder ||
        !signatureData.cloudName ||
        !signatureData.apiKey
      ) {
        throw new Error(
          "Invalid Cloudinary signature response."
        );
      }

      const uploadData =
        new FormData();

      uploadData.append(
        "file",
        file
      );

      uploadData.append(
        "api_key",
        signatureData.apiKey
      );

      uploadData.append(
        "timestamp",
        String(
          signatureData.timestamp
        )
      );

      uploadData.append(
        "signature",
        signatureData.signature
      );

      uploadData.append(
        "folder",
        signatureData.folder
      );

      const uploadUrl =
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;

      const uploadResponse =
        await fetch(
          uploadUrl,
          {
            method:
              "POST",

            body:
              uploadData,
          }
        );

      if (
        !uploadResponse.ok
      ) {
        throw new Error(
          `Cloudinary upload failed with status ${uploadResponse.status}.`
        );
      }

      const data =
        await uploadResponse.json();

      if (
        !data?.secure_url ||
        !data?.public_id
      ) {
        throw new Error(
          "Invalid response from Cloudinary."
        );
      }

      return {
        url:
          data.secure_url,

        publicId:
          data.public_id,
      };
    }

    for (
      let colorIndex = 0;
      colorIndex <
        colors.length;
      colorIndex++
    ) {
      const color =
        colors[
          colorIndex
        ];

      const visibleImages =
        (
          color.images ??
          []
        ).filter(
          (image) =>
            !image.deleted
        );

      const galleryImages: {
        id: string;
        url: string;
        publicId: string;
        sortOrder: number;
      }[] = [];

      for (
        let imageIndex = 0;
        imageIndex <
          visibleImages.length;
        imageIndex++
      ) {
        const image =
          visibleImages[
            imageIndex
          ];

        if (
          image.file
        ) {
          const uploaded =
            await uploadColorImage(
              image.file
            );

          galleryImages.push({
            id:
              image.id,

            url:
              uploaded.url,

            publicId:
              uploaded.publicId,

            sortOrder:
              imageIndex,
          });

          continue;
        }

        if (
          image.url &&
          image.publicId
        ) {
          galleryImages.push({
            id:
              image.id,

            url:
              image.url,

            publicId:
              image.publicId,

            sortOrder:
              imageIndex,
          });
        }
      }

      /*
       * Legacy Color compatibility.
       */

      if (
        galleryImages.length ===
          0 &&
        color.url &&
        color.publicId
      ) {
        galleryImages.push({
          id:
            `legacy-${color.id}`,

          url:
            color.url,

          publicId:
            color.publicId,

          sortOrder:
            0,
        });
      }

      formData.append(
        "colorOrder",
        JSON.stringify({
          id:
            color.id,

          colorId:
            color.colorId ??
            null,

          name:
            color.name,

          model:
            color.model,

          publicId:
            galleryImages[0]
              ?.publicId ??
            color.publicId ??
            "",

          sortOrder:
            colorIndex,

          isNew:
            color.isNew,

          deleted:
            color.deleted ??
            false,

          hasNewImage:
            visibleImages.some(
              (image) =>
                Boolean(
                  image.file
                )
            ),

          images:
            galleryImages.map(
              (
                image
              ) => ({
                id:
                  image.id,

                url:
                  image.url,

                publicId:
                  image.publicId,

                sortOrder:
                  image.sortOrder,

                deleted:
                  false,
              })
            ),
        })
      );
    }

    /*
     * =========================================================
     * VARIANTS
     * =========================================================
     *
     * IMPORTANT:
     *
     * The Variant gallery is now stored inside
     * variant.images.
     *
     * For this step we keep the existing submit
     * structure untouched.
     *
     * The Server Action migration will be handled
     * separately after the TypeScript structure
     * is confirmed.
     */

    variants.forEach(
      (
        variant,
        index
      ) => {
        formData.append(
          "variantOrder",
          JSON.stringify({
            id:
              variant.id,

            colorId:
              variant.colorId ??
              null,

            size:
              variant.size,

            model:
              variant.model,

            dimensions:
              variant.dimensions,

            imageUrl:
              variant.imageUrl ??
              "",

            publicId:
              variant.publicId ??
              "",

            /*
             * New Variant gallery metadata.
             */
            images:
              (
                variant.images ??
                []
              )
                .filter(
                  (
                    image
                  ) =>
                    !image.deleted
                )
                .map(
                  (
                    image,
                    imageIndex
                  ) => ({
                    id:
                      image.id,

                    url:
                      image.url,

                    publicId:
                      image.publicId,

                    sortOrder:
                      imageIndex,

                    isNew:
                      image.isNew ??
                      false,

                    deleted:
                      image.deleted ??
                      false,
                  })
                ),

            sortOrder:
              index,

            isNew:
              variant.isNew,

            deleted:
              variant.deleted,

            /*
             * Legacy upload compatibility.
             */
            hasNewImage:
              !!variant.file,
          })
        );

        /*
         * Keep legacy single-file upload
         * temporarily for compatibility.
         */
        if (
          variant.file
        ) {
          formData.append(
            "variantImages",
            variant.file
          );
        }
      }
    );

    /*
     * =========================================================
     * SAVE PRODUCT
     * =========================================================
     */

    startTransition(
      async () => {
        try {
          await action(
            formData
          );

          router.push(
            returnTo ||
              "/admin/dashboard/products"
          );

          router.refresh();
        } catch (
          error
        ) {
          console.error(
            "Failed to save product:",
            error
          );

          alert(
            "Failed to save product. Please try again."
          );
        }
      }
    );
  }

  /*
   * Only active packaging profiles
   * should be selectable.
   */

  const activePackaging =
    packagingProfiles.filter(
      (
        packaging
      ) =>
        packaging.active
    );

  return (
    <form
      ref={formRef}
      id="product-form"
      onSubmit={
        handleSubmit
      }
    >
      <div className="grid gap-8 xl:grid-cols-[2fr_380px]">

        {/* ===================================================== */}
        {/* LEFT */}
        {/* ===================================================== */}

        <div className="space-y-8">

          {/* =================================================== */}
          {/* General */}
          {/* =================================================== */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">
                General Information
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Basic information about this product.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Brand */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Brand
                </label>

                <select
                  name="brand"
                  defaultValue={
                    product?.brand ||
                    ""
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                  required
                >
                  <option value="">
                    Select Brand
                  </option>

                  {brands.map(
                    (
                      brand
                    ) => (
                      <option
                        key={
                          brand.id
                        }
                        value={
                          brand.name
                        }
                      >
                        {
                          brand.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* SKU */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  SKU
                </label>

                <input
                  name="sku"
                  placeholder="e.g. SKU-0001"
                  defaultValue={
                    product?.sku ??
                    ""
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                />
              </div>

              {/* Product Name */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Product Name
                </label>

                <input
                  name="name"
                  placeholder="Product Name"
                  defaultValue={
                    product?.name
                  }
                  onChange={(
                    e
                  ) => {
                    if (
                      !slugEdited.current
                    ) {
                      setSlug(
                        slugify(
                          e.target
                            .value
                        )
                      );
                    }
                  }}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                  required
                />
              </div>

              {/* Slug */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Slug
                </label>

                <input
                  name="slug"
                  value={
                    slug
                  }
                  onChange={(
                    e
                  ) => {
                    slugEdited.current =
                      true;

                    setSlug(
                      slugify(
                        e.target
                          .value
                      )
                    );
                  }}
                  placeholder="product-slug"
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                />

                <p className="text-xs text-neutral-500">
                  Used for product URL.
                </p>
              </div>

              {/* Model */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Model
                </label>

                <input
                  name="model"
                  placeholder="Model No. (Optional)"
                  defaultValue={
                    product?.model ??
                    ""
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                />
              </div>

            </div>

            {/* Short Description */}

            <div className="mt-5 space-y-2">
              <label className="mb-1 block text-sm font-semibold text-neutral-700">
                Short Description
              </label>

              <textarea
                name="shortDescription"
                placeholder="Short Description"
                defaultValue={
                  product?.shortDescription ??
                  ""
                }
                className="h-20 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
              />
            </div>

          </div>

          {/* =================================================== */}
          {/* Pricing */}
          {/* =================================================== */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Pricing
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Configure selling price and cost.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Price Remark */}

              <div className="space-y-2 md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Price Remark
                </label>

                <input
                  name="priceRemark"
                  placeholder="Factory A ¥450 • Factory B ¥520"
                  defaultValue={
                    product?.priceRemark ??
                    ""
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                />
              </div>

              {/* Cost Price */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Cost Price (CNY)
                </label>

                <input
                  name="costPriceCny"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="¥ 0.00"
                  value={
                    costPriceCny
                  }
                  onChange={(
                    e
                  ) =>
                    setCostPriceCny(
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                />
              </div>

              {/* Selling Price */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Selling Price (MYR)
                </label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="RM 0.00"
                  value={
                    sellingPrice
                  }
                  onChange={(
                    e
                  ) =>
                    setSellingPrice(
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                  required
                />
              </div>

            </div>

            {/* Profit Summary */}

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">

              <h3 className="mb-5 text-lg font-medium">
                Profit Summary
              </h3>

              <div className="space-y-4 text-sm">

                <div className="flex justify-between">
                  <span>
                    Cost Price (CNY)
                  </span>

                  <span className="font-medium">
                    ¥{" "}
                    {product?.costPriceCny?.toFixed(
                      2
                    ) ??
                      "0.00"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Exchange Rate
                  </span>

                  <span className="font-medium">
                    {exchangeRate.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Estimated Cost (MYR)
                  </span>

                  <span className="font-medium">
                    RM{" "}
                    {(
                      costPriceCny *
                      exchangeRate
                    ).toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Selling Price
                  </span>

                  <span className="font-medium">
                    RM{" "}
                    {sellingPrice.toFixed(
                      2
                    )}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between text-base font-semibold">
                  <span>
                    Estimated Profit
                  </span>

                  <span className="text-green-600">
                    RM{" "}
                    {(
                      sellingPrice -
                      costPriceCny *
                        exchangeRate
                    ).toFixed(
                      2
                    )}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* =================================================== */}
          {/* Product Details */}
          {/* =================================================== */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Product Details
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Physical specifications and description.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Category */}

              <CategorySelect
                categories={
                  categories
                }
                subCategories={
                  subCategories
                }
                product={
                  product
                }
              />

              {/* Availability */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Availability
                </label>

                <select
                  name="availability"
                  defaultValue={
                    product?.availability ??
                    "PRE_ORDER"
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                >
                  <option value="IN_STOCK">
                    In Stock
                  </option>

                  <option value="PRE_ORDER">
                    Pre-order (7–10 Days)
                  </option>

                  <option value="LIMITED">
                    Limited Stock
                  </option>

                  <option value="SOLD_OUT">
                    Sold Out
                  </option>
                </select>
              </div>

              {/* ================================================= */}
              {/* Packaging */}
              {/* ================================================= */}

              <div className="space-y-2 md:col-span-2">

                <div>
                  <label
                    htmlFor="customPackagingId"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Packaging
                  </label>

                  <p className="mb-3 text-xs leading-5 text-neutral-500">
                    By default, this product will use
                    its brand packaging. If no brand
                    packaging is available, the default
                    packaging will be used.
                  </p>
                </div>

                <select
                  id="customPackagingId"
                  name="customPackagingId"
                  defaultValue={
                    product?.customPackagingId
                      ? String(
                          product.customPackagingId
                        )
                      : ""
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                >
                  <option value="">
                    Automatic — Brand Packaging
                  </option>

                  {activePackaging.map(
                    (
                      packaging
                    ) => (
                      <option
                        key={
                          packaging.id
                        }
                        value={
                          packaging.id
                        }
                      >
                        {packaging.brand
                          ? `${packaging.name} — Brand`
                          : `${packaging.name} — Default`}
                      </option>
                    )
                  )}
                </select>

                <p className="text-xs text-neutral-400">
                  Select a packaging profile only when
                  this product needs a custom packaging
                  override.
                </p>

              </div>

              {/* Dimensions */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Dimensions
                </label>

                <input
                  name="dimensions"
                  placeholder="L 22 × H 13 × W 9.5 cm"
                  defaultValue={
                    product?.dimensions ??
                    ""
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                />
              </div>

              {/* Primary Color */}

              <div className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Primary Color
                </label>

                <input
                  name="mainColor"
                  placeholder="Primary Color"
                  defaultValue={
                    product?.mainColor ??
                    ""
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                />
              </div>

              {/* Colors */}

              <ColorUpload
                colors={
                  colors
                }
                globalColors={
                  globalColors
                }
                onChange={
                  setColors
                }
              />

            </div>

            {/* Description */}

            <div className="mt-6 space-y-2">
              <label className="mb-1 block text-sm font-semibold text-neutral-700">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Description"
                defaultValue={
                  product?.description
                }
                className="h-40 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
                required
              />
            </div>

          </div>

          {/* =================================================== */}
          {/* Variants */}
          {/* =================================================== */}

          <VariantManager
            variants={
              variants
            }
            colors={
              colors
            }
            onChange={
              setVariants
            }
          />

        </div>

        {/* ===================================================== */}
        {/* RIGHT */}
        {/* ===================================================== */}

        <div className="space-y-8">

          {/* =================================================== */}
          {/* Media */}
          {/* =================================================== */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Media
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Upload the main image and gallery images.
              </p>
            </div>

            <ImageUpload
              images={
                images
              }
              onChange={
                setImages
              }
            />

          </div>

          {/* =================================================== */}
          {/* Product Information */}
          {/* =================================================== */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Product Information
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Quick overview of this product.
              </p>
            </div>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span>
                  Brand
                </span>

                <span className="font-medium">
                  {product?.brand ||
                    "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  SKU
                </span>

                <span className="font-medium">
                  {product?.sku ||
                    "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Category
                </span>

                <span className="font-medium">
                  {product?.category ||
                    "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Created
                </span>

                <span className="font-medium">
                  {product
                    ? formatCreatedDate(
                        product.createdAt
                      )
                    : "-"}
                </span>
              </div>

            </div>

          </div>

          {/* =================================================== */}
          {/* Product Tags */}
          {/* =================================================== */}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Product Tags
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Highlight this product in different sections.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={
                    product?.featured
                  }
                />

                Featured
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="newArrival"
                  defaultChecked={
                    product?.newArrival
                  }
                />

                New Arrival
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="bestSeller"
                  defaultChecked={
                    product?.bestSeller
                  }
                />

                Best Seller
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="limited"
                  defaultChecked={
                    product?.limited
                  }
                />

                Limited Edition
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="onSale"
                  defaultChecked={
                    product?.onSale
                  }
                />

                Sale
              </label>

            </div>

          </div>

          {/* =================================================== */}
          {/* Save Button */}
          {/* =================================================== */}

          <button
            type="submit"
            disabled={
              isPending
            }
            className="w-full rounded-xl bg-black px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Saving Product..."
              : submitText}
          </button>

        </div>

      </div>
    </form>
  );
}