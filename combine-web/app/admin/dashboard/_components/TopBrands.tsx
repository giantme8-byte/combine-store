import { prisma } from "@/lib/prisma";

export default async function TopBrands() {
  const products = await prisma.product.findMany({
    select: {
      brand: true,
    },
  });

  const brands = Object.values(
    products.reduce(
      (acc, product) => {
        if (!acc[product.brand]) {
          acc[product.brand] = {
            name: product.brand,
            value: 0,
          };
        }

        acc[product.brand].value++;

        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          value: number;
        }
      >
    )
  )
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const max = brands[0]?.value ?? 1;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-medium">
        Top Brands
      </h2>

      <div className="space-y-5">
        {brands.map((brand) => (
          <div key={brand.name}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">
                {brand.name}
              </span>

              <span className="text-sm text-gray-500">
                {brand.value}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-black transition-all"
                style={{
                  width: `${(brand.value / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}