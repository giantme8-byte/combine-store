-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "customPackagingId" INTEGER;

-- CreateTable
CREATE TABLE "PackagingProfile" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "title" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagingImage" (
    "id" SERIAL NOT NULL,
    "packagingId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagingImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagingItem" (
    "id" SERIAL NOT NULL,
    "packagingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackagingProfile_key_key" ON "PackagingProfile"("key");

-- CreateIndex
CREATE INDEX "PackagingProfile_brand_idx" ON "PackagingProfile"("brand");

-- CreateIndex
CREATE INDEX "PackagingProfile_active_idx" ON "PackagingProfile"("active");

-- CreateIndex
CREATE INDEX "PackagingImage_packagingId_idx" ON "PackagingImage"("packagingId");

-- CreateIndex
CREATE INDEX "PackagingImage_sortOrder_idx" ON "PackagingImage"("sortOrder");

-- CreateIndex
CREATE INDEX "PackagingItem_packagingId_idx" ON "PackagingItem"("packagingId");

-- CreateIndex
CREATE INDEX "PackagingItem_sortOrder_idx" ON "PackagingItem"("sortOrder");

-- CreateIndex
CREATE INDEX "Product_customPackagingId_idx" ON "Product"("customPackagingId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_customPackagingId_fkey" FOREIGN KEY ("customPackagingId") REFERENCES "PackagingProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagingProfile" ADD CONSTRAINT "PackagingProfile_brand_fkey" FOREIGN KEY ("brand") REFERENCES "Brand"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagingImage" ADD CONSTRAINT "PackagingImage_packagingId_fkey" FOREIGN KEY ("packagingId") REFERENCES "PackagingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagingItem" ADD CONSTRAINT "PackagingItem_packagingId_fkey" FOREIGN KEY ("packagingId") REFERENCES "PackagingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
