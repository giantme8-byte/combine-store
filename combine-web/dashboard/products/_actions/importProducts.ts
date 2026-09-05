"use server";

import { Availability } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type ProductImportRow = {
  SKU?: string;
  Brand?: string;
  Category?: string;
  "Product Name"?: string;
  Model?: string;
  Price?: number | string;
  Availability?: string;
  Featured?: boolean | string;
  "New Arrival"?: boolean | string;
  "Best Seller"?: boolean | string;
  Limited?: boolean | string;
  "On Sale"?: boolean | string;
};

export async function importProducts(
  rows: ProductImportRow[],
  mode: "create" | "update" | "upsert"
) {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    try {
      const sku = String(row.SKU ?? "").trim();

      if (!sku) {
        skipped++;
        continue;
      }

      const existing = await prisma.product.findUnique({
        where: {
          sku,
        },
      });

      const productName = String(
        row["Product Name"] ?? ""
      ).trim();

      const availability = Object.values(
        Availability
      ).includes(row.Availability as Availability)
        ? (row.Availability as Availability)
        : Availability.PRE_ORDER;

      const data = {
        sku,
        brand: String(row.Brand ?? "").trim(),
        category: String(row.Category ?? "").trim(),
        name: productName,
        model: String(row.Model ?? "").trim(),

        // Prisma 必填
        description: productName,

        price: Number(row.Price ?? 0),

        availability,

        featured:
          String(row.Featured).toLowerCase() ===
          "true",

        newArrival:
          String(row["New Arrival"]).toLowerCase() ===
          "true",

        bestSeller:
          String(row["Best Seller"]).toLowerCase() ===
          "true",

        limited:
          String(row.Limited).toLowerCase() ===
          "true",

        onSale:
          String(row["On Sale"]).toLowerCase() ===
          "true",
      };

      if (mode === "create") {
        if (existing) {
          skipped++;
          continue;
        }

        await prisma.product.create({
          data,
        });

        created++;
        continue;
      }

      if (mode === "update") {
        if (!existing) {
          skipped++;
          continue;
        }

        await prisma.product.update({
          where: {
            id: existing.id,
          },
          data,
        });

        updated++;
        continue;
      }

      // upsert
      if (existing) {
        await prisma.product.update({
          where: {
            id: existing.id,
          },
          data,
        });

        updated++;
      } else {
        await prisma.product.create({
          data,
        });

        created++;
      }
    } catch (error) {
      skipped++;

      errors.push(
        `SKU ${row.SKU ?? "(empty)"}: ${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    }
  }

  return {
    created,
    updated,
    skipped,
    errors,
  };
}