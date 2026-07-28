import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const headers = [
    [
      "SKU",
      "Brand",
      "Category",
      "Product Name",
      "Model",
      "Price",
      "Availability",
      "Featured",
      "New Arrival",
      "Best Seller",
      "Limited",
      "On Sale",
    ],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(headers);

  const workbook = XLSX.utils.book_new();

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
        'attachment; filename="products-template.xlsx"',
    },
  });
}