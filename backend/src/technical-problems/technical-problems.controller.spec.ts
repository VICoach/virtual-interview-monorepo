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
            getProblemById: jest.fn().mockResolvedValue({ id: 1, foo: 'bar' }),
            getRandomProblem: jest
              .fn()
              .mockResolvedValue({ id: 2, foo: 'baz' }),
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

  describe('GET /problems/:id', () => {
    it('should return 200 with the problem', async () => {
      const mockProblem = { id: 1, foo: 'bar' };
      (service.getProblemById as jest.Mock).mockResolvedValueOnce(mockProblem);

      const res = await request(app.getHttpServer() as http.Server)
        .get('/problems/1')
        .expect(200);

      expect(res.body).toEqual(mockProblem);
      expect(service.getProblemById).toHaveBeenCalledWith(1);
    });

    it('should return 404 when problem not found', async () => {
      (service.getProblemById as jest.Mock).mockRejectedValueOnce(
        new NotFoundException(),
      );
      await request(app.getHttpServer() as http.Server)
        .get('/problems/999')
        .expect(404);
    });
  });

  describe('GET /problems/random', () => {
    it('should return 200 with a random problem', async () => {
      const mockRand = { id: 2, foo: 'baz' };
      (service.getRandomProblem as jest.Mock).mockResolvedValueOnce(mockRand);

      const res = await request(app.getHttpServer() as http.Server)
        .get('/problems/random?difficulty=hard&tag=graph')
        .expect(200);

      expect(res.body).toEqual(mockRand);
      expect(service.getRandomProblem).toHaveBeenCalledWith({
        difficulty: 'hard',
        tag: 'graph',
      });
    });

    it('should return 404 when no matching problems', async () => {
      (service.getRandomProblem as jest.Mock).mockRejectedValueOnce(
        new NotFoundException(),
      );
      await request(app.getHttpServer() as http.Server)
        .get('/problems/random')
        .expect(404);
    });
  });
});
