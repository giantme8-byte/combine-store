"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { Availability } from "@prisma/client";

import type {
  ProductWithImages,
} from "@/types/product";

import ProductRow from "./ProductRow";
import SelectionToolbar from "./SelectionToolbar";

import {
  deleteProducts,
  updateProducts,
  updateProductDisplayOrder,
} from "../_actions/product.actions";


type ProductTableProps = {
  products: ProductWithImages[];

  exchangeRate: number;

  page: number;

  pageSize: number;

  brands: {
    id: number;
    name: string;
  }[];

  categories: {
    id: number;
    name: string;
  }[];

  canDelete: boolean;

  sort: string;

  search: string;

  brand: string;

  category: string;

  availability: string;
};


export default function ProductTable({
  products,
  exchangeRate,
  page,
  pageSize,
  brands,
  categories,
  canDelete,
  sort,

  search,
  brand,
  category,
  availability,
}: ProductTableProps) {

  const [
    selectedProducts,
    setSelectedProducts,
  ] = useState<number[]>([]);


  const [
    bulkAvailability,
    setBulkAvailability,
  ] = useState<Availability | "">("");


  const [
    bulkBrand,
    setBulkBrand,
  ] = useState("");


  const [
    bulkCategory,
    setBulkCategory,
  ] = useState("");


  const [
    featured,
    setFeatured,
  ] = useState("");


  const [
    newArrival,
    setNewArrival,
  ] = useState("");


  const [
    bestSeller,
    setBestSeller,
  ] = useState("");


  const [
    limited,
    setLimited,
  ] = useState("");


  const [
    onSale,
    setOnSale,
  ] = useState("");


  const router =
    useRouter();


  const [
    displayProducts,
    setDisplayProducts,
  ] = useState<ProductWithImages[]>(
    products
  );


  const [
    isSavingOrder,
    setIsSavingOrder,
  ] = useState(false);


  const isManualOrder =
    sort === "manual" ||
    sort === "featured";


  const sensors =
    useSensors(
      useSensor(
        PointerSensor,
        {
          activationConstraint: {
            distance: 8,
          },
        }
      )
    );


  useEffect(() => {

    setDisplayProducts(
      products
    );

  }, [
    products,
  ]);


  const toggleProduct = (
    id: number
  ) => {

    setSelectedProducts(
      (prev) =>
        prev.includes(id)
          ? prev.filter(
              (productId) =>
                productId !== id
            )
          : [
              ...prev,
              id,
            ]
    );

  };


  const toggleAllProducts =
    () => {

      if (
        selectedProducts.length ===
        displayProducts.length
      ) {

        setSelectedProducts([]);

      } else {

        setSelectedProducts(
          displayProducts.map(
            (product) =>
              product.id
          )
        );

      }

    };


  const clearSelection =
    () => {

      setSelectedProducts([]);

    };


  const applyAvailability =
    async () => {

      if (
        selectedProducts.length ===
        0
      ) {

        return;

      }


      const data: {
        brand?: string;
        category?: string;
        availability?: Availability;
        featured?: boolean;
        newArrival?: boolean;
        bestSeller?: boolean;
        limited?: boolean;
        onSale?: boolean;
      } = {};


      if (bulkBrand) {

        data.brand =
          bulkBrand;

      }


      if (bulkCategory) {

        data.category =
          bulkCategory;

      }


      if (bulkAvailability) {

        data.availability =
          bulkAvailability;

      }


      if (featured !== "") {

        data.featured =
          featured === "true";

      }


      if (newArrival !== "") {

        data.newArrival =
          newArrival === "true";

      }


      if (bestSeller !== "") {

        data.bestSeller =
          bestSeller === "true";

      }


      if (limited !== "") {

        data.limited =
          limited === "true";

      }


      if (onSale !== "") {

        data.onSale =
          onSale === "true";

      }


      if (
        Object.keys(data).length ===
        0
      ) {

        return;

      }


      await updateProducts(
        selectedProducts,
        data
      );


      setSelectedProducts([]);

      setBulkBrand("");
      setBulkCategory("");
      setBulkAvailability("");

      setFeatured("");
      setNewArrival("");
      setBestSeller("");
      setLimited("");
      setOnSale("");

      router.refresh();

    };


  async function handleDragEnd(
    event: DragEndEvent
  ) {

    if (isSavingOrder) {

      return;

    }


    if (!isManualOrder) {

      return;

    }


    const {
      active,
      over,
    } = event;


    if (!over) {

      return;

    }


    if (
      active.id ===
      over.id
    ) {

      return;

    }


    const oldIndex =
      displayProducts.findIndex(
        (product) =>
          product.id ===
          Number(active.id)
      );


    const newIndex =
      displayProducts.findIndex(
        (product) =>
          product.id ===
          Number(over.id)
      );


    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {

      return;

    }


    const previousProducts =
      [
        ...displayProducts,
      ];


    const reordered =
      arrayMove(
        displayProducts,
        oldIndex,
        newIndex
      );


    setDisplayProducts(
      reordered
    );


    const orderedIds =
      reordered.map(
        (product) =>
          product.id
      );


    setIsSavingOrder(
      true
    );


    try {

      await updateProductDisplayOrder(
        orderedIds
      );


      router.refresh();

    } catch (error) {

      console.error(
        "Failed to save product order:",
        error
      );


      setDisplayProducts(
        previousProducts
      );


      alert(
        "Failed to save product order. Please try again."
      );

    } finally {

      setIsSavingOrder(
        false
      );

    }

  }


  const deleteSelected =
    async () => {

      if (
        selectedProducts.length ===
        0
      ) {

        return;

      }


      await deleteProducts(
        selectedProducts
      );


      setSelectedProducts([]);


      router.refresh();

    };


  return (
    <>

      {selectedProducts.length >
        0 && (

        <SelectionToolbar
          selectedCount={
            selectedProducts.length
          }

          brands={
            brands
          }

          categories={
            categories
          }

          onClear={
            clearSelection
          }

          onDelete={
            deleteSelected
          }

          availability={
            bulkAvailability
          }

          brand={
            bulkBrand
          }

          category={
            bulkCategory
          }

          featured={
            featured
          }

          newArrival={
            newArrival
          }

          bestSeller={
            bestSeller
          }

          limited={
            limited
          }

          onSale={
            onSale
          }

          onAvailabilityChange={
            setBulkAvailability
          }

          onBrandChange={
            setBulkBrand
          }

          onCategoryChange={
            setBulkCategory
          }

          onFeaturedChange={
            setFeatured
          }

          onNewArrivalChange={
            setNewArrival
          }

          onBestSellerChange={
            setBestSeller
          }

          onLimitedChange={
            setLimited
          }

          onOnSaleChange={
            setOnSale
          }

          onApplyAvailability={
            applyAvailability
          }
        />

      )}


      {!isManualOrder && (

        <div
          className="
            mb-4
            rounded-xl
            border
            border-amber-200
            bg-amber-50
            px-4
            py-3
            text-sm
            text-amber-800
          "
        >

          <span className="font-medium">
            Manual Order
          </span>{" "}

          is required to drag and reorder
          products.

        </div>

      )}


      {isSavingOrder && (

        <div
          className="
            mb-4
            rounded-xl
            border
            border-neutral-200
            bg-neutral-50
            px-4
            py-3
            text-sm
            text-neutral-600
          "
        >

          Saving product order...

        </div>

      )}


      <DndContext
        sensors={
          sensors
        }

        collisionDetection={
          closestCenter
        }

        onDragEnd={
          handleDragEnd
        }
      >

        <div
          className="
            w-full
            min-w-0
            overflow-x-auto
            rounded-2xl
            border
            border-neutral-200
            bg-white
            shadow-sm
            [-webkit-overflow-scrolling:touch]
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-neutral-100
              px-3
              py-2.5
              text-[10px]
              text-neutral-400
              sm:hidden
            "
          >

            <span>
              Product list
            </span>

            <span>
              Swipe → for more
            </span>

          </div>


          <table
            className="
              w-full
              min-w-[1500px]
              table-fixed
            "
          >

            <thead
              className="
                sticky
                top-0
                z-20
                border-b
                border-neutral-200
                bg-white/95
                backdrop-blur
                supports-[backdrop-filter]:bg-white/80
              "
            >

              <tr>

                <th
                  className="
                    w-10
                    px-2
                    py-3

                    lg:w-12
                    lg:px-4
                    lg:py-4
                  "
                >

                  <input
                    type="checkbox"

                    checked={
                      displayProducts.length >
                        0 &&
                      selectedProducts.length ===
                        displayProducts.length
                    }

                    onChange={
                      toggleAllProducts
                    }

                    className="
                      h-4
                      w-4
                      rounded
                      border-neutral-300
                      accent-black
                    "
                  />

                </th>


                <th
                  className="
                    w-[320px]
                    px-3
                    py-3
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-neutral-500

                    lg:w-[560px]
                    lg:px-6
                    lg:py-4
                    lg:text-xs
                    lg:tracking-[0.18em]
                  "
                >

                  Product

                </th>


                <th
                  className="
                    w-[170px]
                    px-3
                    py-3
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-neutral-500

                    lg:w-[260px]
                    lg:px-6
                    lg:py-4
                    lg:text-xs
                    lg:tracking-[0.18em]
                  "
                >

                  Pricing

                </th>


                <th
                  className="
                    w-[120px]
                    px-3
                    py-3
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-neutral-500

                    lg:w-[180px]
                    lg:px-6
                    lg:py-4
                    lg:text-xs
                    lg:tracking-[0.18em]
                  "
                >

                  Availability

                </th>


                {/* ================================================= */}
                {/* Video */}
                {/* ================================================= */}

                <th
                  className="
                    w-[80px]
                    px-3
                    py-3
                    text-center
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-neutral-500

                    lg:w-[100px]
                    lg:px-4
                    lg:py-4
                    lg:text-xs
                    lg:tracking-[0.18em]
                  "
                >

                  Video

                </th>


                {/* ================================================= */}
                {/* Actions */}
                {/* ================================================= */}

                <th
                  className="
                    sticky
                    right-0
                    z-40
                    w-[360px]
                    min-w-[360px]
                    max-w-[360px]
                    border-l
                    border-neutral-200
                    bg-white
                    px-3
                    py-3
                    text-right
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-neutral-500
                    shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]

                    lg:w-[360px]
                    lg:min-w-[360px]
                    lg:max-w-[360px]
                    lg:px-6
                    lg:py-4
                    lg:text-xs
                    lg:tracking-[0.18em]
                  "
                >

                  Actions

                </th>

              </tr>

            </thead>


            <SortableContext
              items={
                displayProducts.map(
                  (product) =>
                    product.id
                )
              }

              strategy={
                verticalListSortingStrategy
              }
            >

              <tbody
                className="
                  divide-y
                  divide-neutral-100
                "
              >

                {displayProducts.map(
                  (product) => (

                    <ProductRow
                      key={
                        product.id
                      }

                      product={
                        product
                      }

                      exchangeRate={
                        exchangeRate
                      }

                      selected={
                        selectedProducts.includes(
                          product.id
                        )
                      }

                      onToggle={() =>
                        toggleProduct(
                          product.id
                        )
                      }

                      canDelete={
                        canDelete
                      }

                      page={
                        page
                      }

                      search={
                        search
                      }

                      brand={
                        brand
                      }

                      category={
                        category
                      }

                      availability={
                        availability
                      }

                      sort={
                        sort
                      }
                    />

                  )
                )}

              </tbody>

            </SortableContext>

          </table>

        </div>

      </DndContext>

    </>
  );
}