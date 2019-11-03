import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CaptchaService } from '../../services/captcha.service';
import { FileService } from '../../services/file.service';
import { ImageService } from '../../services/image.service';
import { UploadService } from '../../services/upload.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    CaptchaService,
    FileService,
    ImageService,
    UploadService,
    UsersService,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
