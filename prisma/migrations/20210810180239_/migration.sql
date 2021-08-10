/*
  Warnings:

  - You are about to drop the column `rulePostPrejudice` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Setting` DROP COLUMN `rulePostPrejudice`,
    ADD COLUMN `policyReceivePrejudice` ENUM('ALL_FOLLOWERS', 'MUTUAL_ONLY') NOT NULL DEFAULT 'MUTUAL_ONLY';
