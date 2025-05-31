-- CreateEnum
CREATE TYPE "MoodType" AS ENUM ('HAPPY', 'SAD', 'ANGRY', 'CALM');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "morningHour" INTEGER NOT NULL DEFAULT 8,
    "afternoonHour" INTEGER NOT NULL DEFAULT 13,
    "nightHour" INTEGER NOT NULL DEFAULT 21,
    "profilePic" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

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
    "icon" TEXT NOT NULL,
    "frequency" JSONB NOT NULL,
    "reminder" BOOLEAN NOT NULL DEFAULT true,
    "fieldValues" JSONB,
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

-- CreateTable
CREATE TABLE "ResetCode" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mood" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mood" "MoodType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HabitTrackingLog_userHabitId_date_key" ON "HabitTrackingLog"("userHabitId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Mood_userId_date_key" ON "Mood"("userId", "date");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitTemplateField" ADD CONSTRAINT "HabitTemplateField_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "HabitTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabit" ADD CONSTRAINT "UserHabit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabit" ADD CONSTRAINT "UserHabit_habitTemplateId_fkey" FOREIGN KEY ("habitTemplateId") REFERENCES "HabitTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabitFieldValue" ADD CONSTRAINT "UserHabitFieldValue_userHabitId_fkey" FOREIGN KEY ("userHabitId") REFERENCES "UserHabit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabitFieldValue" ADD CONSTRAINT "UserHabitFieldValue_templateFieldId_fkey" FOREIGN KEY ("templateFieldId") REFERENCES "HabitTemplateField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitTrackingLog" ADD CONSTRAINT "HabitTrackingLog_userHabitId_fkey" FOREIGN KEY ("userHabitId") REFERENCES "UserHabit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
