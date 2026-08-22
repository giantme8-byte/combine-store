import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";


function getRelativeDate(date: Date) {
  const now = new Date();

  const diff =
    now.getTime() - date.getTime();

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString();
}


function getAvailabilityLabel(
  availability: string
) {
  switch (availability) {
    case "IN_STOCK":
      return "In Stock";

    case "PRE_ORDER":
      return "Pre-order";

    case "LIMITED":
      return "Limited";

    default:
      return "Sold Out";
  }
}


function getAvailabilityVariant(
  availability: string
) {
  switch (availability) {
    case "IN_STOCK":
      return "success";

    case "PRE_ORDER":
      return "warning";

    case "LIMITED":
      return "info";

    default:
      return "danger";
  }
}


export default async function RecentProducts() {

  const products =
    await prisma.product.findMany({

      take: 5,

      orderBy: {
        createdAt: "desc",
      },

      select: {

        id: true,

        name: true,

        brand: true,

        price: true,

        featured: true,

        newArrival: true,

        bestSeller: true,

        onSale: true,

        limited: true,

        availability: true,

        createdAt: true,

        images: {

          orderBy: {
            sortOrder: "asc",
          },

          select: {
            url: true,
          },

        },

      },

    });


  return (

    <div
      className="
        min-w-0
        overflow-hidden
        rounded-3xl
        border
        border-neutral-200
        bg-white
        p-4
        shadow-sm

        sm:p-6
        lg:p-8
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        className="
          mb-5
          flex
          min-w-0
          items-center
          justify-between
          gap-3

          sm:mb-6
          sm:gap-4

          lg:mb-8
        "
      >

        <div className="min-w-0">

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-neutral-400

              sm:text-xs
            "
          >
            Products
          </p>


          <h2
            className="
              mt-1.5
              truncate
              text-xl
              font-light
              text-neutral-900

              sm:mt-2
              sm:text-2xl
            "
          >
            Recently Added
          </h2>

        </div>


        <Link
          href="/admin/dashboard/products"
          className="
            flex
            shrink-0
            items-center
            gap-1.5
            rounded-xl
            border
            border-neutral-200
            px-3
            py-2
            text-xs
            text-neutral-700
            transition
            hover:bg-neutral-100

            sm:gap-2
            sm:px-4
            sm:py-2
            sm:text-sm
          "
        >

          <span className="hidden sm:inline">
            View All
          </span>

          <span className="sm:hidden">
            View
          </span>

          <ArrowRight size={15} />

        </Link>

      </div>


      {/* ================================================== */}
      {/* EMPTY STATE */}
      {/* ================================================== */}

      {products.length === 0 ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-neutral-300
            py-12
            text-center

            sm:py-16
          "
        >

          <p
            className="
              text-sm
              text-neutral-500
            "
          >
            No products found.
          </p>

        </div>

      ) : (

        <div
          className="
            min-w-0
            space-y-3
          "
        >

          {products.map(
            (product) => (

              <Link
                key={product.id}
                href={`/admin/dashboard/products/${product.id}`}
                className="
                  block
                  min-w-0
                  overflow-hidden
                  rounded-2xl
                  border
                  border-neutral-200
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-neutral-50
                  hover:shadow-sm
                "
              >

                {/* ================================================== */}
                {/* MOBILE PRODUCT */}
                {/* ================================================== */}

                <div
                  className="
                    flex
                    min-w-0
                    flex-col
                    gap-3
                    p-3

                    sm:hidden
                  "
                >

                  {/* Product Main Info */}

                  <div
                    className="
                      flex
                      min-w-0
                      items-start
                      gap-3
                    "
                  >

                    {/* Image */}

                    {product.images.length > 0 ? (

                      <Image
                        src={
                          product.images[0].url
                        }
                        alt={
                          product.name
                        }
                        width={64}
                        height={64}
                        className="
                          h-16
                          w-16
                          shrink-0
                          rounded-xl
                          border
                          border-neutral-200
                          bg-white
                          object-contain
                          p-1.5
                        "
                      />

                    ) : (

                      <div
                        className="
                          flex
                          h-16
                          w-16
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-neutral-200
                          bg-neutral-100
                          text-[10px]
                          text-neutral-500
                        "
                      >
                        No Image
                      </div>

                    )}


                    {/* Info */}

                    <div
                      className="
                        min-w-0
                        flex-1
                        overflow-hidden
                      "
                    >

                      <p
                        className="
                          truncate
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.2em]
                          text-neutral-400
                        "
                      >
                        {product.brand}
                      </p>


                      <h3
                        className="
                          mt-1
                          line-clamp-2
                          break-words
                          text-sm
                          font-medium
                          leading-5
                          text-neutral-900
                        "
                      >
                        {product.name}
                      </h3>


                      {/* Badges */}

                      <div
                        className="
                          mt-2
                          flex
                          min-w-0
                          flex-wrap
                          gap-1.5
                        "
                      >

                        {product.featured && (
                          <Badge
                            variant="default"
                          >
                            Featured
                          </Badge>
                        )}


                        {product.newArrival && (
                          <Badge
                            variant="info"
                          >
                            New
                          </Badge>
                        )}


                        {product.bestSeller && (
                          <Badge
                            variant="success"
                          >
                            Best Seller
                          </Badge>
                        )}


                        {product.onSale && (
                          <Badge
                            variant="danger"
                          >
                            Sale
                          </Badge>
                        )}


                        {product.limited && (
                          <Badge
                            variant="warning"
                          >
                            Limited
                          </Badge>
                        )}

                      </div>


                      <p
                        className="
                          mt-2
                          text-[11px]
                          text-neutral-400
                        "
                      >
                        Added{" "}
                        {getRelativeDate(
                          product.createdAt
                        )}
                      </p>

                    </div>

                  </div>


                  {/* ================================================== */}
                  {/* MOBILE PRICE */}
                  {/* ================================================== */}

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      justify-between
                      gap-3
                      border-t
                      border-neutral-100
                      pt-3
                    "
                  >

                    <div className="min-w-0">

                      <p
                        className="
                          whitespace-nowrap
                          text-base
                          font-light
                          tracking-tight
                          text-neutral-900
                        "
                      >
                        RM{" "}
                        {product.price.toFixed(2)}
                      </p>

                    </div>


                    <div
                      className="
                        shrink-0
                      "
                    >

                      <Badge
                        variant={
                          getAvailabilityVariant(
                            product.availability
                          )
                        }
                      >
                        {
                          getAvailabilityLabel(
                            product.availability
                          )
                        }
                      </Badge>

                    </div>

                  </div>

                </div>


                {/* ================================================== */}
                {/* DESKTOP PRODUCT */}
                {/* ================================================== */}

                <div
                  className="
                    hidden
                    min-w-0
                    items-center
                    gap-5
                    p-4

                    sm:flex
                  "
                >

                  {/* Image */}

                  {product.images.length > 0 ? (

                    <Image
                      src={
                        product.images[0].url
                      }
                      alt={
                        product.name
                      }
                      width={72}
                      height={72}
                      className="
                        h-[72px]
                        w-[72px]
                        shrink-0
                        rounded-xl
                        border
                        border-neutral-200
                        bg-white
                        object-contain
                        p-2
                      "
                    />

                  ) : (

                    <div
                      className="
                        flex
                        h-[72px]
                        w-[72px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-neutral-200
                        bg-neutral-100
                        text-xs
                        text-neutral-500
                      "
                    >
                      No Image
                    </div>

                  )}


                  {/* Info */}

                  <div
                    className="
                      min-w-0
                      flex-1
                      overflow-hidden
                    "
                  >

                    <p
                      className="
                        truncate
                        text-xs
                        uppercase
                        tracking-[0.22em]
                        text-neutral-400
                      "
                    >
                      {product.brand}
                    </p>


                    <h3
                      className="
                        mt-1
                        truncate
                        text-lg
                        font-medium
                        text-neutral-900
                      "
                    >
                      {product.name}
                    </h3>


                    <div
                      className="
                        mt-3
                        flex
                        min-w-0
                        flex-wrap
                        gap-2
                      "
                    >

                      {product.featured && (
                        <Badge variant="default">
                          Featured
                        </Badge>
                      )}


                      {product.newArrival && (
                        <Badge variant="info">
                          New
                        </Badge>
                      )}


                      {product.bestSeller && (
                        <Badge variant="success">
                          Best Seller
                        </Badge>
                      )}


                      {product.onSale && (
                        <Badge variant="danger">
                          Sale
                        </Badge>
                      )}


                      {product.limited && (
                        <Badge variant="warning">
                          Limited
                        </Badge>
                      )}

                    </div>


                    <p
                      className="
                        mt-3
                        text-sm
                        text-neutral-500
                      "
                    >
                      Added{" "}
                      {getRelativeDate(
                        product.createdAt
                      )}
                    </p>

                  </div>


                  {/* Price */}

                  <div
                    className="
                      shrink-0
                      text-right
                    "
                  >

                    <p
                      className="
                        whitespace-nowrap
                        text-xl
                        font-light
                        tracking-tight
                        text-neutral-900
                      "
                    >
                      RM{" "}
                      {product.price.toFixed(2)}
                    </p>


                    <div className="mt-3">

                      <Badge
                        variant={
                          getAvailabilityVariant(
                            product.availability
                          )
                        }
                      >
                        {
                          getAvailabilityLabel(
                            product.availability
                          )
                        }
                      </Badge>

                    </div>

                  </div>

                </div>

              </Link>

            )
          )}

        </div>

      )}

    </div>

  );
}