/*
  Warnings:

  - Changed the type of `interview_mode` on the `InterviewConfiguration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InterviewMode" AS ENUM ('TECHNICAL', 'MOCK_UP', 'QUESTION_BY_QUESTION');

-- AlterTable
ALTER TABLE "InterviewConfiguration" DROP COLUMN "interview_mode",
ADD COLUMN     "interview_mode" "InterviewMode" NOT NULL;
