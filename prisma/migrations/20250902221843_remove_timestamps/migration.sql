/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `priceCents` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `scent` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Variant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Variant_productId_size_scent_key";

-- DropIndex
DROP INDEX "public"."Variant_sku_key";

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "createdAt",
DROP COLUMN "images",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Variant" DROP COLUMN "image",
DROP COLUMN "priceCents",
DROP COLUMN "scent",
DROP COLUMN "sku",
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '/images/placeholder.png',
ADD COLUMN     "label" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "priceZAR" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "scentNotes" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "whatsappSku" TEXT,
ALTER COLUMN "size" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");
