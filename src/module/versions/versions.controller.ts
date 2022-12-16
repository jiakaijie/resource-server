import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { VersionsService } from './versions.service';

@Controller('versions')
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Post('/create')
  create(@Body() bodyData, @Req() req) {
    return this.versionsService.create(bodyData, req);
  }

  @Get('/list')
  list(@Query() queryData) {
    return this.versionsService.list(queryData);
  }

  @Post('/rollback')
  rollBack(@Body() bodyData, @Req() req) {
    return this.versionsService.rollBack(bodyData, req);
  }

  @Get('/a')
  a() {
    console.log('/a');
    return 'aaaa';
  }

  @Get('/b')
  b() {
    console.log('/b');
    return 'bbbb';
  }
}
