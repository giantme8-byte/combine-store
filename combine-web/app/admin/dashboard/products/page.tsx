import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/authorize";
import { buildProductOrderBy } from "@/lib/product-sort";
import { buildProductWhere } from "@/lib/product-filter";
import { prisma } from "@/lib/prisma";

import Link from "next/link";

import ProductTable from "./_components/ProductTable";

import PageHeader from "../_components/PageHeader";
import Card from "../_components/Card";
import Button from "../_components/Button";
import EmptyState from "../_components/EmptyState";
import ProductFilters from "../_components/ProductFilters";
import Pagination from "../_components/Pagination";


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


export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {

const user = await requireRole([
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

const canDelete = deleteRoles.includes(user.role);


  const params = await searchParams;


  const search = params.search ?? "";
  const brand = params.brand ?? "";
  const category = params.category ?? "";

  const availability =
    params.availability ?? "";

  const sort =
    params.sort ?? "latest";


const page = Math.max(
  1,
  Number(params.page ?? "1") || 1
);


  const pageSize = 20;


  const skip =
    (page - 1) * pageSize;


  const where = buildProductWhere({
    search,
    brand,
    category,
    availability,
  });


  const orderBy =
    buildProductOrderBy(sort);


  const [
    products,
    totalProducts,
    settings,
    brands,
    categories,
  ] =
  await Promise.all([

    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),

    prisma.product.count({
      where,
    }),

    prisma.setting.findFirst(),

    prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
    }),

    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),

  ]);


  const exchangeRate =
    settings?.exchangeRate ?? 0.59;


const totalPages = Math.max(
  1,
  Math.ceil(totalProducts / pageSize)
);


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


  return (
    <main className="space-y-8">

      <PageHeader
        title="Products"
        description="Manage your luxury product collection."
      >

        <div className="flex gap-2">

          <Link href="/admin/dashboard/products/import">
            <Button variant="secondary">
              📥 Import Excel
            </Button>
          </Link>


          <Link href="/api/admin/products/export">
            <Button variant="secondary">
              📤 Export Excel
            </Button>
          </Link>


          <Link href="/admin/dashboard/products/new">
            <Button>
              + Add Product
            </Button>
          </Link>

        </div>

      </PageHeader>


      <ProductFilters
        brands={brands}
        categories={categories}
      />


      <Card className="overflow-hidden p-0">

        {products.length === 0 ? (

          <EmptyState
            title="No Products"
            description="Create your first product to get started."
          />

        ) : (

          <ProductTable
            products={products}
            exchangeRate={exchangeRate}
            brands={brands}
            categories={categories}
            canDelete={canDelete}
          />

        )}

      </Card>


      <Pagination
        page={page}
        totalPages={totalPages}
        pathname="/admin/dashboard/products"
        searchParams={currentSearchParams}
      />

    </main>
  );
}