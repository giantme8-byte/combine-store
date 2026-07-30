import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getWhatsAppLink } from "@/lib/whatsapp";

import Breadcrumb from "@/components/Breadcrumb";
import ProductGallery from "@/components/ProductGallery";
import RelatedProducts from "@/components/RelatedProducts";
import RecentlyViewedTracker from "@/components/RecentlyViewedTracker";
import RecentlyViewed from "@/components/RecentlyViewed";

import ProductInfo from "@/components/product/ProductInfo";
import ProductMeta from "@/components/product/ProductMeta";
import ProductActions from "@/components/product/ProductActions";
import ProductAccordion from "@/components/product/ProductAccordion";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

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

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      slug: true,

      brand: true,
      name: true,
      model: true,
      sku: true,

      shortDescription: true,
      description: true,

      category: true,
      subCategory: true,

      mainColor: true,
      dimensions: true,

      featured: true,
      newArrival: true,
      bestSeller: true,
      limited: true,
      onSale: true,

      images: {
        select: {
          url: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },

colors: {
  select: {
    id: true,
    name: true,
    imageUrl: true,
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

  const cover =
    product.images[0]?.url ?? "/placeholder.png";

  const gallery = product.images
    .slice(1)
    .map((image) => image.url);

  const whatsappMessage = `Hi COMBINE 👋

I'm interested in this item.

Brand:
${product.brand}

Reference:
${product.sku ?? "-"}

Product:
${product.name}

Model:
${product.model ?? "-"}

Item ID:
#${product.id}

Please provide the latest price and availability.

Thank you.`;

  const whatsappLink = await getWhatsAppLink(
    whatsappMessage,
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <RecentlyViewedTracker
        slug={product.slug ?? ""}
      />

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

      {/* Product Detail */}
      <section className="mt-12 grid items-start gap-20 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Gallery */}
        <ProductGallery
          cover={cover}
          gallery={gallery}
          colors={product.colors}
          name={product.name}
        />

        {/* Info */}
        <div className="sticky top-28 self-start flex flex-col">
          <ProductInfo
            product={{
              brand: product.brand,
              name: product.name,
              shortDescription:
                product.shortDescription,
              newArrival: product.newArrival,
              featured: product.featured,
              bestSeller: product.bestSeller,
              limited: product.limited,
              onSale: product.onSale,
            }}
          />

          <ProductMeta
            sku={product.sku}
            model={product.model}
            category={product.category}
            subCategory={product.subCategory}
            mainColor={product.mainColor}
            dimensions={product.dimensions}
          />

          <ProductActions
            productId={product.id}
            whatsappLink={whatsappLink}
          />

          <ProductAccordion
            description={product.description}
          />
        </div>
      </section>

      {/* Related */}
      <section className="mt-40">
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
            YOU MAY ALSO LIKE
          </p>

          <h2 className="mt-5 text-5xl font-extralight tracking-[-0.03em]">
            Related Products
          </h2>
        </div>

        <RelatedProducts
          currentId={product.id}
          category={product.category}
        />
      </section>

      <RecentlyViewed />
    </main>
  );
}