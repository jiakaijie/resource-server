import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor {
  constructor() {
    // console.log('LoggingInterceptor');
  }
  intercept(context, next) {
    // console.log('login Before...');

    return next.handle().pipe(
      tap(() => {
        // console.log(`login...`);
        // console.log(123);
      }),
    );
  }
}
