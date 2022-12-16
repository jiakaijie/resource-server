import { Injectable } from '@nestjs/common';
import { resolve, extname } from 'path';
import { tmpdir } from 'os';
import uuid = require('uuid');
import fs = require('fs-extra');

import { talOssOne } from './../../../ignoreConfig';
import { getYYYYMMDDHH } from './../../utils/time';

@Injectable()
export class UploadService {
  getCdnUrl(files) {
    const defaultDir = resolve(tmpdir(), uuid.v1());
    fs.mkdirSync(defaultDir);
    const time = getYYYYMMDDHH(new Date());

    return new Promise((res, rej) => {
      files.forEach((fileItem) => {
        process.nextTick(async () => {
          const { originalname, buffer } = fileItem;
          const fileExtname = extname(originalname);
          // 此处把uuid4生成的随机给截掉了，容易发生意外，但是可以让文件名称短一点
          const filePath = resolve(
            defaultDir,
            uuid.v4().slice(0, 8) + fileExtname,
          );
          fileItem.filePath = filePath;

          fs.writeFileSync(filePath, buffer);
          console.log('写文件');
          try {
            const { url, type } = await talOssOne({
              filePath,
              uploadTo: time,
            });
            fileItem.fileType = type;
            res({
              url,
              type,
            });
          } catch (err) {
            rej(err);
          }
        });
      });
    });
  }

  async uploadVersionData(data: any): Promise<string> {
    const defaultDir = resolve(tmpdir(), uuid.v1());
    const time = getYYYYMMDDHH(new Date());
    const filePath = resolve(defaultDir, uuid.v4().slice(0, 8) + '.json');

    fs.ensureFileSync(filePath);
    fs.writeJsonSync(filePath, data);
    return new Promise(async (resolve, resject) => {
      try {
        const { url, type } = await talOssOne({
          filePath,
          uploadTo: time,
        });
        fs.emptyDirSync(defaultDir);
        resolve(url);
      } catch (error) {
        resject('');
      }
    });
  }

  async updateVersionData(data: any, oldUrl): Promise<string> {
    const urlList = oldUrl.split('/');
    const urlLength = urlList.length;
    const time = urlList[urlLength - 2];
    const defaultDir = resolve(tmpdir(), uuid.v1());

    const filePath = resolve(defaultDir, urlList[urlLength - 1]);

    fs.ensureFileSync(filePath);
    fs.writeJsonSync(filePath, data);
    return new Promise(async (resolve, resject) => {
      try {
        const { url, type } = await talOssOne({
          filePath,
          uploadTo: time,
        });
        resolve(url);
      } catch (error) {
        resject('');
      }
    });
  }
  async uploadFiles(files) {
    return await this.getCdnUrl(files);
  }
}
