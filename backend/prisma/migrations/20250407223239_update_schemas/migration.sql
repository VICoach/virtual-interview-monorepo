/*
  Warnings:

  - You are about to drop the column `session_id` on the `TechnicalProblem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[problem_id]` on the table `TechnicalSolution` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TechnicalProblem" DROP CONSTRAINT "TechnicalProblem_session_id_fkey";

-- AlterTable
ALTER TABLE "TechnicalProblem" DROP COLUMN "session_id";

-- CreateTable
CREATE TABLE "session_technical_problems" (
    "session_id" INTEGER NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_technical_problems_pkey" PRIMARY KEY ("session_id","problem_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalSolution_problem_id_key" ON "TechnicalSolution"("problem_id");

-- AddForeignKey
ALTER TABLE "session_technical_problems" ADD CONSTRAINT "session_technical_problems_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "InterviewSession"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_technical_problems" ADD CONSTRAINT "session_technical_problems_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "TechnicalProblem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
