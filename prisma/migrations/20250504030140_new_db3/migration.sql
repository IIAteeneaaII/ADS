/*
  Warnings:

  - Added the required column `reminderTime` to the `UserHabit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserHabit" ADD COLUMN     "reminderTime" JSONB NOT NULL;
