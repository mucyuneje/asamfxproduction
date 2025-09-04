/*
  Warnings:

  - The primary key for the `paymentsettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accountNumber` on the `paymentsettings` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `paymentsettings` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `paymentsettings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `paymentsettings` DROP PRIMARY KEY,
    DROP COLUMN `accountNumber`,
    DROP COLUMN `method`,
    ADD COLUMN `crypto` VARCHAR(191) NULL,
    ADD COLUMN `mobileMoney` VARCHAR(191) NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
