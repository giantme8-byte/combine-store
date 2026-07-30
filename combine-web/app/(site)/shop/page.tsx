import ShopHeader from "@/components/ShopHeader";
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
      <ShopHeader />

      <ShopProducts brand={brand} />
    </main>
  );
}