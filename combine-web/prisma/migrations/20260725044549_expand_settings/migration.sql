-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "address" TEXT,
ADD COLUMN     "companyDescription" TEXT,
ADD COLUMN     "companyLogo" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "siteTitle" TEXT,
ADD COLUMN     "tiktok" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "youtube" TEXT;
