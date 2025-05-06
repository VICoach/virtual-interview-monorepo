import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TechnicalProblemsModule } from './technical-problems/technical-problems.module';
import { PistonModule } from './piston/piston.module';
import { InterviewModule } from './interview/interview.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    PistonModule,
    TechnicalProblemsModule,
    InterviewModule,
  ],
})
export class AppModule {}
