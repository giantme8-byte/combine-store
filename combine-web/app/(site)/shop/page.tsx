import ShopProducts from "@/components/ShopProducts";

export const revalidate = 300;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    brand?: string;
  }>;
}) {
  const { brand } = await searchParams;

  return (
    <main className="mx-auto max-w-[1440px] px-8 pb-32 pt-36 lg:px-12">
      {/* Header */}
      <div className="mx-auto mb-24 max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">
          COMBINE
        </p>

        <h1 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-7xl">
          {brand ?? "Shop"}
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-500">
          Discover our curated collection of luxury handbags, fine
          timepieces, jewellery and refined accessories, crafted for
          timeless elegance.
        </p>
      </div>

      <ShopProducts brand={brand} />
    </main>
  );
}