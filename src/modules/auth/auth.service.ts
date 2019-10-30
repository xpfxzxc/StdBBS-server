import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findOneUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return user;
    }
    return null;
  }
}
