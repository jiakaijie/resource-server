import { Controller, Get, Post, Query, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';

import { LoginData } from './user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/list')
  list(@Query() queryData) {
    return this.usersService.list(queryData);
  }

  @Post('/login')
  login(@Body() bodayData: LoginData) {
    return this.usersService.getJwtTokenAndUserInfo(bodayData);
  }

  @Get('/userInfo')
  userInfo(@Req() req) {
    return this.usersService.getUserInfoByModle(req);
  }

  @Post('/update')
  updateUser(@Body() bodyData, @Req() req) {
    return this.usersService.updateUser(bodyData, req);
  }
}
