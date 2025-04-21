import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RunProblemDto } from './dto/run-problem.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TechnicalProblemsService } from './technical-problems.service';
import { CodeExecutionResult } from './interfaces/code-execution-result.interface';
import { JwtAuthGuard } from '../auth/auth.guard';
import { GetRandomProblemDto } from './dto/get-random-problem.dto';

@ApiTags('Technical Problems')
@Controller('problems')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TechnicalProblemsController {
  constructor(private readonly problemsService: TechnicalProblemsService) {}

  @Get('random')
  @ApiOperation({ summary: 'Get a random problem, optional filters' })
  @ApiQuery({ name: 'difficulty', required: false, type: String })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'A random problem matching filters',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'No matching problems found' })
  async getRandomProblem(@Query() query: GetRandomProblemDto) {
    return this.problemsService.getRandomProblem(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a problem by its ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'The problem', type: Object })
  @ApiResponse({ status: 404, description: 'Problem not found' })
  async getProblemById(@Param('id', ParseIntPipe) id: number) {
    return this.problemsService.getProblemById(id);
  }

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
