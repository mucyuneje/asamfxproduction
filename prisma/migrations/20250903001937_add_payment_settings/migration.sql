/*
  Warnings:

  - The primary key for the `paymentsettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `crypto` on the `paymentsettings` table. All the data in the column will be lost.
  - You are about to drop the column `mobileMoney` on the `paymentsettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `paymentsettings` DROP PRIMARY KEY,
    DROP COLUMN `crypto`,
    DROP COLUMN `mobileMoney`,
    ADD COLUMN `cryptoAccount` VARCHAR(191) NULL,
    ADD COLUMN `cryptoInstructions` VARCHAR(191) NULL,
    ADD COLUMN `cryptoOwner` VARCHAR(191) NULL,
    ADD COLUMN `mobileMoneyAccount` VARCHAR(191) NULL,
    ADD COLUMN `mobileMoneyInstructions` VARCHAR(191) NULL,
    ADD COLUMN `mobileMoneyOwner` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
