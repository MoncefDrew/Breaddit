/*
  Warnings:

  - You are about to drop the column `pinnedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `Subreddit` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Subreddit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `pinnedAt`,
    ADD COLUMN `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Subreddit` DROP COLUMN `coverImage`,
    DROP COLUMN `profileImage`,
    ADD COLUMN `cover` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    MODIFY `description` TEXT NULL;
