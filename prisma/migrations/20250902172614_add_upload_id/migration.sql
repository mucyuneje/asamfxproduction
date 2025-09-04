/*
  Warnings:

  - Added the required column `uploadId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `video` ADD COLUMN `uploadId` VARCHAR(191) NOT NULL,
    MODIFY `playbackId` VARCHAR(191) NULL;
