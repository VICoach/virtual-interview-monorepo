import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  language: string;

  @Type(() => Number)
  @IsInt()
  duration: number;

  @IsString()
  difficultyLevel: string;

  @IsString()
  programmingLanguage: string;

  @IsString()
  educationLevel: string;

  @IsString()
  jobTitle: string;

  @IsString()
  experienceLevel: string;
}