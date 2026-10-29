"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";
import { getRecentlyViewed } from "@/lib/recentlyViewed";

type Product = {
  id: number;

  sku: string | null;

  brand: string;

  name: string;

  slug: string | null;

  model: string | null;

  price: number;

  createdAt: Date;

  featured: boolean;

  newArrival: boolean;

  bestSeller: boolean;

  limited: boolean;

  onSale: boolean;

  images: {
    url: string;
  }[];
};

type VoucherPrice = {
  price: number;

  discount: number;

  isNewCustomerVoucher: boolean;
};

export default function RecentlyViewed() {
  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    voucherPrices,
    setVoucherPrices,
  ] = useState<
    Record<
      number,
      VoucherPrice
    >
  >({});

  useEffect(() => {
    async function loadProducts() {
      const slugs =
        getRecentlyViewed();

      if (slugs.length === 0) {
        return;
      }

      const response =
        await fetch(
          `/api/recently-viewed?slugs=${encodeURIComponent(
            slugs.join(",")
          )}`
        );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setProducts(data);

      // =====================================================
      // CUSTOMER VOUCHER PRICES
      // =====================================================

      const productIds =
        data
          .map(
            (product: Product) =>
              product.id
          )
          .filter(
            (
              id: unknown
            ): id is number =>
              typeof id ===
              "number"
          );

      if (
        productIds.length ===
        0
      ) {
        return;
      }

      const voucherResponse =
        await fetch(
          "/api/shop/voucher-prices",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              productIds,
            }),
          }
        );

      if (
        !voucherResponse.ok
      ) {
        return;
      }

      const voucherData =
        await voucherResponse.json();

      setVoucherPrices(
        voucherData.prices ??
          {}
      );
    }

    loadProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="
        mt-24
        border-t
        border-neutral-200
        pt-20
        sm:mt-32
        sm:pt-24
        lg:mt-40
        lg:pt-28
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
          RECENTLY VIEWED
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
          Recently Viewed
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
          (product) => {
            const voucher =
              voucherPrices[
                product.id
              ];

            return (
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

                price={
                  product.price
                }

                customerPrice={
                  voucher?.price
                }

                customerDiscount={
                  voucher?.discount ??
                  0
                }

                isNewCustomerVoucher={
                  voucher?.isNewCustomerVoucher ??
                  false
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
            );
          }
        )}
      </div>
    </section>
  );
}