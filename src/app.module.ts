import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { RedisModule } from 'nestjs-redis';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validatorProviders } from './common/decorators/validators';
import { CheckController } from './controllers/generic/check.controller';
import { UploadsController } from './controllers/uploads.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RepliesModule } from './modules/replies/replies.module';
import { TopicsModule } from './modules/topics/topics.module';
import { UsersModule } from './modules/users/users.module';
import { CaptchaService } from './services/captcha.service';
import { FileService } from './services/file.service';
import { ImageService } from './services/image.service';
import { UploadService } from './services/upload.service';

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.trim();

@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    ConfigModule.load(path.join(__dirname, 'config/**/!(*.d).{ts,js}'), {
      path: path.join(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
    }),
    NotificationsModule,
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => ConfigService.get('redis'),
      inject: [ConfigService],
    }),
    RepliesModule,
    TopicsModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController, CheckController, UploadsController],
  providers: [
    AppService,
    CaptchaService,
    FileService,
    ImageService,
    UploadService,
    ...validatorProviders,
  ],
})
export class AppModule {}
