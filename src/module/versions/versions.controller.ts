import { Controller, Get, Post, Query } from '@nestjs/common';
import { VersionsService } from './versions.service';

@Controller('versions')
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Post('/create')
  create() {
    return this.versionsService.create({
      resource_id: '123',
      create_user_id: '111',
      data: {
        a: 1,
        b: 'sjdiajsdjaisdjiasjij',
      },
    });
  }

  @Get('/list')
  list(@Query() queryData) {
    return this.versionsService.list(queryData);
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
