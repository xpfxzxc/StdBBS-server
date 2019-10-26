import { IsEmail } from 'class-validator';

export class CheckIfEmailIsAvailableDto {
  @IsEmail()
  email: string;
}
