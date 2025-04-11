import { Logger } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

interface Example {
  input: string;
  output: string;
}

interface ProblemData {
  title: string;
  time_limit: string;
  memory_limit: string;
  description: string;
  input_specification: string;
  output_specification: string;
  difficulty: string;
  tags: string[];
  examples: Example[];
}

interface SolutionData {
  description: string;
  code: string;
}

async function seed() {
  const prisma = new PrismaClient();

  const logger = new Logger('Seeder');

  try {
    await prisma.$connect();
    logger.log('Clearing existing data...');
    await prisma.technicalSolution.deleteMany();
    await prisma.technicalProblem.deleteMany();

    const dataDir = join(__dirname, 'data');
    const files = readdirSync(dataDir).filter((file) => file.endsWith('.json'));

    logger.log(`Found ${files.length} data files`);

    for (const file of files) {
      const filePath = join(dataDir, file);
      const data = JSON.parse(readFileSync(filePath, 'utf-8')) as {
        problem: ProblemData;
        solution: SolutionData;
      };

      logger.log(`Creating problem: ${data.problem.title}`);

      const problem = await prisma.technicalProblem.create({
        data: {
          title: data.problem.title,
          time_limit: data.problem.time_limit,
          memory_limit: data.problem.memory_limit,
          description: data.problem.description,
          input_specification: data.problem.input_specification,
          output_specification: data.problem.output_specification,
          difficulty: data.problem.difficulty,
          tags: data.problem.tags,
          input: data.problem.examples[0]?.input || '',
          output: data.problem.examples[0]?.output || '',
        },
      });

      await prisma.technicalSolution.create({
        data: {
          solution_description: data.solution.description,
          solution_code: data.solution.code,
          problem_id: problem.problem_id,
        },
      });
    }

    logger.log('Database seeded successfully!');
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  try {
    await seed();
  } catch (error) {
    const logger = new Logger('Seeder');
    logger.error('Unhandled error during seeding:', error);
    process.exit(1);
  }
})();
