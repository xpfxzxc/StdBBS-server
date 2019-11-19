import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(user: UserEntity, done: Function) {
    done(null, { id: user.id });
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.userService.findById(payload.id);
    done(null, user);
  }
}
