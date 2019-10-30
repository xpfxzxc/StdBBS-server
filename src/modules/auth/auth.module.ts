import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { CaptchaService } from '../../services/captcha.service';

@Module({
  imports: [PassportModule],
  providers: [AuthService, CaptchaService, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
