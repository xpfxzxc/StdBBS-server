import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import * as RedisStore from 'connect-redis';
import * as csurf from 'csurf';
import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';

import { AppModule } from './app.module';
import { AppService } from './app.service';
import { CsrfTokenException } from './common/exceptions/csrf-token.exception';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { CsrfTokenExceptionFilter } from './common/filters/csrf-token-exception.filter';
import { ForbiddenExceptionFilter } from './common/filters/forbidden-exception.filter';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorized-exception.filter';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';
import { AddTimestampInterceptor } from './common/interceptors/add-timestamp.interceptor';
import { SessionIoAdapter } from './session-io.adapter';

export let sessionMiddleware;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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

  sessionMiddleware = session(sessionConfig);
  app.use(sessionMiddleware);

  app.useWebSocketAdapter(new SessionIoAdapter(app));

  app.use(csurf(configService.get('csurf')));
  app.use(function(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
      next(err);
    }

    throw new CsrfTokenException();
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: ENV !== 'dev',
    }),
  );

  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalFilters(new CsrfTokenExceptionFilter());
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  app.useGlobalInterceptors(new AddTimestampInterceptor());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get('app.port') || 3000);
}
bootstrap();
