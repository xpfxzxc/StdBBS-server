import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.trim();

@Module({
  imports: [
    ConfigModule.load(path.join(__dirname, 'config/**/!(*.d).{ts,js}'), {
      path: path.join(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
