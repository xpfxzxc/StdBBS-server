import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class SendUserRepliesDto {
  @IsOptional()
  @Transform(value => +value)
  @IsInt()
  page: number;
}
