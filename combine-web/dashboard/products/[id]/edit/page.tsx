import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import ProductForm from "../../_components/ProductForm";
import { updateProduct } from "../../_actions/product.actions";


// ============================================================
// TYPES
// ============================================================

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    returnTo?: string;
  }>;
};


// ============================================================
// PAGE
// ============================================================

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {

  // ==========================================================
  // PARAMS
  // ==========================================================

  const {
    id: idParam,
  } = await params;

  const {
    returnTo: returnToParam,
  } = await searchParams;


  const id =
    Number(idParam);


  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    notFound();
  }


  // ==========================================================
  // RETURN URL
  // ==========================================================

  /*
   * Keep the return URL inside the admin products area.
   *
   * This prevents an external URL from being passed into
   * ProductForm and used for navigation after saving.
   */

  let returnTo =
    "/admin/dashboard/products";


  if (
    returnToParam &&
    returnToParam.startsWith(
      "/admin/dashboard/products"
    )
  ) {
    returnTo =
      returnToParam;
  }


  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const [
    product,
    brands,
    categories,
    subCategories,
    packagingProfiles,
    settings,
    colors,
  ] = await Promise.all([

    /*
     * ========================================================
     * Product
     * ========================================================
     */

    prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        colors: {
          orderBy: {
            sortOrder: "asc",
          },

          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },

        variants: {
          orderBy: {
            sortOrder: "asc",
          },

          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
      },
    }),


    /*
     * ========================================================
     * Active Brands
     * ========================================================
     */

    prisma.brand.findMany({
      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    }),


    /*
     * ========================================================
     * Active Categories
     * ========================================================
     */

    prisma.category.findMany({
      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    }),


    /*
     * ========================================================
     * Active Sub Categories
     * ========================================================
     */

    prisma.subCategory.findMany({
      where: {
        active: true,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },

        {
          name: "asc",
        },
      ],
    }),


    /*
     * ========================================================
     * Packaging Profiles
     * ========================================================
     */

    prisma.packagingProfile.findMany({
      orderBy: [
        {
          brand: "asc",
        },

        {
          name: "asc",
        },
      ],
    }),


    /*
     * ========================================================
     * Website Settings
     * ========================================================
     */

    prisma.setting.findFirst(),


    /*
     * ========================================================
     * Active Global Colors
     * ========================================================
     */

    prisma.color.findMany({
      where: {
        active: true,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },

        {
          name: "asc",
        },
      ],
    }),
  ]);


  // ==========================================================
  // PRODUCT NOT FOUND
  // ==========================================================

  if (!product) {
    notFound();
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ProductForm
      action={
        updateProduct.bind(
          null,
          product.id
        )
      }

      product={product}

      submitText="Update Product"

      categories={
        categories
      }

      subCategories={
        subCategories
      }

      brands={
        brands
      }

      packagingProfiles={
        packagingProfiles
      }

      exchangeRate={
        settings?.exchangeRate ??
        0.59
      }

      globalColors={
        colors
      }

      /*
       * --------------------------------------------------------
       * Return to the Products list with its current state.
       * --------------------------------------------------------
       */

      returnTo={
        returnTo
      }
    />
  );
}