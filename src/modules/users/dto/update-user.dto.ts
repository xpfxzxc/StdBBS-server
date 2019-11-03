import { IsOptional, Length, MaxLength, ValidateIf } from 'class-validator';

import { IsEqualTo } from '../../../common/decorators/validators/is-equal-to.decorator';

export class UpdateUserDto {
  @Length(3, 25)
  readonly name: string;

  @ValidateIf(o => o.password !== '')
  @Length(6, 16)
  readonly password: string;

  @ValidateIf(o => o.password !== '')
  @IsEqualTo('password')
  readonly confirmPassword: string;

  @IsOptional()
  @MaxLength(80)
  readonly introduction: string;
}
