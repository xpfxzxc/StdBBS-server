import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class SendUserTopicsDto {
  @IsOptional()
  @Transform(value => +value)
  @IsInt()
  page: number;
}
