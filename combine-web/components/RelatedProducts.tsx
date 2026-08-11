import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";

type Props = {
  currentId: number;
  category: string;
};

export default async function RelatedProducts({
  currentId,
  category,
}: Props) {
  const products =
    await prisma.product.findMany({
      where: {
        category,

        NOT: {
          id: currentId,
        },
      },

      select: {
        id: true,
        slug: true,

        brand: true,
        name: true,
        model: true,

        createdAt: true,

        images: {
          orderBy: {
            sortOrder: "asc",
          },

          select: {
            url: true,
          },
        },

        featured: true,
        newArrival: true,
        bestSeller: true,
        limited: true,
        onSale: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 4,
    });

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="
        mt-24
        sm:mt-32
        lg:mt-40
      "
    >
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div
        className="
          mb-9
          text-center
          sm:mb-12
        "
      >
        <p
          className="
            text-[9px]
            uppercase
            tracking-[0.4em]
            text-neutral-400
            sm:text-xs
            sm:tracking-[0.45em]
          "
        >
          DISCOVER MORE
        </p>

        <h2
          className="
            mt-3
            text-3xl
            font-extralight
            leading-tight
            tracking-[-0.04em]
            text-neutral-900
            sm:mt-5
            sm:text-5xl
          "
        >
          You May Also Like
        </h2>

        <div
          className="
            mx-auto
            mt-5
            h-px
            w-14
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
            sm:mt-7
            sm:w-20
          "
        />
      </div>

      {/* ================================================= */}
      {/* Products */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          gap-x-3
          gap-y-8
          sm:gap-x-6
          sm:gap-y-12
          lg:grid-cols-4
          lg:gap-x-8
          lg:gap-y-12
        "
      >
        {products.map(
          (product) => (
            <ProductCard
              key={
                product.id
              }

              id={
                product.id
              }

              slug={
                product.slug ??
                ""
              }

              brand={
                product.brand
              }

              name={
                product.name
              }

              model={
                product.model
              }

              image={
                product.images[0]
                  ?.url ??
                "/placeholder.png"
              }

              secondImage={
                product.images[1]
                  ?.url
              }

              createdAt={
                product.createdAt
              }

              featured={
                product.featured
              }

              newArrival={
                product.newArrival
              }

              bestSeller={
                product.bestSeller
              }

              limited={
                product.limited
              }

              onSale={
                product.onSale
              }

              buttonSize="small"
            />
          )
        )}
      </div>
    </section>
  );
}