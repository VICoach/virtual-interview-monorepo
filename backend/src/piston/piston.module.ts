import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PistonService } from './piston.service';

@Module({
  imports: [HttpModule],
  providers: [PistonService],
  exports: [PistonService],
})
export class PistonModule {}
