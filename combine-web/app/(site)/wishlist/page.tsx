import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import ProductCard from "@/components/ProductCard";

import Image from "next/image";

export default async function WishlistPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const wishlist = await prisma.wishlistItem.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: {
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

return (
  <main>

    {/* Hero */}
    <section className="relative h-[55vh] overflow-hidden">

      <Image
  src="/about/hero-v2.png"
  alt="Wishlist"
  fill
  priority
  className="object-cover"
/>

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 flex items-center justify-center text-center text-white">

        <div className="px-6">

          <p className="text-xs uppercase tracking-[0.5em] text-white/70">
            COMBINE
          </p>

          <h1 className="mt-6 text-6xl font-extralight tracking-[-0.04em] md:text-8xl">
            My Wishlist
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80">
            Save your favourite pieces and revisit them anytime.
          </p>

        </div>

      </div>

    </section>

    <section className="mx-auto max-w-7xl px-6 py-24">

      <div className="mb-16 text-center">
<p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
  SAVED COLLECTION
</p>

<h2 className="mt-5 text-5xl font-extralight tracking-[-0.03em]">
  {wishlist.length} Saved Item{wishlist.length === 1 ? "" : "s"}
</h2>

<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
  Your favourite pieces are stored here, making it easy to revisit and
  enquire whenever you&apos;re ready.
</p>
      </div>

{wishlist.length === 0 ? (
  <div className="flex flex-col items-center py-32 text-center">

    <div className="text-7xl">🤍</div>

    <h2 className="mt-10 text-5xl font-extralight tracking-[-0.03em]">
      Your Wishlist
      <br />
      is Empty
    </h2>

    <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-500">
      Save your favourite handbags, watches and jewellery to revisit
      them anytime. Your curated collection will appear here.
    </p>

    <Link
      href="/shop"
      className="mt-12 inline-flex rounded-full bg-black px-10 py-4 text-sm uppercase tracking-[0.3em] text-white transition-all duration-300 hover:scale-105 hover:bg-neutral-800"
    >
      Browse Collection
    </Link>

  </div>
):(
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((item) => (
<ProductCard
  key={item.id}
  id={item.product.id}
  slug={item.product.slug ?? ""}
  brand={item.product.brand}
  name={item.product.name}
  model={item.product.model}
  image={item.product.images[0]?.url ?? "/placeholder.png"}
  featured={item.product.featured}
  newArrival={item.product.newArrival}
  bestSeller={item.product.bestSeller}
  limited={item.product.limited}
  onSale={item.product.onSale}
/>
          ))}
        </div>
      )}
    </section>

  </main>
  );
}