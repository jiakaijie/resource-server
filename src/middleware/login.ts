import { Injectable, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UserExceptiosn } from '../filters/user';
import { jwtVerify } from '../utils/jwt';

@Injectable()
export class LoginMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const Authorization: string = req.header('Authorization');
    console.log('Authorization', Authorization, typeof Authorization);

    if (!Authorization) {
      throw new UserExceptiosn('Authorization不存在', HttpStatus.UNAUTHORIZED);
    } else {
      const isLogin = await jwtVerify(Authorization);

      if (!isLogin) {
        throw new UserExceptiosn(
          'Authorization异常或者登录失效',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        next();
      }
    }
  }
}
