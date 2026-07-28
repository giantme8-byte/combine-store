import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">

      <div className="mb-16 text-center">

        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-neutral-500">
          COMBINE
        </p>

        <h1 className="text-5xl font-light">
          Luxury Brands
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-neutral-500">
          Discover our curated collection of the world&apos;s most
          iconic luxury fashion houses and watchmakers.
        </p>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group rounded-2xl border border-neutral-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
          >
            <div className="flex h-full flex-col justify-between">

              <div>

                <h2 className="text-2xl font-light transition group-hover:text-black">
                  {brand.name}
                </h2>

                <p className="mt-3 text-sm text-neutral-500">
                  Explore Collection
                </p>

              </div>

              <div className="mt-10 flex justify-end text-xl transition group-hover:translate-x-1">
                →
              </div>

            </div>
          </Link>
        ))}

      </div>

    </main>
  );
}