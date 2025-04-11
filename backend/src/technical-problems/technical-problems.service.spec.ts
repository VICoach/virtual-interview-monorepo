import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalProblemsService } from './technical-problems.service';
import { PrismaService } from '../prisma/prisma.service';
import { PistonService } from '../piston/piston.service';

describe('TechnicalProblemsService', () => {
  let service: TechnicalProblemsService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
