/*
  Warnings:

  - A unique constraint covering the columns `[productId,name]` on the table `ProductColor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductColor_productId_colorId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProductColor_productId_name_key" ON "ProductColor"("productId", "name");
