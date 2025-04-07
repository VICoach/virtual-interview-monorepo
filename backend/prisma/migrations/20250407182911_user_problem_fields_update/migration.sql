/*
  Warnings:

  - You are about to drop the column `source` on the `TechnicalProblem` table. All the data in the column will be lost.
  - You are about to drop the column `is_hidden` on the `TestCase` table. All the data in the column will be lost.
  - Added the required column `input` to the `TechnicalProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input_specification` to the `TechnicalProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memory_limit` to the `TechnicalProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output` to the `TechnicalProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output_specification` to the `TechnicalProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_limit` to the `TechnicalProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solution_description` to the `TechnicalSolution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TechnicalProblem" DROP COLUMN "source",
ADD COLUMN     "input" TEXT NOT NULL,
ADD COLUMN     "input_specification" TEXT NOT NULL,
ADD COLUMN     "memory_limit" TEXT NOT NULL,
ADD COLUMN     "output" TEXT NOT NULL,
ADD COLUMN     "output_specification" TEXT NOT NULL,
ADD COLUMN     "time_limit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TechnicalSolution" ADD COLUMN     "solution_description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "is_hidden";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL;
