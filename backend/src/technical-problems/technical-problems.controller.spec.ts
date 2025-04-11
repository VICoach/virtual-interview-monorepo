import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalProblemsController } from './technical-problems.controller';
import { TechnicalProblemsService } from './technical-problems.service';

describe('TechnicalProblemsController', () => {
  let controller: TechnicalProblemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicalProblemsController],
      providers: [TechnicalProblemsService],
    }).compile();

    controller = module.get<TechnicalProblemsController>(TechnicalProblemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
