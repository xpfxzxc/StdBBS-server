import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { JsonResponse } from '../modals/json-response.modal';

@Injectable()
export class AddTimestampInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<JsonResponse> {
    return next
      .handle()
      .pipe(
        map((res?: JsonResponse | any) =>
          typeof res === 'object'
            ? Object.assign(res, { timestamp: Date.now() })
            : res,
        ),
      );
  }
}
