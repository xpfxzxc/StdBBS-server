import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export class LoginGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const req = context.switchToHttp().getRequest<Request>();
    req.session.cookie.maxAge = 86400 * 1000;
    await super.logIn(req);
    return result;
  }
}
