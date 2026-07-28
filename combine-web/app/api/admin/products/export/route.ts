import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";

import * as XLSX from "xlsx";

export async function GET() {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = products.map((product) => ({
      SKU: product.sku,
      Brand: product.brand,
      Category: product.category,
      "Product Name": product.name,
      Model: product.model,
      Price: product.price,
      Availability: product.availability,
      Featured: product.featured,
      "New Arrival": product.newArrival,
      "Best Seller": product.bestSeller,
      Limited: product.limited,
      "On Sale": product.onSale,
      "Created At": product.createdAt,
    }));

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Products"
    );

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          'attachment; filename="products.xlsx"',
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to export products.",
      },
      {
        status: 500,
      }
    );
  }
}