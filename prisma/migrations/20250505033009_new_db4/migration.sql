/*
  Warnings:

  - You are about to drop the column `reminderTime` on the `UserHabit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserHabit" DROP COLUMN "reminderTime",
ALTER COLUMN "fieldValues" DROP NOT NULL;
