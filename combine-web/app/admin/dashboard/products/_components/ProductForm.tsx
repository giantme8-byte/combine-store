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


type ProductColorWithImages =
  ProductColor & {
    images?: ProductColorImage[];
  };


type ProductVariantWithImages =
  ProductVariant & {
    images: ProductVariantImage[];
  };


type ProductWithRelations =
  Product & {
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


// ============================================================
// DATE
// ============================================================

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


// ============================================================
// COMPONENT
// ============================================================

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

  const router =
    useRouter();


  const formRef =
    useRef<HTMLFormElement>(null);


  const [
    isPending,
    startTransition,
  ] = useTransition();


  // =========================================================
  // STATE
  // =========================================================

  const [
    images,
    setImages,
  ] = useState<ProductImageItem[]>([]);


  const [
    colors,
    setColors,
  ] = useState<ColorImageItem[]>([]);


  const [
    variants,
    setVariants,
  ] = useState<ProductVariantItem[]>([]);


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


  const [
    slug,
    setSlug,
  ] = useState(
    product?.slug ?? ""
  );


  const slugEdited =
    useRef(false);


  // =========================================================
  // LOAD PRODUCT
  // =========================================================

  useEffect(() => {

    if (!product) {
      return;
    }


    // =======================================================
    // PRODUCT IMAGES
    // =======================================================

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

          status:
            "uploaded",
        })
      )
    );


    // =======================================================
    // COLORS
    // =======================================================

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
            galleryImages.length === 0 &&
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


    // =======================================================
    // VARIANTS
    // =======================================================

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

          costPriceCny:
            variant.costPriceCny ??
            null,

          exchangeRate:
            variant.exchangeRate ??
            null,

          price:
            variant.price ??
            null,

          model:
            variant.model ??
            "",

          dimensions:
            variant.dimensions ??
            "",

          imageUrl:
            variant.imageUrl ??
            "",

          publicId:
            variant.publicId ??
            "",

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
      product.costPriceCny ??
      0
    );


    setSellingPrice(
      product.price ??
      0
    );


    setSlug(
      product.slug ??
      ""
    );


    slugEdited.current =
      false;

  }, [
    product,
  ]);


  // =========================================================
  // SLUGIFY
  // =========================================================

  function slugify(
    text: string
  ) {

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


  // =========================================================
  // SUBMIT
  // =========================================================

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


    // =======================================================
    // IMAGE UPLOAD CHECK
    // =======================================================

    const uploadingImages =
      images.filter(
        (image) =>
          image.isNew &&
          !image.deleted &&
          image.status ===
            "uploading"
      );


    const failedImages =
      images.filter(
        (image) =>
          image.isNew &&
          !image.deleted &&
          image.status ===
            "failed"
      );


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


    const uploadingColorImages =
      colors.some(
        (color) =>
          !color.deleted &&
          (color.images ?? []).some(
            (image) =>
              image.isNew &&
              !image.deleted &&
              image.uploadStatus ===
                "uploading"
          )
      );


    const failedColorImages =
      colors.some(
        (color) =>
          !color.deleted &&
          (color.images ?? []).some(
            (image) =>
              image.isNew &&
              !image.deleted &&
              image.uploadStatus ===
                "error"
          )
      );


    const incompleteColorImages =
      colors.some(
        (color) =>
          !color.deleted &&
          (color.images ?? []).some(
            (image) =>
              image.isNew &&
              !image.deleted &&
              (
                !image.url ||
                !image.publicId ||
                image.uploadStatus !==
                  "uploaded"
              )
          )
      );


    const uploadingVariantImages =
      variants.some(
        (variant) =>
          !variant.deleted &&
          (variant.images ?? []).some(
            (image) =>
              image.isNew &&
              !image.deleted &&
              image.uploadStatus ===
                "uploading"
          )
      );


    const failedVariantImages =
      variants.some(
        (variant) =>
          !variant.deleted &&
          (variant.images ?? []).some(
            (image) =>
              image.isNew &&
              !image.deleted &&
              image.uploadStatus ===
                "error"
          )
      );


    const incompleteVariantImages =
      variants.some(
        (variant) =>
          !variant.deleted &&
          (variant.images ?? []).some(
            (image) =>
              image.isNew &&
              !image.deleted &&
              (
                !image.url ||
                !image.publicId ||
                image.uploadStatus !==
                  "uploaded"
              )
          )
      );


    if (
      uploadingImages.length > 0 ||
      uploadingColorImages ||
      uploadingVariantImages
    ) {

      alert(
        "Please wait for all images to finish uploading."
      );

      return;
    }


    if (
      failedImages.length > 0 ||
      failedColorImages ||
      failedVariantImages
    ) {

      alert(
        "Some images failed to upload. Please remove them or retry the upload before saving."
      );

      return;
    }


    if (
      incompleteImages.length > 0 ||
      incompleteColorImages ||
      incompleteVariantImages
    ) {

      alert(
        "Some images are not ready yet. Please wait for the upload to finish."
      );

      return;
    }


    // =======================================================
    // FORM DATA
    // =======================================================

    const formData =
      new FormData(
        formRef.current
      );


    // =======================================================
    // PRODUCT IMAGE LIMIT
    // =======================================================

    const MAX_IMAGES =
      20;


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


    // =======================================================
    // PRODUCT IMAGES
    // =======================================================

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


    // =======================================================
    // COLORS
    // =======================================================

    colors.forEach(
      (
        color,
        colorIndex
      ) => {

        const visibleColorImages =
          (
            color.images ??
            []
          ).filter(
            (image) =>
              !image.deleted
          );


        const galleryImages =
          visibleColorImages
            .filter(
              (image) =>
                Boolean(
                  image.url &&
                  image.publicId
                )
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
                  image.publicId!,

                sortOrder:
                  image.sortOrder ??
                  imageIndex,

                deleted:
                  false,
              })
            );


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

            deleted:
              false,
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
              visibleColorImages.some(
                (image) =>
                  image.isNew
              ),

            images:
              galleryImages,
          })
        );

      }
    );


    // =======================================================
    // VARIANTS
    // =======================================================

    const activeVariantsForSubmit =
      variants.filter(
        (variant) =>
          !variant.deleted
      );

    const uniqueSizesForSubmit =
      new Set(
        activeVariantsForSubmit.map(
          (variant) =>
            variant.size
        )
      );

    const hasMultipleSizesForSubmit =
      uniqueSizesForSubmit.size > 1;

    variants.forEach(
      (
        variant,
        index
      ) => {

        const visibleVariantImages =
          (
            variant.images ??
            []
          ).filter(
            (image) =>
              !image.deleted
          );


        const galleryImages =
          visibleVariantImages
            .filter(
              (image) =>
                Boolean(
                  image.url &&
                  image.publicId
                )
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
                  image.sortOrder ??
                  imageIndex,

                isNew:
                  image.isNew ??
                  false,

                deleted:
                  false,
              })
            );


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

            costPriceCny:
              variant.costPriceCny ??
              null,

            exchangeRate:
              variant.exchangeRate ??
              null,

            price:
              hasMultipleSizesForSubmit
                ? variant.price ?? null
                : null,

            model:
              variant.model,

            dimensions:
              variant.dimensions,

            imageUrl:
              galleryImages[0]
                ?.url ??
              variant.imageUrl ??
              "",

            publicId:
              galleryImages[0]
                ?.publicId ??
              variant.publicId ??
              "",

            images:
              galleryImages,

            sortOrder:
              index,

            isNew:
              variant.isNew,

            deleted:
              variant.deleted,
          })
        );

      }
    );


    // =======================================================
    // SAVE PRODUCT
    // =======================================================

startTransition(
  async () => {

    try {

      await action(
        formData
      );


      // =====================================================
      // RETURN TO PRODUCTS LIST
      // =====================================================

      const destination =
        returnTo ||
        "/admin/dashboard/products";


      console.log(
        "RETURN TO:",
        returnTo
      );


      console.log(
        "DESTINATION:",
        destination
      );


      router.push(
        destination
      );

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


  // =========================================================
  // PRICING CALCULATIONS
  // =========================================================
  //
  // RULES:
  //
  // 1. No variants:
  //      Product Pricing × 1
  //
  // 2. Variants + ONE unique size:
  //      Product Pricing × number of variants
  //
  //      Example:
  //      Black / One Size
  //      White / One Size
  //      Brown / One Size
  //
  //      Product Price = RM500
  //      Revenue = RM500 × 3
  //
  // 3. Variants + MULTIPLE sizes:
  //      Each Variant uses its own Variant Pricing.
  //
  //      Every Variant = 1 stock unit.
  //
  // =========================================================

  const activeVariants =
    variants.filter(
      (variant) =>
        !variant.deleted
    );


  const uniqueSizes =
    new Set(
      activeVariants.map(
        (variant) =>
          variant.size
      )
    );


  const hasVariants =
    activeVariants.length > 0;


  const hasMultipleSizes =
    uniqueSizes.size > 1;


  // =========================================================
  // PRODUCT PRICING MODE
  // =========================================================

  const productCostMyr =
    costPriceCny *
    exchangeRate;


  const productProfitPerUnit =
    sellingPrice -
    productCostMyr;


  // =========================================================
  // INVENTORY SUMMARY FOR THIS PRODUCT
  // =========================================================

  let estimatedCostMyr =
    0;


  let potentialRevenue =
    0;


  let estimatedProfit =
    0;


  // =========================================================
  // NO VARIANTS
  // =========================================================

  if (!hasVariants) {

    estimatedCostMyr =
      productCostMyr;

    potentialRevenue =
      sellingPrice;

    estimatedProfit =
      productProfitPerUnit;

  }


  // =========================================================
  // VARIANTS + ONE SIZE
  // =========================================================
  //
  // Product Pricing applies to every Color.
  //
  // Each Color / One Size combination = 1 stock.
  //
  // =========================================================

  else if (!hasMultipleSizes) {

    const variantCount =
      activeVariants.length;


    estimatedCostMyr =
      productCostMyr *
      variantCount;


    potentialRevenue =
      sellingPrice *
      variantCount;


    estimatedProfit =
      productProfitPerUnit *
      variantCount;

  }


  // =========================================================
  // VARIANTS + MULTIPLE SIZES
  // =========================================================
  //
  // Each Variant has its own pricing.
  //
  // Every Variant = 1 stock.
  //
  // =========================================================

  else {

    for (
      const variant of
      activeVariants
    ) {

      const variantExchangeRate =
        variant.exchangeRate ??
        exchangeRate;


      const variantCostCny =
        variant.costPriceCny ??
        costPriceCny;


      const variantCostMyr =
        variantCostCny *
        variantExchangeRate;


      const variantSellingPrice =
        variant.price ??
        sellingPrice;


      estimatedCostMyr +=
        variantCostMyr;


      potentialRevenue +=
        variantSellingPrice;


      estimatedProfit +=
        variantSellingPrice -
        variantCostMyr;

    }

  }


  const estimatedMargin =
    potentialRevenue > 0
      ? (
          estimatedProfit /
          potentialRevenue
        ) *
        100
      : 0;


  // =========================================================
  // ACTIVE PACKAGING
  // =========================================================

  const activePackaging =
    packagingProfiles.filter(
      (
        packaging
      ) =>
        packaging.active
    );


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <form
      ref={formRef}
      id="product-form"
      onSubmit={
        handleSubmit
      }
    >

      <div
        className="
          grid
          gap-8
          xl:grid-cols-[2fr_380px]
        "
      >

        {/* ================================================= */}
        {/* LEFT */}
        {/* ================================================= */}

        <div className="space-y-8">

          {/* ================================================= */}
          {/* GENERAL */}
          {/* ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >

            <div className="mb-6">

              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                "
              >
                General Information
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                "
              >
                Basic information about this product.
              </p>

            </div>


            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >

              {/* Brand */}

              <div className="space-y-2">

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
                  Brand
                </label>


                <select
                  name="brand"
                  defaultValue={
                    product?.brand ||
                    ""
                  }
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
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

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
                  SKU
                </label>


                <input
                  name="sku"
                  placeholder="e.g. SKU-0001"
                  defaultValue={
                    product?.sku ??
                    ""
                  }
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
                />

              </div>


              {/* Product Name */}

              <div className="space-y-2">

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
                  required
                />

              </div>


              {/* Slug */}

              <div className="space-y-2">

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
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
                  className="
                    w-full
                    rounded-xl
                    border
                    border-neutral-300
                    bg-neutral-50
                    px-4
                    py-3
                    transition-all
                    duration-200
                    focus:border-black
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
                />


                <p
                  className="
                    text-xs
                    text-neutral-500
                  "
                >
                  Used for product URL.
                </p>

              </div>


              {/* Model */}

              <div className="space-y-2">

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
                  Model
                </label>


                <input
                  name="model"
                  placeholder="Model No. (Optional)"
                  defaultValue={
                    product?.model ??
                    ""
                  }
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
                />

              </div>

            </div>


            {/* Short Description */}

            <div className="mt-5 space-y-2">

              <label
                className="
                  mb-1
                  block
                  text-sm
                  font-semibold
                  text-neutral-700
                "
              >
                Short Description
              </label>


              <textarea
                name="shortDescription"
                placeholder="Short Description"
                defaultValue={
                  product?.shortDescription ??
                  ""
                }
                className="
                  h-20
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
                  focus:ring-2
                  focus:ring-black/5
                  focus:outline-none
                "
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* PRICING */}
          {/* ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >

            <div className="mb-6">

              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                "
              >
                Pricing
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                "
              >
                Configure selling price and cost.
              </p>

            </div>


            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >

              {/* Price Remark */}

              <div
                className="
                  space-y-2
                  md:col-span-2
                "
              >

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
                  Price Remark
                </label>


                <input
                  name="priceRemark"
                  placeholder="Factory A ¥450 • Factory B ¥520"
                  defaultValue={
                    product?.priceRemark ??
                    ""
                  }
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
                />

              </div>


              {/* Cost Price */}

              <div className="space-y-2">

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
                />

              </div>


              {/* Selling Price */}

              <div className="space-y-2">

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
                  required
                />

              </div>

            </div>


            {/* ================================================= */}
            {/* PROFIT SUMMARY */}
            {/* ================================================= */}

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-neutral-200
                bg-neutral-50
                p-6
              "
            >

              <div className="mb-5">

                <h3
                  className="
                    text-lg
                    font-medium
                  "
                >
                  Profit Summary
                </h3>


                <p
                  className="
                    mt-1
                    text-xs
                    text-neutral-500
                  "
                >
                  {hasMultipleSizes
                    ? "Calculated from each variant's pricing. Every variant is counted as 1 stock unit."
                    : hasVariants
                    ? "Product pricing is applied to each color. Every color is counted as 1 stock unit."
                    : "Product pricing is counted as 1 stock unit."
                  }
                </p>

              </div>


              <div
                className="
                  space-y-4
                  text-sm
                "
              >

                {/* Product Cost */}

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span>
                    Product Cost Price (CNY)
                  </span>


                  <span className="font-medium">
                    ¥{" "}
                    {costPriceCny.toFixed(
                      2
                    )}
                  </span>

                </div>


                {/* Exchange Rate */}

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span>
                    Exchange Rate
                  </span>


                  <span className="font-medium">
                    {exchangeRate.toFixed(
                      2
                    )}
                  </span>

                </div>


                {/* Estimated Cost */}

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span>
                    Estimated Cost (MYR)
                  </span>


                  <span className="font-medium">
                    RM{" "}
                    {estimatedCostMyr.toFixed(
                      2
                    )}
                  </span>

                </div>


                {/* Stock Units */}

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span>
                    Stock Units
                  </span>


                  <span className="font-medium">
                    {
                      hasVariants
                        ? activeVariants.length
                        : 1
                    }
                  </span>

                </div>


                {/* Potential Revenue */}

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span>
                    Potential Revenue
                  </span>


                  <span className="font-medium">
                    RM{" "}
                    {potentialRevenue.toFixed(
                      2
                    )}
                  </span>

                </div>


                <hr />


                {/* Estimated Profit */}

                <div
                  className="
                    flex
                    justify-between
                    text-base
                    font-semibold
                  "
                >

                  <span>
                    Estimated Profit
                  </span>


                  <span
                    className={
                      estimatedProfit >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    RM{" "}
                    {estimatedProfit.toFixed(
                      2
                    )}
                  </span>

                </div>


                {/* Margin */}

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span>
                    Estimated Margin
                  </span>


                  <span
                    className={
                      estimatedMargin >= 40
                        ? "font-semibold text-green-600"
                        : estimatedMargin >= 20
                        ? "font-semibold text-yellow-600"
                        : "font-semibold text-red-600"
                    }
                  >
                    {estimatedMargin.toFixed(
                      1
                    )}
                    %
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* PRODUCT DETAILS */}
          {/* ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >

            <div className="mb-6">

              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                "
              >
                Product Details
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                "
              >
                Physical specifications and description.
              </p>

            </div>


            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >

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

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
                  Availability
                </label>


<select
  name="availability"
  defaultValue={
    product?.availability ??
    "IN_STOCK"
  }
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
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


              {/* Packaging */}

              <div
                className="
                  space-y-2
                  md:col-span-2
                "
              >

                <div>

                  <label
                    htmlFor="customPackagingId"
                    className="
                      mb-1
                      block
                      text-sm
                      font-semibold
                      text-neutral-700
                    "
                  >
                    Packaging
                  </label>


                  <p
                    className="
                      mb-3
                      text-xs
                      leading-5
                      text-neutral-500
                    "
                  >
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
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


                <p
                  className="
                    text-xs
                    text-neutral-400
                  "
                >
                  Select a packaging profile only when
                  this product needs a custom packaging
                  override.
                </p>

              </div>


              {/* Dimensions */}

              <div className="space-y-2">

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
                  Dimensions
                </label>


                <input
                  name="dimensions"
                  placeholder="L 22 × H 13 × W 9.5 cm"
                  defaultValue={
                    product?.dimensions ??
                    ""
                  }
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
                />

              </div>


              {/* Primary Color */}

              <div className="space-y-2">

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-semibold
                    text-neutral-700
                  "
                >
                  Primary Color
                </label>


                <input
                  name="mainColor"
                  placeholder="Primary Color"
                  defaultValue={
                    product?.mainColor ??
                    ""
                  }
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
                    focus:ring-2
                    focus:ring-black/5
                    focus:outline-none
                  "
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

              <label
                className="
                  mb-1
                  block
                  text-sm
                  font-semibold
                  text-neutral-700
                "
              >
                Description
              </label>


              <textarea
                name="description"
                placeholder="Description"
                defaultValue={
                  product?.description
                }
                className="
                  h-40
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
                  focus:ring-2
                  focus:ring-black/5
                  focus:outline-none
                "
                required
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* VARIANTS */}
          {/* ================================================= */}

<VariantManager
  variants={variants}
  colors={colors}
  onChange={setVariants}
  defaultExchangeRate={exchangeRate}
  productPrice={sellingPrice}
/>

        </div>


        {/* ================================================= */}
        {/* RIGHT */}
        {/* ================================================= */}

        <div className="space-y-8">

          {/* ================================================= */}
          {/* MEDIA */}
          {/* ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >

            <div className="mb-6">

              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                "
              >
                Media
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                "
              >
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


          {/* ================================================= */}
          {/* PRODUCT INFORMATION */}
          {/* ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >

            <div className="mb-6">

              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                "
              >
                Product Information
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                "
              >
                Quick overview of this product.
              </p>

            </div>


            <div className="space-y-4 text-sm">

              <div
                className="
                  flex
                  justify-between
                "
              >

                <span>
                  Brand
                </span>

                <span className="font-medium">
                  {product?.brand ||
                    "-"}
                </span>

              </div>


              <div
                className="
                  flex
                  justify-between
                "
              >

                <span>
                  SKU
                </span>

                <span className="font-medium">
                  {product?.sku ||
                    "-"}
                </span>

              </div>


              <div
                className="
                  flex
                  justify-between
                "
              >

                <span>
                  Category
                </span>

                <span className="font-medium">
                  {product?.category ||
                    "-"}
                </span>

              </div>


              <div
                className="
                  flex
                  justify-between
                "
              >

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


          {/* ================================================= */}
          {/* PRODUCT TAGS */}
          {/* ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >

            <div className="mb-6">

              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                "
              >
                Product Tags
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                "
              >
                Highlight this product in different sections.
              </p>

            </div>


            <div
              className="
                grid
                gap-3
                sm:grid-cols-2
              "
            >

              <label
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={
                    product?.featured
                  }
                />

                Featured

              </label>


              <label
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <input
                  type="checkbox"
                  name="newArrival"
                  defaultChecked={
                    product?.newArrival
                  }
                />

                New Arrival

              </label>


              <label
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <input
                  type="checkbox"
                  name="bestSeller"
                  defaultChecked={
                    product?.bestSeller
                  }
                />

                Best Seller

              </label>


              <label
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <input
                  type="checkbox"
                  name="limited"
                  defaultChecked={
                    product?.limited
                  }
                />

                Limited Edition

              </label>


              <label
                className="
                  flex
                  items-center
                  gap-3
                "
              >

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


          {/* ================================================= */}
          {/* SAVE BUTTON */}
          {/* ================================================= */}

          <button
            type="submit"
            disabled={
              isPending
            }
            className="
              w-full
              rounded-xl
              bg-black
              px-6
              py-4
              text-base
              font-semibold
              text-white
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-neutral-800
              hover:shadow-lg
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
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