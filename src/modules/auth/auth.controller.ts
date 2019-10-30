import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AuthenticatedGuard } from './authenticated.guard';
import { LoginGuard } from './login.guard';
import { UserEntity } from '../users/user.entity';
import Session from '../../config/session';
import { User } from '../../common/decorators/user.decorator';
import { CaptchaGuard } from '../../common/guards/captcha.guard';
import { JsonResponse } from '../../common/modals/json-response.modal';

@Controller()
export class AuthController {
  @Post('/login')
  @UseGuards(CaptchaGuard, LoginGuard)
  @HttpCode(200)
  login(@User() user: UserEntity) {
    return new JsonResponse({ code: 0, data: { user } });
  }

  @Post('/logout')
  @UseGuards(AuthenticatedGuard)
  @HttpCode(200)
  logout(@Req() req: Request) {
    req.logOut();
    req.session.cookie.maxAge = Session.cookie.maxAge;
    return new JsonResponse({ code: 0 });
  }
}
