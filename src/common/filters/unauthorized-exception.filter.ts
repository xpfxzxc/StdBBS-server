import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    res
      .status(HttpStatus.OK)
      .json({
        code: -401,
        message: 'Authentication failed.',
        timestamp: Date.now(),
      });
  }
}
