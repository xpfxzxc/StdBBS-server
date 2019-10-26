import { IsEmail, Length } from 'class-validator';

import { IsEqualTo } from '../../../common/decorators/validators/is-equal-to.decorator';
import { IsEmailRegistered } from '../../../common/decorators/validators/is-email-registered.decorator';

export class AddUserDto {
  @Length(3, 25)
  readonly name: string;

  @IsEmail()
  @IsEmailRegistered(false)
  readonly email: string;

  @Length(6, 16)
  readonly password: string;

  @IsEqualTo('password')
  readonly confirmPassword: string;
}
