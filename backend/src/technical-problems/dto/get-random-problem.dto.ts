import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '../enums/difficulty.enum';
import { Tag } from '../enums/tag.enum';

export class GetRandomProblemDto {
  @ApiPropertyOptional({
    description: 'Filter by difficulty level',
    enum: Difficulty,
    example: Difficulty.EASY,
  })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional({
    description: 'Filter by problem tag',
    enum: Tag,
    example: Tag.BINARY_SEARCH,
  })
  @IsOptional()
  @IsEnum(Tag)
  tag?: Tag;
}
