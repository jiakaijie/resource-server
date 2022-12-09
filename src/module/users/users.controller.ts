import { Controller, Get, Post, Query, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';

import { LoginData } from './user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/list')
  list() {
    return this.usersService.list();
  }

  @Post('/login')
  login(@Body() bodayData: LoginData) {
    return this.usersService.getJwtTokenAndUserInfo(bodayData);
  }

  @Get('/userInfo')
  userInfo(@Req() req) {
    return this.usersService.getUserInfoByModle(req);
  }
}
