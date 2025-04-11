import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Language } from '../enums/language.enum';

export class PistonExecuteDto {
  @IsEnum(Language)
  language: Language;

  @IsString()
  code: string;

  @IsString()
  stdin: string;

  @IsNumber()
  time_limit: number;

  @IsNumber()
  memory_limit: number;
}
