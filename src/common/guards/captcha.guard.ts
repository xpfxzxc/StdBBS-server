import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

import { CaptchaService } from '../../services/captcha.service';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(private readonly captchaService: CaptchaService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    if ('captcha' in req.body && this.captchaService.verify(req.body.captcha)) {
      this.captchaService.clear();
      return true;
    }
    throw new BadRequestException();
  }
}
