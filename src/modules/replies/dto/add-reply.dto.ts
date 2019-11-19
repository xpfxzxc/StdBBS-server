import { Transform } from 'class-transformer';
import { IsInt, MinLength } from 'class-validator';

export class AddReplyDto {
  @MinLength(2)
  content: string;

  @Transform(value => +value)
  @IsInt()
  topicId: number;
}
