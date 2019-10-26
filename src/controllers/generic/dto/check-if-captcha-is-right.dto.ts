import { Length } from 'class-validator';

export class CheckIfCaptchaIsRightDto {
  @Length(6, 6)
  captcha: string;
}
