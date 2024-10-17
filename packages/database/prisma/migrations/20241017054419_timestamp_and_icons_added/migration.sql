/*
  Warnings:

  - Added the required column `icon` to the `AvailableAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `AvailableTrigger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flowName` to the `Flow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Flow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvailableAction" ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AvailableTrigger" ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Flow" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "flowName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
