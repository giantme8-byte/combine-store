import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { calculateInventorySummary } from "@/lib/dashboard";
import { requireRole } from "@/lib/authorize";

import StatCard from "./_components/StatCard";
import RecentProducts from "./_components/RecentProducts";
import RecentInquiries from "./_components/RecentInquiries";
import BusinessStatCard from "./_components/BusinessStatCard";
import InventoryChart from "./_components/InventoryChart";
import TopBrands from "./_components/TopBrands";
import InventoryAlerts from "./_components/InventoryAlerts";
import DashboardHero from "./_components/DashboardHero";

import { PageHeader } from "@/components/ui/page-header";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import Link from "next/link";


export default async function DashboardPage() {


  const user = await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
  ]);



  const [
    products,
    categories,
    brands,
    wishlist,
    inquiries,

    pendingInquiries,
    contactedInquiries,
    completedInquiries,
    cancelledInquiries,

    featuredProducts,
    newArrivalProducts,
    bestSellerProducts,

    allProducts,
    settings,

  ] = await Promise.all([


    prisma.product.count(),


    prisma.category.count(),


    prisma.brand.count(),


    prisma.wishlistItem.count(),


    prisma.inquiry.count(),



    prisma.inquiry.count({
      where:{
        status:"PENDING",
      },
    }),



    prisma.inquiry.count({
      where:{
        status:"CONTACTED",
      },
    }),



    prisma.inquiry.count({
      where:{
        status:"COMPLETED",
      },
    }),



    prisma.inquiry.count({
      where:{
        status:"CANCELLED",
      },
    }),



    prisma.product.count({
      where:{
        featured:true,
      },
    }),



    prisma.product.count({
      where:{
        newArrival:true,
      },
    }),



    prisma.product.count({
      where:{
        bestSeller:true,
      },
    }),



    prisma.product.findMany(),



    prisma.setting.findFirst(),


  ]);




  const exchangeRate =
    settings?.exchangeRate ?? 0.59;



  const summary =
    calculateInventorySummary(
      allProducts,
      exchangeRate
    );




  const categoryData =
    Object.values(
      allProducts.reduce(
        (acc, product)=>{

          const category =
            product.category;


          if(!acc[category]){
            acc[category]={
              name:category,
              value:0,
            };
          }


          acc[category].value++;


          return acc;

        },
        {} as Record<
          string,
          {
            name:string;
            value:number;
          }
        >
      )
    );





  const brandData =
    Object.values(
      allProducts.reduce(
        (acc, product)=>{

          const brand =
            product.brand;


          if(!acc[brand]){
            acc[brand]={
              name:brand,
              value:0,
            };
          }


          acc[brand].value++;


          return acc;

        },
        {} as Record<
          string,
          {
            name:string;
            value:number;
          }
        >
      )
    );




  const canManage =
    user.role !== UserRole.STAFF;



  return (

    <main className="space-y-8">


      <PageHeader
        title="Dashboard"
        description="Monitor your store performance and business overview."
      />



      <DashboardHero
        companyName={
          settings?.companyName
        }
      />




      {/* Statistics */}

      <div className="
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-4
        2xl:grid-cols-6
      ">


        <StatCard
          title="Products"
          value={products}
          icon="📦"
        />


        <StatCard
          title="Categories"
          value={categories}
          icon="📂"
        />


        <StatCard
          title="Brands"
          value={brands}
          icon="🏷️"
        />


        <StatCard
          title="Wishlist"
          value={wishlist}
          icon="❤️"
        />


        <StatCard
          title="Inquiries"
          value={inquiries}
          icon="📩"
        />


        <StatCard
          title="Featured"
          value={featuredProducts}
          icon="⭐"
        />


        <StatCard
          title="New Arrival"
          value={newArrivalProducts}
          icon="🆕"
        />


        <StatCard
          title="Best Seller"
          value={bestSellerProducts}
          icon="🔥"
        />



        <StatCard
          title="Pending"
          value={pendingInquiries}
          icon="🟡"
        />


        <StatCard
          title="Contacted"
          value={contactedInquiries}
          icon="🔵"
        />


        <StatCard
          title="Completed"
          value={completedInquiries}
          icon="🟢"
        />


        <StatCard
          title="Cancelled"
          value={cancelledInquiries}
          icon="🔴"
        />

      </div>





      {/* Business Analytics */}

      <div className="
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-4
      ">


        <BusinessStatCard
          title="Inventory Value"
          value={`RM ${summary.totalCostMyr.toLocaleString(
            undefined,
            {
              minimumFractionDigits:2,
              maximumFractionDigits:2,
            }
          )}`}
          icon="📦"
        />


        <BusinessStatCard
          title="Potential Revenue"
          value={`RM ${summary.totalRevenue.toLocaleString(
            undefined,
            {
              minimumFractionDigits:2,
              maximumFractionDigits:2,
            }
          )}`}
          icon="💰"
        />



        <BusinessStatCard
          title="Estimated Profit"
          value={`RM ${summary.totalProfit.toLocaleString(
            undefined,
            {
              minimumFractionDigits:2,
              maximumFractionDigits:2,
            }
          )}`}
          icon="📈"
          color={
            summary.totalProfit >= 0
              ? "text-green-600"
              : "text-red-600"
          }
        />



        <BusinessStatCard
          title="Average Margin"
          value={`${summary.margin.toFixed(1)}%`}
          icon="🎯"
          color={
            summary.margin >=30
              ? "text-green-600"
              : summary.margin >=15
              ? "text-yellow-600"
              : "text-red-600"
          }
        />


      </div>






      <div className="
        grid
        gap-5
        lg:grid-cols-3
      ">


        <div className="
          space-y-6
          lg:col-span-2
        ">


          <InventoryChart
            title="Products by Category"
            data={categoryData}
          />



          <InventoryChart
            title="Products by Brand"
            data={brandData}
          />



          <RecentProducts />



          <RecentInquiries />


        </div>





        <div className="space-y-6">



          {canManage && (

            <Card>

              <CardHeader>
                <CardTitle>
                  Quick Actions
                </CardTitle>
              </CardHeader>


              <CardContent
                className="space-y-3"
              >


                <Link
                  href="/admin/dashboard/products/new"
                >
                  <Button
                    className="w-full justify-start"
                  >
                    ➕ Add Product
                  </Button>
                </Link>



                <Link
                  href="/admin/dashboard/categories/new"
                >
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    ➕ Add Category
                  </Button>
                </Link>



                <Link
                  href="/admin/dashboard/brands/new"
                >
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    ➕ Add Brand
                  </Button>
                </Link>


              </CardContent>

            </Card>

          )}



          <TopBrands />


          <InventoryAlerts />


        </div>


      </div>


    </main>

  );
}