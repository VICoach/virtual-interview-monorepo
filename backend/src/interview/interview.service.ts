import { Injectable } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InterviewMode } from '@prisma/client';

@Injectable()
export class InterviewService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  async create(createInterviewDto: CreateInterviewDto, userId: number, interviewMode: InterviewMode) {
    const { duration, language } = createInterviewDto;

    return await this.prismaService.$transaction(async (tx) => {
      const config = await tx.interviewConfiguration.create({
        data: {
          interview_mode: interviewMode,
          duration,
          language,
        },
      });

      const session = await tx.interviewSession.create({
        data: {
          config_id: config.config_id,
          user_id: userId,
          start_time: new Date(),
        },
      });

      return { config, session };
    });
  }

  findAll() {
    return `This action returns all interview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interview`;
  }

  update(id: number, updateInterviewDto: UpdateInterviewDto) {
    return `This action updates a #${id} interview`;
  }

  remove(id: number) {
    return `This action removes a #${id} interview`;
  }
}
