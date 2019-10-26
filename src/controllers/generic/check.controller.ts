import { Controller, Get, Query } from '@nestjs/common';

import { CheckIfCaptchaIsRightDto } from './dto/check-if-captcha-is-right.dto';
import { CheckIfEmailIsAvailableDto } from './dto/check-if-email-is-available.dto';
import { JsonResponse } from '../../common/modals/json-response.modal';
import { UsersService } from '../../modules/users/users.service';
import { CaptchaService } from '../../services/captcha.service';

@Controller('generic/check')
export class CheckController {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly userService: UsersService,
  ) {}

  @Get('email')
  async checkIfEmailIsAvailable(@Query()
  {
    email,
  }: CheckIfEmailIsAvailableDto) {
    return new JsonResponse(
      !(await this.userService.checkIfEmailExists(email))
        ? { code: 0 }
        : { code: 101, message: '该 E-Mail 地址已被注册' },
    );
  }

  @Get('captcha')
  async checkIfCaptchaIsRight(@Query()
  {
    captcha,
  }: CheckIfCaptchaIsRightDto) {
    return new JsonResponse(
      this.captchaService.verify(captcha)
        ? { code: 0 }
        : { code: 102, message: '该验证码不正确' },
    );
  }
}
