/*
  Warnings:

  - You are about to drop the column `currentPreiodEnd` on the `subscription` table. All the data in the column will be lost.
  - Added the required column `currentPeriodEnd` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "currentPreiodEnd",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3) NOT NULL;
