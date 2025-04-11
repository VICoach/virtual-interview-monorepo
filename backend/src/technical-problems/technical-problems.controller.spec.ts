import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalProblemsController } from './technical-problems.controller';
import { TechnicalProblemsService } from './technical-problems.service';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CodeExecutionResult } from './interfaces/code-execution-result.interface';
import * as request from 'supertest';
import { RunProblemDto } from './dto/run-problem.dto';
import { Language } from '../piston/enums/language.enum';
import * as http from 'http';

describe('TechnicalProblemsController', () => {
  let controller: TechnicalProblemsController;
  let service: TechnicalProblemsService;
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
    service = module.get<TechnicalProblemsService>(TechnicalProblemsService);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('POST /problems/run', () => {
    const validDto: RunProblemDto = {
      problemId: 1,
      language: Language.JAVASCRIPT,
      code: 'console.log("hello")',
    };

    it('should return 201 with execution result', async () => {
      const response = await request(app.getHttpServer() as http.Server)
        .post('/problems/run')
        .send(validDto)
        .expect(201);

      expect(response.body).toEqual(mockResult);
      expect(service.executeAndTestSolution).toHaveBeenCalledWith(validDto);
    });

    it('should return 404 when problem not found', async () => {
      (service.executeAndTestSolution as jest.Mock).mockRejectedValueOnce(
        new NotFoundException('Problem not found'),
      );

      await request(app.getHttpServer() as http.Server)
        .post('/problems/run')
        .send(validDto)
        .expect(404);
    });

    it('should return 500 on execution failure', async () => {
      (service.executeAndTestSolution as jest.Mock).mockRejectedValueOnce(
        new Error('Execution failed'),
      );

      await request(app.getHttpServer() as http.Server)
        .post('/problems/run')
        .send(validDto)
        .expect(500);
    });
  });
});
