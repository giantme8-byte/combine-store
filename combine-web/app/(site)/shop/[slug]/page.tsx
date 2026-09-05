import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

import { prisma } from "@/lib/prisma";

import Breadcrumb from "@/components/Breadcrumb";
import ProductGallery from "@/components/ProductGallery";
import RelatedProducts from "@/components/RelatedProducts";
import RecentlyViewedTracker from "@/components/RecentlyViewedTracker";
import RecentlyViewed from "@/components/RecentlyViewed";

import ProductInfo from "@/components/product/ProductInfo";
import ProductMeta from "@/components/product/ProductMeta";
import ProductActions from "@/components/product/ProductActions";
import ProductAccordion from "@/components/product/ProductAccordion";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductOptions from "@/components/product/ProductOptions";

import ProductViewTracker from "@/components/analytics/ProductViewTracker";

/*
 * ============================================================
 * Cache
 * ============================================================
 *
 * Cache product pages for 5 minutes.
 */

export const revalidate = 300;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/*
 * ============================================================
 * Metadata
 * ============================================================
 */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },

    select: {
      brand: true,
      name: true,
      shortDescription: true,
      description: true,

      images: {
        select: {
          url: true,
        },

        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description =
    product.shortDescription ||
    product.description.slice(0, 160);

  return {
    title: `${product.brand} ${product.name}`,

    description,

    openGraph: {
      title: `${product.brand} ${product.name}`,

      description,

      images: product.images.length
        ? [
            {
              url: product.images[0].url,

              alt: product.name,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",

      title: `${product.brand} ${product.name}`,

      description,

      images: product.images.length
        ? [product.images[0].url]
        : [],
    },
  };
}

/*
 * ============================================================
 * Product Page
 * ============================================================
 */

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params;

  /*
   * ----------------------------------------------------------
   * Product
   * ----------------------------------------------------------
   */

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },

    select: {
      id: true,

      slug: true,

      // ======================================================
      // BASIC PRODUCT INFORMATION
      // ======================================================

      brand: true,

      name: true,

      model: true,

      sku: true,

      videoUrl: true,

      // ======================================================
      // PRICE
      // ======================================================

      price: true,

      // ======================================================
      // DESCRIPTION
      // ======================================================

      shortDescription: true,

      description: true,

      // ======================================================
      // CATEGORY
      // ======================================================

      category: true,

      subCategory: true,

      // ======================================================
      // PRODUCT INFORMATION
      // ======================================================

      mainColor: true,

      dimensions: true,

      // ======================================================
      // BADGES
      // ======================================================

      featured: true,

      newArrival: true,

      bestSeller: true,

      limited: true,

      onSale: true,

      /*
       * ------------------------------------------------------
       * Product-specific custom packaging.
       * ------------------------------------------------------
       */

      customPackaging: {
        select: {
          id: true,

          key: true,

          name: true,

          brand: true,

          title: true,

          description: true,

          active: true,

          images: {
            select: {
              id: true,

              url: true,

              altText: true,

              caption: true,
            },

            orderBy: {
              sortOrder: "asc",
            },
          },

          items: {
            select: {
              id: true,

              name: true,
            },

            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },

      /*
       * ------------------------------------------------------
       * Product Gallery
       * ------------------------------------------------------
       */

      images: {
        select: {
          url: true,
        },

        orderBy: {
          sortOrder: "asc",
        },
      },

      /*
       * ======================================================
       * Product Colors
       * ======================================================
       *
       * IMPORTANT:
       *
       * We now load the complete Color Gallery.
       *
       * Old:
       *
       * imageUrl
       *
       * New:
       *
       * images[]
       *
       */

      colors: {
        select: {
          id: true,

          name: true,

          imageUrl: true,

          model: true,

          images: {
            select: {
              id: true,

              url: true,

              publicId: true,

              sortOrder: true,
            },

            orderBy: {
              sortOrder: "asc",
            },
          },
        },

        orderBy: {
          sortOrder: "asc",
        },
      },

      /*
       * ======================================================
       * Product Variants
       * ======================================================
       *
       * Load the complete Variant Gallery.
       *
       * Each Variant can now have multiple images.
       *
       * Example:
       *
       * Small
       * ├── Cover
       * ├── Front
       * ├── Back
       * └── Interior
       *
       * Large
       * ├── Cover
       * ├── Front
       * ├── Back
       * └── Interior
       *
       */

      variants: {
        select: {
          id: true,

          /*
           * Global Color relation.
           *
           * Required by ProductOptions so the
           * customer-facing page can correctly
           * match:
           *
           * Color × Size = Variant
           */

          colorId: true,

          size: true,

          /*
           * Variant-specific price.
           *
           * If a variant has its own price,
           * ProductActions can use this price
           * after the variant is selected.
           */

          price: true,

          model: true,

          dimensions: true,

          /*
           * Legacy / fallback cover image.
           */

          imageUrl: true,

          /*
           * Complete Variant Gallery.
           */

          images: {
            select: {
              id: true,

              url: true,

              publicId: true,

              altText: true,

              caption: true,

              sortOrder: true,
            },

            orderBy: {
              sortOrder: "asc",
            },
          },
        },

        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  /*
   * ----------------------------------------------------------
   * Packaging
   * ----------------------------------------------------------
   *
   * Priority:
   *
   * 1. Product Custom Packaging
   * 2. Brand Packaging
   * 3. Default Packaging
   *
   * This means you only need to create one packaging
   * profile for each brand.
   */

  const packagingProfiles =
    await prisma.packagingProfile.findMany({
      where: {
        active: true,

        OR: [
          {
            brand: null,
          },

          {
            brand: product.brand,
          },
        ],
      },

      select: {
        id: true,

        key: true,

        name: true,

        brand: true,

        title: true,

        description: true,

        images: {
          select: {
            id: true,

            url: true,

            altText: true,

            caption: true,
          },

          orderBy: {
            sortOrder: "asc",
          },
        },

        items: {
          select: {
            id: true,

            name: true,
          },

          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

  /*
   * Brand packaging.
   */

  const brandPackaging =
    packagingProfiles.find(
      (packaging) =>
        packaging.brand === product.brand
    ) ?? null;

  /*
   * Default packaging.
   */

  const defaultPackaging =
    packagingProfiles.find(
      (packaging) =>
        packaging.brand === null
    ) ?? null;

  /*
   * Final packaging.
   *
   * Custom packaging has the highest priority.
   */

  const packaging =
    product.customPackaging?.active
      ? product.customPackaging
      : brandPackaging ?? defaultPackaging;

  /*
   * ----------------------------------------------------------
   * Gallery
   * ----------------------------------------------------------
   */

  const cover =
    product.images[0]?.url ??
    "/placeholder.png";

  const gallery = product.images
    .slice(1)
    .map((image) => image.url);

  return (
    <main
      className="
        mx-auto
        max-w-7xl
        px-5
        py-12
        sm:py-16
        lg:px-8
        lg:py-20
      "
    >
      {/* ===================================================== */}
      {/* Analytics - Product View */}
      {/* ===================================================== */}

      <ProductViewTracker
        productId={product.id}
      />

      {/* ===================================================== */}
      {/* Recently Viewed Tracker */}
      {/* ===================================================== */}

      <RecentlyViewedTracker
        slug={product.slug ?? ""}
      />

      {/* ===================================================== */}
      {/* Breadcrumb */}
      {/* ===================================================== */}

      <Breadcrumb
        items={[
          {
            label: "Home",

            href: "/",
          },

          {
            label: "Collection",

            href: "/shop",
          },

          {
            label: product.brand,
          },

          {
            label: product.name,
          },
        ]}
      />

      {/* ===================================================== */}
      {/* Product Detail */}
      {/* ===================================================== */}

      <ProductDetailClient
        colors={product.colors}
        variants={product.variants}
      >
        <section
          className="
            mt-6
            grid
            items-start
            gap-10
            sm:mt-8
            sm:gap-12
            lg:mt-12
            lg:grid-cols-[1.12fr_0.88fr]
            lg:gap-20
          "
        >
          {/* ================================================= */}
          {/* Gallery */}
          {/* ================================================= */}

          <ProductGallery
            cover={cover}
            gallery={gallery}
            colors={product.colors}
            name={product.name}
            videoUrl={product.videoUrl}
          />

          {/* ================================================= */}
          {/* Info */}
          {/* ================================================= */}

          <div
            className="
              flex
              flex-col
              self-start
              lg:sticky
              lg:top-24
            "
          >
            {/* Product Info */}

            <ProductInfo
              product={{
                brand: product.brand,

                name: product.name,

                shortDescription:
                  product.shortDescription,

                newArrival:
                  product.newArrival,

                featured:
                  product.featured,

                bestSeller:
                  product.bestSeller,

                limited:
                  product.limited,

                onSale:
                  product.onSale,
              }}
            />

            {/* Product Options */}

            <ProductOptions />

            {/* =================================================
                Product Actions
                ================================================= */}

            <ProductActions
              productId={product.id}
              slug={product.slug ?? ""}
              brand={product.brand}
              name={product.name}
              sku={product.sku}
              model={product.model}
              mainColor={product.mainColor}
              dimensions={product.dimensions}
              price={product.price}
              image={cover}
            />

            {/* Product Meta */}

            <ProductMeta
              sku={product.sku}
              model={product.model}
              category={product.category}
              subCategory={product.subCategory}
              mainColor={product.mainColor}
              dimensions={product.dimensions}
            />

            {/* Description */}

            <ProductAccordion
              description={product.description}
            />
          </div>
        </section>
      </ProductDetailClient>

      {/* ===================================================== */}
      {/* Packaging Details */}
      {/* ===================================================== */}

      {packaging && (
        <section
          className="
            mt-20
            border-t
            border-neutral-200
            pt-16
            sm:mt-24
            sm:pt-20
            lg:mt-28
            lg:pt-24
          "
        >
          {/* ================================================= */}
          {/* Header */}
          {/* ================================================= */}

          <div
            className="
              mx-auto
              max-w-3xl
              text-center
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.45em]
                text-neutral-400
                sm:text-xs
                sm:tracking-[0.55em]
              "
            >
              PACKAGING DETAILS
            </p>

            <h2
              className="
                mt-5
                text-3xl
                font-extralight
                leading-tight
                tracking-[-0.045em]
                text-neutral-900
                sm:text-4xl
                lg:text-5xl
              "
            >
              {packaging.title ??
                packaging.name}
            </h2>

            <div
              className="
                mx-auto
                mt-7
                h-px
                w-20
                bg-gradient-to-r
                from-transparent
                via-[#C8A96A]
                to-transparent
              "
            />

            {packaging.description && (
              <p
                className="
                  mx-auto
                  mt-7
                  max-w-2xl
                  text-[13px]
                  leading-7
                  text-neutral-500
                  sm:mt-8
                  sm:text-base
                  sm:leading-8
                "
              >
                {packaging.description}
              </p>
            )}
          </div>

          {/* ================================================= */}
          {/* Editorial Packaging Gallery */}
          {/* ================================================= */}

          {packaging.images.length > 0 && (
            <div
              className="
                mx-auto
                mt-10
                sm:mt-14
                lg:mt-16
              "
            >
              <div
                className={
                  packaging.images.length === 1
                    ? "flex justify-center"
                    : `
                        grid
                        grid-cols-2
                        gap-3
                        sm:gap-5
                        lg:grid-cols-4
                        lg:gap-6
                      `
                }
              >
                {packaging.images.map(
                  (image) => (
                    <div
                      key={image.id}
                      className={`
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        bg-neutral-100
                        sm:rounded-3xl
                        ${
                          packaging.images
                            .length === 1
                            ? "w-[82vw] max-w-[360px] sm:w-[360px] sm:max-w-[400px] lg:w-[400px] lg:max-w-[440px]"
                            : "w-full"
                        }
                      `}
                    >
                      <div
                        className="
                          relative
                          aspect-[2/3]
                          w-full
                        "
                      >
                        <Image
                          src={image.url}
                          alt={
                            image.altText ??
                            packaging.name
                          }
                          fill
                          sizes={
                            packaging.images
                              .length === 1
                              ? "(max-width: 640px) 82vw, 440px"
                              : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                          }
                          className="
                            object-contain
                            p-0
                            transition-transform
                            duration-500
                            group-hover:scale-[1.01]
                          "
                        />

                        {/* Caption */}

                        {image.caption && (
                          <div
                            className="
                              absolute
                              inset-x-0
                              bottom-0
                              bg-gradient-to-t
                              from-black/45
                              via-black/10
                              to-transparent
                              px-4
                              pb-4
                              pt-14
                              sm:px-5
                              sm:pb-5
                            "
                          >
                            <p
                              className="
                                text-[10px]
                                uppercase
                                tracking-[0.25em]
                                text-white/90
                                sm:text-xs
                              "
                            >
                              {image.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* Included Packaging */}
          {/* ================================================= */}

          {packaging.items.length > 0 && (
            <div
              className="
                mx-auto
                mt-14
                max-w-5xl
                sm:mt-18
                lg:mt-22
              "
            >
              {/* Section heading */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                  text-center
                "
              >
                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.4em]
                    text-neutral-400
                  "
                >
                  WHAT&apos;S INCLUDED
                </p>

                <h3
                  className="
                    mt-3
                    text-2xl
                    font-extralight
                    tracking-[-0.03em]
                    text-neutral-900
                    sm:text-3xl
                  "
                >
                  Included Packaging
                </h3>
              </div>

              {/* Items */}

              <div
                className="
                  mt-10
                  border-t
                  border-neutral-200
                "
              >
                {packaging.items.map(
                  (item, index) => (
                    <div
                      key={item.id}
                      className="
                        group
                        flex
                        items-center
                        gap-4
                        border-b
                        border-neutral-200
                        py-5
                        sm:gap-6
                        sm:py-6
                      "
                    >
                      {/* Number */}

                      <span
                        className="
                          w-8
                          shrink-0
                          text-[10px]
                          tracking-[0.15em]
                          text-neutral-400
                          sm:w-10
                          sm:text-xs
                        "
                      >
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      {/* Gold line */}

                      <span
                        className="
                          h-px
                          w-6
                          shrink-0
                          bg-[#C8A96A]
                          transition-all
                          duration-300
                          group-hover:w-10
                          sm:w-8
                        "
                      />

                      {/* Item */}

                      <span
                        className="
                          text-sm
                          font-light
                          tracking-[-0.01em]
                          text-neutral-800
                          transition-colors
                          duration-300
                          group-hover:text-black
                          sm:text-base
                        "
                      >
                        {item.name}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===================================================== */}
      {/* Related Products */}
      {/* ===================================================== */}

      <section
        className="
          mt-20
          sm:mt-24
          lg:mt-28
        "
      >
        <Suspense fallback={null}>
          <RelatedProducts
            currentId={product.id}
            category={product.category}
          />
        </Suspense>
      </section>

      {/* ===================================================== */}
      {/* Recently Viewed */}
      {/* ===================================================== */}

      <section
        className="
          mt-16
          border-t
          border-neutral-200
          pt-16
          sm:mt-20
          sm:pt-20
          lg:mt-24
          lg:pt-24
        "
      >
        <Suspense fallback={null}>
          <RecentlyViewed />
        </Suspense>
      </section>
    </main>
  );
}