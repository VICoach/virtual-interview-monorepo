import { Controller, Post, Body } from '@nestjs/common';
import { RunProblemDto } from './dto/run-problem.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { TechnicalProblemsService } from './technical-problems.service';
import { CodeExecutionResult } from './interfaces/code-execution-result.interface';

@ApiTags('Technical Problems')
@Controller('problems')
export class TechnicalProblemsController {
  constructor(private readonly problemsService: TechnicalProblemsService) {}

  @Post('run')
  @ApiOperation({
    summary: 'Execute and validate a technical problem solution',
    description:
      'Submits a code solution for validation against a technical problem given test cases',
  })
  @ApiBody({ type: RunProblemDto })
  @ApiResponse({
    status: 201,
    description: 'Code execution and validation results',
    type: CodeExecutionResult,
  })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 404, description: 'Problem not found' })
  @ApiResponse({ status: 500, description: 'Code execution failed' })
  async runProblem(
    @Body() runProblemDto: RunProblemDto,
  ): Promise<CodeExecutionResult> {
    return this.problemsService.executeAndTestSolution(runProblemDto);
  }
}
