import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CaptchaService } from '../../services/captcha.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, CaptchaService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
