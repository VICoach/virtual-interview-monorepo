import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalProblemsService } from './technical-problems.service';
import { PrismaService } from '../prisma/prisma.service';
import { PistonService } from '../piston/piston.service';
import { NotFoundException } from '@nestjs/common';
import { RunProblemDto } from './dto/run-problem.dto';
import { Language } from './../piston/enums/language.enum';

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
        select: {
          input: true,
          output: true,
          time_limit: true,
          memory_limit: true,
        },
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
});
