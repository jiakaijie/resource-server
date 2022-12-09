import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}
  @Post('/create')
  createResource(@Body() body) {
    console.log(body);
    return this.resourcesService.createResourceService(body);
  }
  @Get('list')
  getResourcesList() {
    return this.resourcesService.getResourcesList();
  }
}
