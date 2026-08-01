-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('MAIN', 'GALLERY', 'DETAIL', 'PACKAGING');

-- DropIndex
DROP INDEX "ProductImage_productId_sortOrder_key";

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "altText" TEXT,
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "type" "ImageType" NOT NULL DEFAULT 'GALLERY',
ALTER COLUMN "sortOrder" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "sortOrder" SET DEFAULT 1;

-- CreateIndex
CREATE INDEX "ProductImage_type_idx" ON "ProductImage"("type");

-- CreateIndex
CREATE INDEX "ProductImage_sortOrder_idx" ON "ProductImage"("sortOrder");
