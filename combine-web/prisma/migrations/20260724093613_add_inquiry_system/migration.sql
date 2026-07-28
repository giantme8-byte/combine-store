/*
  Warnings:

  - You are about to drop the column `productId` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `InquiryItem` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `InquiryItem` table. All the data in the column will be lost.
  - You are about to drop the `playing_with_neon` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inquiryId` to the `InquiryItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inquiry" DROP CONSTRAINT "Inquiry_productId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryItem" DROP CONSTRAINT "InquiryItem_userId_fkey";

-- DropIndex
DROP INDEX "InquiryItem_userId_productId_key";

-- AlterTable
ALTER TABLE "Inquiry" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "InquiryItem" DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "inquiryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "playing_with_neon";

-- DropEnum
DROP TYPE "InquiryItemStatus";

-- CreateIndex
CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");

-- CreateIndex
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");

-- CreateIndex
CREATE INDEX "InquiryItem_inquiryId_idx" ON "InquiryItem"("inquiryId");

-- CreateIndex
CREATE INDEX "InquiryItem_productId_idx" ON "InquiryItem"("productId");

-- AddForeignKey
ALTER TABLE "InquiryItem" ADD CONSTRAINT "InquiryItem_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
