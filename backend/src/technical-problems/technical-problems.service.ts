import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PistonService } from '../piston/piston.service';
import { RunProblemDto } from './dto/run-problem.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CodeExecutionResult } from './interfaces/code-execution-result.interface';
import { GetRandomProblemDto } from './dto/get-random-problem.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TechnicalProblemsService {
  private readonly logger = new Logger(TechnicalProblemsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pistonService: PistonService,
  ) {}

  async getProblemById(id: number) {
    const problem = await this.prisma.technicalProblem.findUnique({
      where: { problem_id: id },
    });
    if (!problem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }
    return problem;
  }

  async getRandomProblem(filters: GetRandomProblemDto) {
    const where: Prisma.TechnicalProblemWhereInput = {};
    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }
    if (filters.tag) {
      where.tags = { has: filters.tag };
    }

    const candidates = await this.prisma.technicalProblem.findMany({ where });
    if (candidates.length === 0) {
      throw new NotFoundException('No problems match the given filters');
    }
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    return random;
  }

  async executeAndTestSolution(
    dto: RunProblemDto,
  ): Promise<CodeExecutionResult> {
    try {
      const problem = await this.getProblemById(dto.problemId);
      const { stdout, stderr, executionTime } = await this.executeCode(
        dto,
        problem.input,
        problem.time_limit,
        problem.memory_limit,
      );

      const isCorrect = this.compareOutputs(problem.output, stdout);

      return {
        success: isCorrect,
        expected_output: problem.output,
        actual_output: stdout,
        stderr,
        execution_time: executionTime,
      };
    } catch (error) {
      this.logger.error('Error executing solution');
      throw error;
    }
  }

  private async executeCode(
    dto: RunProblemDto,
    stdin: string,
    time_limit: string,
    memory_limit: string,
  ) {
    const startTime = Date.now();

    try {
      const result = await this.pistonService.executeCode({
        language: dto.language,
        code: dto.code,
        stdin,
        time_limit: parseInt(time_limit.split(' ')[0], 10) * 1000, // convert from seconds to milliseconds
        memory_limit: parseInt(memory_limit.split(' ')[0], 10) * 1048576, // convert from MB to bytes
      });

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error('Code execution failed');
      throw error;
    }
  }

  private compareOutputs(expected: string, actual: string): boolean {
    if (!expected || !actual) return false;
    return this.normalizeOutput(expected) === this.normalizeOutput(actual);
  }

  private normalizeOutput(output: string): string {
    return output.trim().replace(/\s+/g, ' ').replace(/\r\n/g, '\n');
  }
}
