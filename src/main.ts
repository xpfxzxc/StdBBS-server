import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as RedisStore from 'connect-redis';
import * as csurf from 'csurf';
import * as session from 'express-session';

import { AppModule } from './app.module';
import { AppService } from './app.service';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { AddTimestampInterceptor } from './common/interceptors/add-timestamp.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);
  const configService = appService.configService;
  const ENV = process.env.NODE_ENV && process.env.NODE_ENV.trim();

  configService.registerHelper('isProduction', () => {
    return configService.get('app.environment') === 'production';
  });

  const redisClient = appService.redisClient;
  const sessionConfig = configService.get('session');
  sessionConfig.store = new (RedisStore(session))({
    client: redisClient,
    ...configService.get('redis-store'),
  });
  app.use(session(sessionConfig));

  app.use(csurf(configService.get('csurf')));
  app.use(function(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
      next(err);
    }

    throw new BadRequestException();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: ENV !== 'dev',
    }),
  );

  app.useGlobalFilters(new BadRequestExceptionFilter());

  app.useGlobalInterceptors(new AddTimestampInterceptor());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get('app.port') || 3000);
}
bootstrap();
