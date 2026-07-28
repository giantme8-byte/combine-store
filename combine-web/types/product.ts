export type ProductAvailability =
  | "PRE_ORDER"
  | "READY_STOCK";

export interface ProductImage {
  id: number;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface ProductColor {
  id: number;
  name: string;
  hexCode: string | null;
}

export interface Product {
  id: number;

  sku: string | null;

  brand: string;
  category: string;
  subCategory: string | null;

  name: string;
  slug: string | null;
  model: string | null;

  shortDescription: string | null;
  description: string;

  costPriceCny: number | null;
  priceRemark: string | null;
  price: number;

  mainColor: string | null;
  dimensions: string | null;

  availability: ProductAvailability;

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  limited: boolean;
  onSale: boolean;

  createdAt: Date;
  updatedAt: Date;

  images: ProductImage[];
  colors: ProductColor[];
}

/**
 * Product Card
 */
export type ProductCardProps = Pick<
  Product,
  | "id"
  | "slug"
  | "brand"
  | "name"
  | "model"
  | "featured"
  | "newArrival"
  | "bestSeller"
  | "limited"
  | "onSale"
> & {
  image: string;
};

/**
 * Search Autocomplete
 */
export type ProductSearchResult = Pick<
  Product,
  | "id"
  | "slug"
  | "brand"
  | "name"
  | "model"
> & {
  images: ProductImage[];
};

/**
 * Lightweight Product
 */
export type ProductSummary = Pick<
  Product,
  | "id"
  | "slug"
  | "brand"
  | "name"
  | "model"
>;

/**
 * Product with Relations
 */
export interface ProductWithRelations extends Product {
  images: ProductImage[];
  colors: ProductColor[];
}

/**
 * Inquiry Item
 */
export interface InquiryItem {
  productId: number;
  quantity: number;
}