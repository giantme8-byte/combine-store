-- CreateEnum
CREATE TYPE "ShippingType" AS ENUM ('LOCAL', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "ShippingQuoteStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'QUOTED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingCountry" TEXT,
ADD COLUMN     "shippingQuoteStatus" "ShippingQuoteStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
ADD COLUMN     "shippingType" "ShippingType" NOT NULL DEFAULT 'LOCAL';

-- CreateIndex
CREATE INDEX "Order_shippingCountry_idx" ON "Order"("shippingCountry");

-- CreateIndex
CREATE INDEX "Order_shippingType_idx" ON "Order"("shippingType");

-- CreateIndex
CREATE INDEX "Order_shippingQuoteStatus_idx" ON "Order"("shippingQuoteStatus");
