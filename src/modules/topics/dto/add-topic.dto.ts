import { IsInt, MinLength } from 'class-validator';

export class AddTopicDto {
  @MinLength(2)
  title: string;

  @MinLength(3)
  body: string;

  @IsInt()
  categoryId: number;
}
