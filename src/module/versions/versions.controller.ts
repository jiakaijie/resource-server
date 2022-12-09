import { Controller, Get } from '@nestjs/common';
import { VersionsService } from './versions.service';

@Controller('versions')
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Get('/')
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
  list() {
    return this.versionsService.list();
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
