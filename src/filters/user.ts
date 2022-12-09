import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExceptiosn extends HttpException {
  constructor(msg: string, code: number) {
    super({ code, msg }, HttpStatus.OK);
  }
}
