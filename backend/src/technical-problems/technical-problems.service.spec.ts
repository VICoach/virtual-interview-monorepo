import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalProblemsService } from './technical-problems.service';

describe('TechnicalProblemsService', () => {
  let service: TechnicalProblemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnicalProblemsService],
    }).compile();

    service = module.get<TechnicalProblemsService>(TechnicalProblemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
