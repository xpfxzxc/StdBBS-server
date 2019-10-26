import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ConfigService } from 'nestjs-config';

import * as svgCaptcha from 'svg-captcha';

@Injectable({ scope: Scope.REQUEST })
export class CaptchaService {
  private options: Object;

  constructor(
    configService: ConfigService,
    @Inject(REQUEST) private readonly req: Request,
  ) {
    this.options = configService.get('captcha');
  }

  create(): string {
    const captcha = svgCaptcha.create(this.options);
    this.req.session.captcha = captcha.text;
    return captcha.data;
  }

  clear(): void {
    delete this.req.session.captcha;
  }

  verify(captcha: string): boolean {
    return (
      'captcha' in this.req.session &&
      captcha.toLocaleLowerCase() ===
        this.req.session.captcha.toLocaleLowerCase()
    );
  }
}
