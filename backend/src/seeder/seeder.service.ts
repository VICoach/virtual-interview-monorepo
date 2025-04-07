import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

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

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    await this.clearDatabase();

    const dataDir = join(__dirname, '/data');
    const files = readdirSync(dataDir).filter((file) => file.endsWith('.json'));

    for (const file of files) {
      const filePath = join(dataDir, file);
      const data = JSON.parse(readFileSync(filePath, 'utf-8')) as {
        problem: ProblemData;
        solution: SolutionData;
      };

      await this.createProblem(data.problem, data.solution);
    }
  }

  private async clearDatabase() {
    await this.prisma.technicalSolution.deleteMany();
    await this.prisma.technicalProblem.deleteMany();
  }

  private async createProblem(
    problemData: ProblemData,
    solutionData: SolutionData,
  ) {
    const problem = await this.prisma.technicalProblem.create({
      data: {
        title: problemData.title,
        time_limit: problemData.time_limit,
        memory_limit: problemData.memory_limit,
        description: problemData.description,
        input_specification: problemData.input_specification,
        output_specification: problemData.output_specification,
        difficulty: problemData.difficulty,
        tags: problemData.tags,
        input: problemData.examples[0]?.input || '',
        output: problemData.examples[0]?.output || '',
      },
    });

    await this.prisma.technicalSolution.create({
      data: {
        solution_description: solutionData.description,
        solution_code: solutionData.code,
        problem_id: problem.problem_id,
      },
    });
  }
}
