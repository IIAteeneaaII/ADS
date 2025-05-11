-- DropForeignKey
ALTER TABLE "HabitTrackingLog" DROP CONSTRAINT "HabitTrackingLog_userHabitId_fkey";

-- DropForeignKey
ALTER TABLE "UserHabit" DROP CONSTRAINT "UserHabit_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserHabitFieldValue" DROP CONSTRAINT "UserHabitFieldValue_userHabitId_fkey";

-- AddForeignKey
ALTER TABLE "UserHabit" ADD CONSTRAINT "UserHabit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabitFieldValue" ADD CONSTRAINT "UserHabitFieldValue_userHabitId_fkey" FOREIGN KEY ("userHabitId") REFERENCES "UserHabit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitTrackingLog" ADD CONSTRAINT "HabitTrackingLog_userHabitId_fkey" FOREIGN KEY ("userHabitId") REFERENCES "UserHabit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
