import ShopHeader from "@/components/ShopHeader";
import ShopProducts from "@/components/ShopProducts";

export const revalidate = 300;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    brand?: string;
    category?: string;
  }>;
}) {
  const {
    brand,
    category,
  } = await searchParams;

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-b
        from-white
        via-[#fafafa]
        to-white
      "
    >
      <div
        className="
          mx-auto
          max-w-[1440px]
          px-6
          pb-32
          pt-32
          lg:px-12
          xl:px-14
        "
      >
        {!category && (
          <ShopHeader />
        )}

        <div className="mt-16">
          <ShopProducts
            brand={brand}
            category={category}
          />
        </div>
      </div>
    </main>
  );
}