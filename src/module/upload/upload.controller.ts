import {
  Controller,
  Post,
  UploadedFiles,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/files')
  @UseInterceptors(FilesInterceptor('file'))
  uploadFiles(@UploadedFiles() files) {
    console.log(files);
    return this.uploadService.uploadFiles(files);
  }
}
