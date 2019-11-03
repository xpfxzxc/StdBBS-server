import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { CsrfTokenException } from '../exceptions/csrf-token.exception';

@Catch(CsrfTokenException)
export class CsrfTokenExceptionFilter implements ExceptionFilter {
  catch(exception: CsrfTokenException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    res.status(HttpStatus.OK).json({
      code: +exception.error,
      message: `${exception.message}.`,
      timestamp: Date.now(),
    });
  }
}
