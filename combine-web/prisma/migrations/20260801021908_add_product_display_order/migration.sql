-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "displayOrder" SET DEFAULT 9999;

-- CreateIndex
CREATE INDEX "Product_displayOrder_idx" ON "Product"("displayOrder");
