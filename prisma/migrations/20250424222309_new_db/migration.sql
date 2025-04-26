/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "HabitTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "defaultFrequency" JSONB NOT NULL,
    "hasCustomFields" BOOLEAN NOT NULL,

    CONSTRAINT "HabitTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitTemplateField" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "unit" TEXT,

    CONSTRAINT "HabitTemplateField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHabit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "habitTemplateId" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "frequency" JSONB NOT NULL,
    "reminderTime" JSONB NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserHabit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHabitFieldValue" (
    "id" SERIAL NOT NULL,
    "userHabitId" INTEGER NOT NULL,
    "templateFieldId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "UserHabitFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitTrackingLog" (
    "id" SERIAL NOT NULL,
    "userHabitId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "fieldValues" JSONB NOT NULL,

    CONSTRAINT "HabitTrackingLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HabitTemplateField" ADD CONSTRAINT "HabitTemplateField_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "HabitTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabit" ADD CONSTRAINT "UserHabit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabit" ADD CONSTRAINT "UserHabit_habitTemplateId_fkey" FOREIGN KEY ("habitTemplateId") REFERENCES "HabitTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabitFieldValue" ADD CONSTRAINT "UserHabitFieldValue_userHabitId_fkey" FOREIGN KEY ("userHabitId") REFERENCES "UserHabit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabitFieldValue" ADD CONSTRAINT "UserHabitFieldValue_templateFieldId_fkey" FOREIGN KEY ("templateFieldId") REFERENCES "HabitTemplateField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitTrackingLog" ADD CONSTRAINT "HabitTrackingLog_userHabitId_fkey" FOREIGN KEY ("userHabitId") REFERENCES "UserHabit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
