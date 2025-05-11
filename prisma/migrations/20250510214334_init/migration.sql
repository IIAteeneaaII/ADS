/*
  Warnings:

  - A unique constraint covering the columns `[userHabitId,date]` on the table `HabitTrackingLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HabitTrackingLog_userHabitId_date_key" ON "HabitTrackingLog"("userHabitId", "date");
