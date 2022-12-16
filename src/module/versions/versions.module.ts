import { Module } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { UsersService } from '../users/users.service';
import { UploadService } from '../upload/upload.service';
import { VersionsController } from './versions.controller';

@Module({
  controllers: [VersionsController],
  providers: [VersionsService, UsersService, UploadService],
})
export class VersionsModule {}
