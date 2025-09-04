/*
  Warnings:

  - Made the column `proofUrl` on table `kitpurchase` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `kitpurchase` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `kitpurchase` DROP FOREIGN KEY `KitPurchase_kitId_fkey`;

-- DropForeignKey
ALTER TABLE `kitvideo` DROP FOREIGN KEY `KitVideo_kitId_fkey`;

-- DropIndex
DROP INDEX `KitPurchase_kitId_fkey` ON `kitpurchase`;

-- DropIndex
DROP INDEX `KitVideo_kitId_fkey` ON `kitvideo`;

-- AlterTable
ALTER TABLE `kitpurchase` MODIFY `proofUrl` VARCHAR(191) NOT NULL,
    MODIFY `amount` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `video` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `KitPurchase` ADD CONSTRAINT `KitPurchase_kitId_fkey` FOREIGN KEY (`kitId`) REFERENCES `Kit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KitVideo` ADD CONSTRAINT `KitVideo_kitId_fkey` FOREIGN KEY (`kitId`) REFERENCES `Kit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
