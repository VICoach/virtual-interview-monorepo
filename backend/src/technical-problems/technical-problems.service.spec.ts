import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalProblemsService } from './technical-problems.service';
import { PrismaService } from '../prisma/prisma.service';
import { PistonService } from '../piston/piston.service';
import { NotFoundException } from '@nestjs/common';
import { RunProblemDto } from './dto/run-problem.dto';
import { Language } from './../piston/enums/language.enum';
import { GetRandomProblemDto } from './dto/get-random-problem.dto';
import { Difficulty } from './enums/difficulty.enum';
import { Tag } from './enums/tag.enum';

describe('TechnicalProblemsService', () => {
  let service: TechnicalProblemsService;
  let prisma: PrismaService;
  let piston: PistonService;

  const mockProblem = {
    input: 'test input',
    output: 'expected output',
    time_limit: '2 seconds',
    memory_limit: '512 MB',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnicalProblemsService,
        {
          provide: PrismaService,
          useValue: {
            technicalProblem: {
              findUnique: jest.fn().mockResolvedValue(mockProblem),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: PistonService,
          useValue: {
            executeCode: jest.fn().mockResolvedValue({
              stdout: 'expected output',
              stderr: '',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TechnicalProblemsService>(TechnicalProblemsService);
    prisma = module.get<PrismaService>(PrismaService);
    piston = module.get<PistonService>(PistonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeAndTestSolution', () => {
    const validDto: RunProblemDto = {
      problemId: 1,
      language: Language.JAVASCRIPT,
      code: 'console.log("expected output")',
    };

    it('should return correct result for valid problem', async () => {
      const result = await service.executeAndTestSolution(validDto);

      expect(result.success).toBe(true);
      expect(prisma.technicalProblem.findUnique).toHaveBeenCalledWith({
        where: { problem_id: validDto.problemId },
      });
      expect(piston.executeCode).toHaveBeenCalledWith({
        language: validDto.language,
        code: validDto.code,
        stdin: mockProblem.input,
        time_limit: 2000,
        memory_limit: 536870912,
      });
    });

    it('should throw NotFoundException for invalid problem', async () => {
      jest
        .spyOn(prisma.technicalProblem, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.executeAndTestSolution(validDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle code execution failure', async () => {
      jest
        .spyOn(piston, 'executeCode')
        .mockRejectedValueOnce(new Error('Piston error'));

      await expect(service.executeAndTestSolution(validDto)).rejects.toThrow(
        'Piston error',
      );
    });
  });

  describe('compareOutputs', () => {
    it('should normalize outputs correctly', () => {
      const testCases = [
        { expected: '  hello\nworld  ', actual: 'hello world', result: true },
        { expected: 'hello\r\nworld', actual: 'hello\nworld', result: true },
        { expected: 'hello   world', actual: 'hello world', result: true },
        { expected: 'hello', actual: 'world', result: false },
      ];

      testCases.forEach(({ expected, actual, result }) => {
        expect(service['compareOutputs'](expected, actual)).toBe(result);
      });
    });
  });

  describe('executeCode', () => {
    it('should convert limits correctly', async () => {
      const dto: RunProblemDto = {
        problemId: 1,
        language: Language.PYTHON,
        code: 'print("test")',
      };

      await service['executeCode'](dto, 'input', '3 seconds', '1024 MB');

      expect(piston.executeCode).toHaveBeenCalledWith(
        expect.objectContaining({
          time_limit: 3000,
          memory_limit: 1073741824,
        }),
      );
    });
  });

  describe('getProblemById', () => {
    it('should return the problem when found', async () => {
      const result = await service.getProblemById(1);
      expect(prisma.technicalProblem.findUnique).toHaveBeenCalledWith({
        where: { problem_id: 1 },
      });
      expect(result).toEqual(mockProblem);
    });

    it('should throw NotFoundException when no problem exists', async () => {
      (prisma.technicalProblem.findUnique as jest.Mock).mockResolvedValueOnce(
        null,
      );
      await expect(service.getProblemById(2)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getRandomProblem', () => {
    const candidates = [
      { input: '', output: '', time_limit: '1 seconds', memory_limit: '64 MB' },
      { input: '', output: '', time_limit: '1 seconds', memory_limit: '64 MB' },
    ];

    it('should return a random problem when candidates exist', async () => {
      (prisma.technicalProblem.findMany as jest.Mock).mockResolvedValueOnce(
        candidates,
      );
      const result = await service.getRandomProblem({});
      expect(prisma.technicalProblem.findMany).toHaveBeenCalledWith({
        where: {},
      });
      expect(candidates).toContain(result);
    });

    it('should apply difficulty and tag filters', async () => {
      const filters: GetRandomProblemDto = {
        difficulty: Difficulty.EASY,
        tag: Tag.DP,
      };
      (prisma.technicalProblem.findMany as jest.Mock).mockResolvedValueOnce(
        candidates,
      );
      await service.getRandomProblem(filters);
      expect(prisma.technicalProblem.findMany).toHaveBeenCalledWith({
        where: { difficulty: 'easy', tags: { has: 'dp' } },
      });
    });

    it('should throw NotFoundException when no candidates', async () => {
      (prisma.technicalProblem.findMany as jest.Mock).mockResolvedValueOnce([]);
      await expect(service.getRandomProblem({})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
