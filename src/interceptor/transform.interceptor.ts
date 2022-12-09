import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor() {
    // console.log('NestInterceptor');
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    // console.log('NestInterceptor Before...');
    const http = context.switchToHttp();
    const response = http.getResponse();
    response.header(
      'Cache-Control',
      'no-cache, no-store, max-age=0, must-revalidate, value',
    );
    return next.handle().pipe(
      map((data: any) => {
        // console.log('NestInterceptor...');
        const msg = data.msg || 'success';
        delete data.msg;

        return {
          data,
          code: 200,
          msg,
        };
      }),
    );
  }
}
