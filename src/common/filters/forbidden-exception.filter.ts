import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    res.status(HttpStatus.OK).json({
      code: -403,
      message: 'Forbidden error.',
      timestamp: Date.now(),
    });
  }
}
