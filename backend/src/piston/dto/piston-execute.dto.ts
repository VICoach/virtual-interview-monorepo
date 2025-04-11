import { IsEnum, IsString } from 'class-validator';
import { Language } from '../enums/language.enum';

export class PistonExecuteDto {
  @IsEnum(Language)
  language: Language;

  @IsString()
  code: string;

  @IsString()
  stdin: string;
}
