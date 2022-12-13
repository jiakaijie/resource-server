import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}
  @Post('/create')
  createResource(@Body() body, @Req() req) {
    console.log(body);
    return this.resourcesService.createResourceService(body, req);
  }

  @Post('/update')
  updateResource(@Body() body, @Req() req): any {
    return this.resourcesService.updateResource(body, req);
  }

  @Get('/list')
  getResourcesList(@Query() queryData) {
    return this.resourcesService.getResourcesList(queryData);
  }

  @Get('/detail')
  getResourceDetail(@Query() query) {
    return this.resourcesService.getResourceDetail(query);
  }
}
