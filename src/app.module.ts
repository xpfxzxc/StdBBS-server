import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { RedisModule } from 'nestjs-redis';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validatorProviders } from './common/decorators/validators';
import { CheckController } from './controllers/generic/check.controller';
import { UsersModule } from './modules/users/users.module';
import { CaptchaService } from './services/captcha.service';

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.trim();

@Module({
  imports: [
    ConfigModule.load(path.join(__dirname, 'config/**/!(*.d).{ts,js}'), {
      path: path.join(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
    }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => ConfigService.get('redis'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController, CheckController],
  providers: [AppService, CaptchaService, ...validatorProviders],
})
export class AppModule {}
