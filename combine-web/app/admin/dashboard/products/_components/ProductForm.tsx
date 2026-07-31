"use client";

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
import ColorUpload from "./ColorUpload"
import type { ProductVariantItem } from "@/types";
import VariantManager from "./VariantManager";

import type {
  Brand,
  Category,
  Product,
  ProductImage,
  ProductColor,
  ProductVariant,
} from "@prisma/client";


type ProductWithRelations = Product & {
  images: ProductImage[];
  colors: ProductColor[];
  variants: ProductVariant[];
};

type ProductFormProps = {
  action: (
    formData: FormData
  ) => void | Promise<void>;

  product?: ProductWithRelations;

  submitText: string;

  categories: Category[];

  brands: Brand[];

  exchangeRate: number;
};


export default function ProductForm({
  action,
  product,
  submitText,
  categories,
  brands,
  exchangeRate,
}: ProductFormProps) {

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

const [costPriceCny, setCostPriceCny] =
  useState<number>(
    product?.costPriceCny ?? 0
  );

const [sellingPrice, setSellingPrice] =
  useState<number>(
    product?.price ?? 0
  );

  const [slug, setSlug] = useState(
  product?.slug ?? ""
);

const slugEdited = useRef(false);

useEffect(() => {
  if (!product) return;

setImages(
  product.images.map((image) => ({
    id: image.id.toString(),
    url: image.url,
    publicId: image.publicId,
    isNew: false,
    sortOrder: image.sortOrder,
    deleted: false,
  }))
);

setColors(
  product.colors.map((color) => ({
    id: color.id.toString(),

    name: color.name,
    model: color.model ?? "",

    url: color.imageUrl,
    publicId: color.publicId,

    isNew: false,
    sortOrder: color.sortOrder,
    deleted: false,
  }))
);

setVariants(
  product.variants.map((variant) => ({
    id: variant.id.toString(),

    size: variant.size,

    model: variant.model ?? "",

    dimensions: variant.dimensions ?? "",

    imageUrl: variant.imageUrl ?? "",

    publicId: variant.publicId ?? "",

    isNew: false,

    deleted: false,
  }))
);

setCostPriceCny(
  product.costPriceCny ?? 0
);

setSellingPrice(
  product.price ?? 0
);

setSlug(product?.slug ?? "");
slugEdited.current = false;

}, [product]);

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {

  e.preventDefault();

  if (!formRef.current) return;

  if (isPending) return;

  const formData = new FormData(
    formRef.current
  );

const MAX_IMAGES = 20;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const newImages = images.filter((image) => image.file);

if (newImages.length > MAX_IMAGES) {
  alert("Maximum 20 images.");
  return;
}

for (const image of newImages) {
  if (image.file!.size > MAX_SIZE) {
    alert(`${image.file!.name} exceeds 10MB.`);
    return;
  }
}

images.forEach((image, index) => {
  formData.append(
    "imageOrder",
    JSON.stringify({
      id: image.id,
      publicId: image.publicId,
      sortOrder: index,
      isNew: image.isNew,
      deleted: image.deleted ?? false,
    })
  );

  if (image.file) {
    formData.append("images", image.file);
  }
});

colors.forEach((color, index) => {
  formData.append(
    "colorOrder",
    JSON.stringify({
      id: color.id,

      name: color.name,
      model: color.model,

      publicId: color.publicId,

      sortOrder: index,

      isNew: color.isNew,
      deleted: color.deleted ?? false,

      hasNewImage: !!color.file,
    })
  );

  if (color.file) {
    formData.append(
      "colorImages",
      color.file
    );
  }
});

variants.forEach((variant, index) => {
  formData.append(
    "variantOrder",
    JSON.stringify({
      id: variant.id,

      size: variant.size,

      model: variant.model,

      dimensions: variant.dimensions,

      imageUrl: variant.imageUrl ?? "",

      publicId: variant.publicId ?? "",

      sortOrder: index,

      isNew: variant.isNew,

      deleted: variant.deleted,

      hasNewImage: !!variant.file,
    })
  );


  if (variant.file) {
    formData.append(
      "variantImages",
      variant.file
    );
  }
});


startTransition(async () => {
  await action(formData);
});

}

console.log(product?.colors);

return (
    <form
      ref={formRef}
      id="product-form"
      onSubmit={handleSubmit}
    >

      <div className="grid gap-8 xl:grid-cols-[2fr_380px]">

{/* LEFT */}
<div className="space-y-8">

          {/* General */}
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
      defaultValue={product?.brand || ""}
      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
      required
    >
      <option value="">
        Select Brand
      </option>

      {brands.map((brand) => (
        <option
          key={brand.id}
          value={brand.name}
        >
          {brand.name}
        </option>
      ))}
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
      defaultValue={product?.sku ?? ""}
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
    defaultValue={product?.name}
    onChange={(e) => {
      if (!slugEdited.current) {
        setSlug(slugify(e.target.value));
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
  value={slug}
    onChange={(e) => {
      slugEdited.current = true;
      setSlug(slugify(e.target.value));
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
    defaultValue={product?.model ?? ""}
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
                defaultValue={product?.shortDescription ?? ""}
                className="h-20 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
              />
            </div>

          </div>

{/* Pricing */}
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
      defaultValue={product?.priceRemark ?? ""}
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
  value={costPriceCny}
  onChange={(e) =>
    setCostPriceCny(Number(e.target.value))
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
  value={sellingPrice}
  onChange={(e) =>
    setSellingPrice(Number(e.target.value))
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
      <span>Cost Price (CNY)</span>

      <span className="font-medium">
        ¥ {product?.costPriceCny?.toFixed(2) ?? "0.00"}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Exchange Rate</span>

      <span className="font-medium">
        {exchangeRate.toFixed(2)}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Estimated Cost (MYR)</span>

      <span className="font-medium">
        RM {(costPriceCny * exchangeRate).toFixed(2)}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Selling Price</span>

      <span className="font-medium">
        RM {sellingPrice.toFixed(2)}
      </span>
    </div>

    <hr />

    <div className="flex justify-between text-base font-semibold">
      <span>Estimated Profit</span>

      <span className="text-green-600">
RM {(
  sellingPrice -
  (costPriceCny * exchangeRate)
).toFixed(2)}
      </span>

        </div>

    </div>

  </div>

</div>

{/* Product Details */}
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

{/* Category & Sub Category */}
<CategorySelect
  categories={categories}
  product={product}
/>

{/* Availability */}
<div className="space-y-2">
  <label className="mb-1 block text-sm font-semibold text-neutral-700">
    Availability
  </label>

  <select
    name="availability"
    defaultValue={product?.availability ?? "PRE_ORDER"}
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

    {/* Dimensions */}
    <div className="space-y-2">
      <label className="mb-1 block text-sm font-semibold text-neutral-700">
        Dimensions
      </label>

      <input
        name="dimensions"
        placeholder="L 22 × H 13 × W 9.5 cm"
        defaultValue={product?.dimensions ?? ""}
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
    defaultValue={product?.mainColor ?? ""}
    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
  />
</div>

<ColorUpload
  colors={colors}
  onChange={setColors}
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
      defaultValue={product?.description}
      className="h-40 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
      required
    />
  </div>

</div> {/* Product Details */}

{/* Variants */}
<VariantManager
  variants={variants}
  onChange={setVariants}
/>

</div> {/* LEFT */}

{/* RIGHT */}
<div className="space-y-8">

          {/* Media */}
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
  images={images}
  onChange={setImages}
/>

          </div>

          {/* Product Information */}
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
      <span>Brand</span>
      <span className="font-medium">
        {product?.brand || "-"}
      </span>
    </div>

    <div className="flex justify-between">
      <span>SKU</span>
      <span className="font-medium">
        {product?.sku || "-"}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Category</span>
      <span className="font-medium">
        {product?.category || "-"}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Created</span>
      <span className="font-medium">
        {product
          ? new Date(product.createdAt).toLocaleDateString()
          : "-"}
      </span>
    </div>

  </div>

</div>

          {/* Product Tags */}
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
                  defaultChecked={product?.featured}
                />
                Featured
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="newArrival"
                  defaultChecked={product?.newArrival}
                />
                New Arrival
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="bestSeller"
                  defaultChecked={product?.bestSeller}
                />
                Best Seller
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="limited"
                  defaultChecked={product?.limited}
                />
                Limited Edition
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="onSale"
                  defaultChecked={product?.onSale}
                />
                Sale
              </label>

            </div>

          </div>

{/* Save Button */}
<button
  type="submit"
  disabled={isPending}
  className="w-full rounded-xl bg-black px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
>
  {isPending ? "Saving Product..." : submitText}
</button>

        </div>

      </div>

    </form>
  );
}