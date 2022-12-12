import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  uploadFiles(files) {
    console.log('uploadFiles', files);
    return '1244';
  }
}
