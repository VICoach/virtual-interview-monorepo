import { Module } from '@nestjs/common';
import { PistonModule } from '../piston/piston.module';
import { TechnicalProblemsService } from './technical-problems.service';
import { TechnicalProblemsController } from './technical-problems.controller';

@Module({
  imports: [PistonModule],
  controllers: [TechnicalProblemsController],
  providers: [TechnicalProblemsService],
})
export class TechnicalProblemsModule {}
