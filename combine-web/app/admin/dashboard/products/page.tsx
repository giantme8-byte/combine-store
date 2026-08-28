import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/authorize";
import { buildProductOrderBy } from "@/lib/product-sort";
import { buildProductWhere } from "@/lib/product-filter";
import { prisma } from "@/lib/prisma";

import Link from "next/link";

import ProductView from "./_components/ProductView";

import PageHeader from "../_components/PageHeader";
import Card from "../_components/Card";
import Button from "../_components/Button";
import EmptyState from "../_components/EmptyState";
import ProductFilters from "../_components/ProductFilters";
import Pagination from "../_components/Pagination";


// ============================================================
// TYPES
// ============================================================

type ProductsPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    brand?: string;
    category?: string;
    availability?: string;
    sort?: string;
  }>;
};


// ============================================================
// PAGE
// ============================================================

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  const user =
    await requireRole([
      UserRole.STAFF,
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.OWNER,
    ]);


  const deleteRoles: UserRole[] = [
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ];


  const canDelete =
    deleteRoles.includes(
      user.role
    );


  // ==========================================================
  // SEARCH PARAMS
  // ==========================================================

  const params =
    await searchParams;


  const search =
    params.search ?? "";


  const brand =
    params.brand ?? "";


  const category =
    params.category ?? "";


  const availability =
    params.availability ?? "";


  // ==========================================================
  // SORT
  // ==========================================================

  /*
   * Manual Order is the default
   * sorting mode.
   */

  const sort =
    params.sort ?? "manual";


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const page =
    Math.max(
      1,
      Number(
        params.page ?? "1"
      ) || 1
    );


  const pageSize =
    20;


  const skip =
    (page - 1) *
    pageSize;


  // ==========================================================
  // FILTERS
  // ==========================================================

  const where =
    buildProductWhere({
      search,
      brand,
      category,
      availability,
    });


  // ==========================================================
  // SORTING
  // ==========================================================

  const orderBy =
    buildProductOrderBy(
      sort
    );


  // ==========================================================
  // DATABASE
  // ==========================================================

  const [
    products,
    totalProducts,
    settings,
    brands,
    categories,
  ] =
    await Promise.all([

      // ------------------------------------------------------
      // PRODUCTS
      // ------------------------------------------------------

      prisma.product.findMany({

        where,

        orderBy,

        skip,

        take: pageSize,

        include: {

          // --------------------------------------------------
          // PRODUCT IMAGES
          // --------------------------------------------------

          images: {

            orderBy: {
              sortOrder: "asc",
            },

          },


          // --------------------------------------------------
          // PRODUCT VARIANTS
          // --------------------------------------------------

          variants: {

            include: {
              color: true,
            },

          },

        },

      }),


      // ------------------------------------------------------
      // TOTAL PRODUCTS
      // ------------------------------------------------------

      prisma.product.count({
        where,
      }),


      // ------------------------------------------------------
      // SETTINGS
      // ------------------------------------------------------

      prisma.setting.findFirst(),


      // ------------------------------------------------------
      // BRANDS
      // ------------------------------------------------------

      prisma.brand.findMany({

        orderBy: {
          name: "asc",
        },

      }),


      // ------------------------------------------------------
      // CATEGORIES
      // ------------------------------------------------------

      prisma.category.findMany({

        orderBy: {
          name: "asc",
        },

      }),

    ]);


  // ==========================================================
  // EXCHANGE RATE
  // ==========================================================

  const exchangeRate =
    settings?.exchangeRate ??
    0.59;


  // ==========================================================
  // TOTAL PAGES
  // ==========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalProducts /
        pageSize
      )
    );


  // ==========================================================
  // PRESERVE CURRENT FILTERS
  // ==========================================================

  const currentSearchParams =
    new URLSearchParams();


  if (search) {

    currentSearchParams.set(
      "search",
      search
    );

  }


  if (brand) {

    currentSearchParams.set(
      "brand",
      brand
    );

  }


  if (category) {

    currentSearchParams.set(
      "category",
      category
    );

  }


  if (availability) {

    currentSearchParams.set(
      "availability",
      availability
    );

  }


  if (sort) {

    currentSearchParams.set(
      "sort",
      sort
    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="space-y-8">


      {/* ======================================================
          HEADER
          ====================================================== */}

      <PageHeader
        title="Products"
        description="Manage your luxury product collection."
      >

        <div className="flex gap-2">

          <Link
            href="/admin/dashboard/products/import"
          >

            <Button variant="secondary">
              📥 Import Excel
            </Button>

          </Link>


          <Link
            href="/api/admin/products/export"
          >

            <Button variant="secondary">
              📤 Export Excel
            </Button>

          </Link>


          <Link
            href="/admin/dashboard/products/new"
          >

            <Button>
              + Add Product
            </Button>

          </Link>

        </div>

      </PageHeader>


      {/* ======================================================
          FILTERS
          ====================================================== */}

      <ProductFilters
        brands={
          brands
        }
        categories={
          categories
        }
      />


      {/* ======================================================
          PRODUCTS
          ====================================================== */}

      <Card className="overflow-hidden p-0">

        {products.length === 0 ? (

          <EmptyState
            title="No Products"
            description="Create your first product to get started."
          />

        ) : (

          <ProductView
            products={
              products
            }

            exchangeRate={
              exchangeRate
            }

            brands={
              brands
            }

            categories={
              categories
            }

            canDelete={
              canDelete
            }

            page={
              page
            }

            pageSize={
              pageSize
            }

            sort={
              sort
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
          />

        )}

      </Card>


      {/* ======================================================
          PAGINATION
          ====================================================== */}

      <Pagination
        page={
          page
        }

        totalPages={
          totalPages
        }

        pathname="/admin/dashboard/products"

        searchParams={
          currentSearchParams
        }
      />

    </main>
  );
}