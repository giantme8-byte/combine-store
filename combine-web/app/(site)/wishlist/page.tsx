import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import ProductCard from "@/components/ProductCard";


export default async function WishlistPage() {
  const user =
    await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  const wishlist =
    await prisma.wishlistItem.findMany({
      where: {
        userId: user.id,
      },

      select: {
        id: true,

        product: {
          select: {
            id: true,

            slug: true,

            brand: true,

            name: true,

            model: true,

            /*
             * Product price
             *
             * Required by ProductCard.
             */

            price: true,

            createdAt: true,

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
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });


  return (
    <main>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section
        className="
          relative
          isolate
          h-[55vh]
          overflow-hidden
          md:h-[65vh]
        "
      >

        <Image
          src="/about/hero-v2.png"
          alt="Wishlist"
          fill
          priority
          quality={100}
          className="
            object-cover
            scale-105
            animate-[heroZoom_18s_ease-in-out_infinite_alternate]
          "
        />


        <div
          className="
            absolute
            inset-0
            bg-black/45
          "
        />


        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/75
            via-black/35
            to-black/10
          "
        />


        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.18),transparent_40%)]
          "
        />


        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-40
            bg-gradient-to-t
            from-white
            to-transparent
          "
        />


        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-center
            text-white
          "
        >

          <div
            className="
              px-6
            "
          >

            <p
              className="
                text-xs
                uppercase
                tracking-[0.5em]
                text-white/70
              "
            >
              SAVED COLLECTION
            </p>


            <h1
              className="
                mt-8
                text-[54px]
                font-extralight
                leading-[0.92]
                tracking-[-0.06em]
                drop-shadow-2xl
                md:text-[100px]
              "
            >
              My Wishlist
            </h1>


            <p
              className="
                mx-auto
                mt-8
                max-w-2xl
                text-lg
                leading-8
                text-white/80
              "
            >
              Save your favourite pieces and revisit them anytime.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTENT
          ===================================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-6
          py-24
        "
      >

        {/* ===================================================
            HEADER
            =================================================== */}

        <div
          className="
            mb-16
            text-center
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.45em]
              text-neutral-400
            "
          >
            SAVED COLLECTION
          </p>


          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-4
            "
          >

            <h2
              className="
                text-5xl
                font-extralight
                tracking-[-0.04em]
                md:text-6xl
              "
            >
              Saved Collection
            </h2>


            <span
              className="
                rounded-full
                border
                border-neutral-300
                px-4
                py-1.5
                text-sm
                font-medium
                text-neutral-500
              "
            >
              {wishlist.length}
            </span>

          </div>


          <div
            className="
              mx-auto
              mt-8
              h-px
              w-24
              bg-gradient-to-r
              from-transparent
              via-neutral-300
              to-transparent
            "
          />


          <p
            className="
              mx-auto
              mt-8
              max-w-3xl
              text-lg
              leading-9
              text-neutral-500
            "
          >
            Your favourite pieces are stored here, making it easy to revisit
            and enquire whenever you&apos;re ready.
          </p>

        </div>


        {/* ===================================================
            EMPTY STATE
            =================================================== */}

        {wishlist.length === 0 ? (

          <div
            className="
              mx-auto
              flex
              max-w-3xl
              flex-col
              items-center
              rounded-[36px]
              border
              border-neutral-200
              bg-gradient-to-b
              from-white
              to-neutral-50
              px-12
              py-20
              text-center
              shadow-[0_30px_80px_rgba(0,0,0,.05)]
            "
          >

            <div
              className="
                flex
                h-28
                w-28
                items-center
                justify-center
                rounded-full
                bg-neutral-100
              "
            >

              <Heart
                size={60}
                strokeWidth={1}
                className="
                  text-neutral-400
                "
              />

            </div>


            <h2
              className="
                mt-10
                text-5xl
                font-extralight
                tracking-[-0.04em]
              "
            >
              Your Wishlist
              <br />
              is Waiting
            </h2>


            <p
              className="
                mt-8
                max-w-xl
                text-lg
                leading-9
                text-neutral-500
              "
            >
              Save your favourite handbags, watches and jewellery to revisit
              them anytime. Your curated collection will appear here.
            </p>


            <Link
              href="/shop"
              className="
                mt-12
                inline-flex
                rounded-full
                bg-black
                px-10
                py-4
                text-sm
                uppercase
                tracking-[0.3em]
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#C8A96A]
                hover:shadow-xl
              "
            >
              Browse Collection
            </Link>

          </div>

        ) : (

          /* =================================================
             PRODUCT GRID
             ================================================= */

          <div
            className="
              grid
              grid-cols-1
              gap-x-10
              gap-y-16
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
            "
          >

            {wishlist.map(
              (item) => (

                <ProductCard
                  key={
                    item.id
                  }

                  id={
                    item.product.id
                  }

                  slug={
                    item.product.slug ??
                    ""
                  }

                  brand={
                    item.product.brand
                  }

                  name={
                    item.product.name
                  }

                  model={
                    item.product.model
                  }

                  /*
                   * Product price
                   */

                  price={
                    item.product.price
                  }

                  image={
                    item.product.images[0]?.url ??
                    "/placeholder.png"
                  }

                  secondImage={
                    item.product.images[1]?.url
                  }

                  createdAt={
                    item.product.createdAt
                  }

                  featured={
                    item.product.featured
                  }

                  newArrival={
                    item.product.newArrival
                  }

                  bestSeller={
                    item.product.bestSeller
                  }

                  limited={
                    item.product.limited
                  }

                  onSale={
                    item.product.onSale
                  }
                />

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}