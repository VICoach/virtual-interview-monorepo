import { IsNumber, IsString, IsEnum, IsDefined } from 'class-validator';
import { Language } from '../../piston/enums/language.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RunProblemDto {
  @ApiProperty({
    description: 'Unique identifier of the problem to be executed',
    example: 1,
  })
  @IsNumber()
  @IsDefined()
  problemId: number;

  @ApiProperty({
    description: 'Programming language of the submitted code',
    enum: Language,
    example: Language.JAVASCRIPT,
  })
  @IsDefined()
  @IsEnum(Language)
  language: Language;

  @ApiProperty({
    description: 'Source code to be executed',
    example: 'console.log("Hello World")',
  })
  @IsDefined()
  @IsString()
  code: string;
}
