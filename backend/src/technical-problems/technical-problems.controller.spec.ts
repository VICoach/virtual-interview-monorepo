import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalProblemsController } from './technical-problems.controller';
import { TechnicalProblemsService } from './technical-problems.service';
import { INestApplication } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CodeExecutionResult } from './interfaces/code-execution-result.interface';

describe('TechnicalProblemsController', () => {
  let controller: TechnicalProblemsController;
  let app: INestApplication;

  const mockResult: CodeExecutionResult = {
    success: true,
    expected_output: 'expected',
    actual_output: 'expected',
    stderr: '',
    execution_time: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicalProblemsController],
      providers: [
        {
          provide: TechnicalProblemsService,
          useValue: {
            executeAndTestSolution: jest.fn().mockResolvedValue(mockResult),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TechnicalProblemsController>(
      TechnicalProblemsController,
    );
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
