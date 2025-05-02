/*
  Warnings:

  - You are about to drop the column `reminderTime` on the `UserHabit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `UserHabit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fieldValues` to the `UserHabit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `UserHabit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "afternoonHour" INTEGER NOT NULL DEFAULT 13,
ADD COLUMN     "morningHour" INTEGER NOT NULL DEFAULT 8,
ADD COLUMN     "nightHour" INTEGER NOT NULL DEFAULT 21;

-- AlterTable
ALTER TABLE "UserHabit" DROP COLUMN "reminderTime",
ADD COLUMN     "fieldValues" JSONB NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "reminder" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "UserHabit_userId_name_key" ON "UserHabit"("userId", "name");
