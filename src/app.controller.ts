import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from 'nestjs-config';

import { CaptchaService } from './services/captcha.service';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Get('captcha')
  sendCaptcha() {
    const captcha = this.captchaService.create();
    return { code: 0, data: { captcha } };
  }

  @Get('xsrftoken')
  sendXSRFToken(@Req() req: Request, @Res() res: Response) {
    const appName = this.configService.get('app.name');
    res
      .cookie(`${appName}-XSRF-TOKEN`, req.csrfToken(), {
        secure: this.configService.isProduction(),
        sameSite: true,
      })
      .json({ code: 0, timestamp: Date.now() });
  }
}
