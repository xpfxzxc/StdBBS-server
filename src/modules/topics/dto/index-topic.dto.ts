import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class IndexTopicDto {
  @IsOptional()
  @Transform(value => +value)
  @IsInt()
  categoryId: number;

  @IsOptional()
  @Transform(value => +value)
  @IsInt()
  page: number;

  @IsOptional()
  order: string;

  @IsOptional()
  @Transform(value => +value)
  @IsInt()
  userId: number;
}
