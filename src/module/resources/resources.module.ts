import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { UsersService } from '../users/users.service';
import { ResourcesController } from './resources.controller';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService, UsersService],
})
export class ResourcesModule {}
