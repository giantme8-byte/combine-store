-- AlterEnum
ALTER TYPE "PaymentMethodType" ADD VALUE 'WISE';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "wiseAccount" TEXT,
ADD COLUMN     "wiseEmail" TEXT,
ADD COLUMN     "wiseName" TEXT;

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "wiseAccount" TEXT,
ADD COLUMN     "wiseEmail" TEXT,
ADD COLUMN     "wiseName" TEXT;
