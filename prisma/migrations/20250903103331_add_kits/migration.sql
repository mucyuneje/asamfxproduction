-- DropForeignKey
ALTER TABLE `kitpurchase` DROP FOREIGN KEY `KitPurchase_kitId_fkey`;

-- DropForeignKey
ALTER TABLE `kitpurchase` DROP FOREIGN KEY `KitPurchase_userId_fkey`;

-- DropForeignKey
ALTER TABLE `kitvideo` DROP FOREIGN KEY `KitVideo_kitId_fkey`;

-- DropForeignKey
ALTER TABLE `kitvideo` DROP FOREIGN KEY `KitVideo_videoId_fkey`;

-- DropIndex
DROP INDEX `KitPurchase_kitId_fkey` ON `kitpurchase`;

-- DropIndex
DROP INDEX `KitPurchase_userId_fkey` ON `kitpurchase`;

-- DropIndex
DROP INDEX `KitVideo_kitId_fkey` ON `kitvideo`;

-- DropIndex
DROP INDEX `KitVideo_videoId_fkey` ON `kitvideo`;

-- AlterTable
ALTER TABLE `kitpurchase` ADD COLUMN `amount` DOUBLE NULL;

-- AddForeignKey
ALTER TABLE `KitVideo` ADD CONSTRAINT `KitVideo_kitId_fkey` FOREIGN KEY (`kitId`) REFERENCES `Kit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KitVideo` ADD CONSTRAINT `KitVideo_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KitPurchase` ADD CONSTRAINT `KitPurchase_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KitPurchase` ADD CONSTRAINT `KitPurchase_kitId_fkey` FOREIGN KEY (`kitId`) REFERENCES `Kit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
