import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UserEntity } from '../user.entity';

@Injectable()
export class UserUpdateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const currentUser = req.user as UserEntity;
    const userId = +req.params['id'];
    return currentUser.id === userId;
  }
}
