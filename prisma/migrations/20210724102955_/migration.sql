/*
  Warnings:

  - You are about to drop the column `prejudice` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Setting` DROP COLUMN `prejudice`,
    ADD COLUMN `rulePostPrejudice` ENUM('ALL_FOLLOWERS', 'MUTUAL_ONLY') NOT NULL DEFAULT 'MUTUAL_ONLY';
