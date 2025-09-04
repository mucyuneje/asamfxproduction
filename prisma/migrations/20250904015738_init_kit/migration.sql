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
ALTER TABLE `kit` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `kitpurchase` MODIFY `proofUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `proofUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `video` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `category` VARCHAR(191) NULL,
    MODIFY `paymentMethod` VARCHAR(191) NULL,
    MODIFY `uploadId` VARCHAR(191) NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `KitPurchase` ADD CONSTRAINT `KitPurchase_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KitPurchase` ADD CONSTRAINT `KitPurchase_kitId_fkey` FOREIGN KEY (`kitId`) REFERENCES `Kit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KitVideo` ADD CONSTRAINT `KitVideo_kitId_fkey` FOREIGN KEY (`kitId`) REFERENCES `Kit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KitVideo` ADD CONSTRAINT `KitVideo_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
