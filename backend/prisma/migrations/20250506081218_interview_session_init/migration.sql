/*
  Warnings:

  - You are about to drop the column `resume` on the `InterviewConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `role_specification` on the `InterviewConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `InterviewConfiguration` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionBank` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session_technical_problems` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `InterviewSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `InterviewConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `InterviewConfiguration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_question_id_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_session_id_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "InterviewConfiguration" DROP CONSTRAINT "InterviewConfiguration_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_technical_problems" DROP CONSTRAINT "session_technical_problems_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "session_technical_problems" DROP CONSTRAINT "session_technical_problems_session_id_fkey";

-- DropIndex
DROP INDEX "InterviewConfiguration_user_id_key";

-- AlterTable
ALTER TABLE "InterviewConfiguration" DROP COLUMN "resume",
DROP COLUMN "role_specification",
DROP COLUMN "user_id",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL;

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "Feedback";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "QuestionBank";

-- DropTable
DROP TABLE "session_technical_problems";

-- CreateIndex
CREATE UNIQUE INDEX "InterviewSession_user_id_key" ON "InterviewSession"("user_id");
