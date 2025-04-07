-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('GOOGLE');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "provider_id" TEXT,
    "accountType" "AccountType"[] DEFAULT ARRAY['USER']::"AccountType"[],
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "verify_token" TEXT,
    "reset_pass_token" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "provider_id" TEXT NOT NULL,
    "type" "ProviderType" NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("provider_id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "education" TEXT NOT NULL,
    "skills" TEXT[],
    "languages" TEXT[],

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "InterviewConfiguration" (
    "config_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_specification" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "interview_mode" TEXT NOT NULL,

    CONSTRAINT "InterviewConfiguration_pkey" PRIMARY KEY ("config_id")
);

-- CreateTable
CREATE TABLE "InterviewSession" (
    "session_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "config_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "Question" (
    "question_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "is_bank_question" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "QuestionBank" (
    "question_bank_id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "QuestionBank_pkey" PRIMARY KEY ("question_bank_id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "answer_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_answer" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "feedback_id" SERIAL NOT NULL,
    "answer_id" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedback_id")
);

-- CreateTable
CREATE TABLE "PerformanceMetric" (
    "metric_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "metric_name" TEXT NOT NULL,
    "metric_value" DOUBLE PRECISION NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceMetric_pkey" PRIMARY KEY ("metric_id")
);

-- CreateTable
CREATE TABLE "TechnicalProblem" (
    "problem_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "TechnicalProblem_pkey" PRIMARY KEY ("problem_id")
);

-- CreateTable
CREATE TABLE "TechnicalSolution" (
    "solution_id" SERIAL NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "solution_code" TEXT NOT NULL,

    CONSTRAINT "TechnicalSolution_pkey" PRIMARY KEY ("solution_id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "test_case_id" SERIAL NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "expected_output" TEXT NOT NULL,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("test_case_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewConfiguration_user_id_key" ON "InterviewConfiguration"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewSession_config_id_key" ON "InterviewSession"("config_id");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_question_id_key" ON "Answer"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_answer_id_key" ON "Feedback"("answer_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "Provider"("provider_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewConfiguration" ADD CONSTRAINT "InterviewConfiguration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "InterviewConfiguration"("config_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "InterviewSession"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "InterviewSession"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Answer"("answer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceMetric" ADD CONSTRAINT "PerformanceMetric_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceMetric" ADD CONSTRAINT "PerformanceMetric_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "InterviewSession"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalProblem" ADD CONSTRAINT "TechnicalProblem_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "InterviewSession"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalSolution" ADD CONSTRAINT "TechnicalSolution_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "TechnicalProblem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "TechnicalProblem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
