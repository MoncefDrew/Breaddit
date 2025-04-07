/*
  Warnings:

  - You are about to drop the column `cover` on the `Subreddit` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Subreddit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `isPinned` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pinnedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Subreddit` DROP COLUMN `cover`,
    DROP COLUMN `image`,
    ADD COLUMN `coverImage` VARCHAR(191) NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- RenameIndex
ALTER TABLE `Post` RENAME INDEX `Post_authorId_fkey` TO `Post_authorId_idx`;

-- RenameIndex
ALTER TABLE `Post` RENAME INDEX `Post_subredditId_fkey` TO `Post_subredditId_idx`;

-- RenameIndex
ALTER TABLE `Subreddit` RENAME INDEX `Subreddit_creatorId_fkey` TO `Subreddit_creatorId_idx`;
