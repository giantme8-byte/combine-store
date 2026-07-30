"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  useInquiry,
} from "@/components/providers/InquiryProvider";

import { getWhatsAppLink } from "@/lib/whatsapp";

type ProductImage = {
  id: number;
  url: string;
};


type InquiryProduct = {
  id: number;
  sku: string | null;
  brand: string;
  name: string;
  model: string | null;
  images: ProductImage[];
};



export default function InquiryDrawer() {

  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    clearInquiry,
  } = useInquiry();



  const [
    products,
    setProducts,
  ] = useState<InquiryProduct[]>([]);



  const [
    loading,
    setLoading,
  ] = useState(false);



  async function handleWhatsAppInquiry() {

    const message = [
      "Hello COMBINE,",
      "",
      "I would like to inquire about these products:",
      "",
      ...items.map((item, index) => {

        const product = products.find(
          (product) =>
            product.id === item.productId
        );


        if (!product) {
          return "";
        }


        return `${index + 1}. ${product.brand} ${product.name}${
          product.model
            ? ` (${product.model})`
            : ""
        }
Quantity: ${item.quantity}`;

      }),

      "",
      "Thank you.",

    ]
      .filter(Boolean)
      .join("\n");



const url = await getWhatsAppLink(message);

window.open(
  url,
  "_blank"
);

  }

  useEffect(() => {

    async function loadProducts() {

      if (items.length === 0) {
        setProducts([]);
        return;
      }


      try {

        setLoading(true);


        const ids = items
          .map(
            (item) =>
              item.productId
          )
          .join(",");



        const response = await fetch(
          `/api/inquiry/products?ids=${ids}`
        );


        if (!response.ok) {
          throw new Error(
            "Failed to load inquiry products."
          );
        }


        const data =
          await response.json();


        setProducts(data);


      } catch (error) {

        console.error(error);


      } finally {

        setLoading(false);

      }

    }


    loadProducts();


  }, [items]);





  useEffect(() => {

    function handleKeyDown(
      event: KeyboardEvent
    ) {

      if (
        event.key === "Escape" &&
        isDrawerOpen
      ) {
        closeDrawer();
      }

    }


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );


  }, [
    isDrawerOpen,
    closeDrawer,
  ]);






  useEffect(() => {

    document.body.style.overflow =
      isDrawerOpen
        ? "hidden"
        : "";


    return () => {
      document.body.style.overflow = "";
    };


  }, [isDrawerOpen]);






  return (
    <>


      {/* Overlay */}

      <div
        onClick={closeDrawer}
        className={`
          fixed inset-0 z-40
          bg-black/30
          backdrop-blur-sm
          transition-opacity
          duration-300

          ${
            isDrawerOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />




      {/* Drawer */}

      <aside
        className={`
          fixed
          right-0
          top-0
          z-50
          flex
          h-screen
          w-full
          max-w-[430px]
          flex-col
          bg-white
          shadow-2xl
          transition-transform
          duration-300

          ${
            isDrawerOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >


        {/* Header */}

        <div className="
          flex
          items-center
          justify-between
          border-b
          border-neutral-200
          px-6
          py-5
        ">

          <div>

            <p className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-neutral-400
            ">
              COMBINE
            </p>


            <h2 className="
              mt-2
              text-2xl
              font-light
            ">
              Inquiry
            </h2>

          </div>



          <button
            type="button"
            onClick={closeDrawer}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              hover:bg-neutral-100
            "
          >
            ✕
          </button>


        </div>





        {/* Content */}

        <div className="
          flex-1
          overflow-y-auto
          px-6
          py-6
        ">


          {loading && (

            <p className="
              text-center
              text-sm
              text-neutral-400
            ">
              Loading...
            </p>

          )}





          {!loading &&
          items.length === 0 && (

            <div className="
              flex
              h-full
              items-center
              justify-center
              text-center
            ">

              <div>

                <p className="
                  text-lg
                  font-light
                ">
                  Your inquiry list is empty
                </p>


                <p className="
                  mt-3
                  text-sm
                  leading-7
                  text-neutral-500
                ">
                  Browse our collection and add products you like.
                </p>


              </div>

            </div>

          )}






          <div className="space-y-6">


            {items.map((item) => {


              const product =
                products.find(
                  (product) =>
                    product.id === item.productId
                );



              if (!product) {
                return null;
              }



              return (

                <div
                  key={item.productId}
                  className="
                    rounded-2xl
                    border
                    border-neutral-200
                    p-4
                  "
                >


                  <div className="
                    flex
                    gap-4
                  ">


                    <div className="
                      relative
                      h-24
                      w-24
                      overflow-hidden
                      rounded-xl
                      bg-neutral-100
                    ">

                      {product.images[0]?.url && (

                        <Image
                          src={
                            product.images[0].url
                          }
                          alt={
                            product.name
                          }
                          fill
                          sizes="96px"
                          className="
                            object-contain
                            p-2
                          "
                        />

                      )}

                    </div>




                    <div className="flex-1">


                      <p className="
                        text-xs
                        uppercase
                        tracking-[0.25em]
                        text-neutral-400
                      ">
                        {product.brand}
                      </p>



                      <h3 className="
                        mt-1
                        text-sm
                        font-medium
                      ">
                        {product.name}
                      </h3>



                      {product.model && (

                        <p className="
                          mt-1
                          text-xs
                          text-neutral-500
                        ">
                          {product.model}
                        </p>

                      )}



                      <div className="
                        mt-4
                        flex
                        items-center
                        gap-3
                      ">


                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          className="
                            h-7
                            w-7
                            rounded-full
                            border
                          "
                        >
                          −
                        </button>



                        <span className="text-sm">
                          {item.quantity}
                        </span>



                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          className="
                            h-7
                            w-7
                            rounded-full
                            border
                          "
                        >
                          +
                        </button>


                      </div>


                    </div>


                  </div>



                  <button
                    onClick={() =>
                      removeItem(
                        item.productId
                      )
                    }
                    className="
                      mt-4
                      text-xs
                      uppercase
                      tracking-[0.25em]
                      text-red-500
                    "
                  >
                    Remove
                  </button>



                </div>

              );


            })}


          </div>


        </div>





        {/* Footer */}

        {items.length > 0 && (

          <div className="
            border-t
            border-neutral-200
            p-6
          ">


            <button
              onClick={clearInquiry}
              className="
                mb-4
                w-full
                rounded-xl
                border
                border-neutral-300
                py-3
                text-xs
                uppercase
                tracking-[0.25em]
              "
            >
              Clear Inquiry
            </button>


<button
  type="button"
  onClick={handleWhatsAppInquiry}
  className="
    w-full
    rounded-xl
    bg-black
    py-4
    text-xs
    uppercase
    tracking-[0.25em]
    text-white
    transition
    hover:bg-neutral-800
  "
>
  WhatsApp Inquiry
</button>

          </div>

        )}



      </aside>


    </>
  );
}