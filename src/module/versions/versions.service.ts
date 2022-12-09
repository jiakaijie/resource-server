import { Injectable } from '@nestjs/common';
import { versionsCollections } from '../../dbs/index';

interface CreateData {
  resource_id: string;
  data: any;
  create_user_id: string;
  [propName: string]: any;
}

@Injectable()
export class VersionsService {
  async modelFind(data) {
    return await versionsCollections.find(data).sort({
      version: -1,
    });
  }

  async modelInsert(data) {
    return await versionsCollections.insertMany(data);
  }

  async create(data: CreateData) {
    const { resource_id } = data;

    const oldList = await this.modelFind({
      resource_id,
    });

    const inserData = {
      ...data,
      version: 1,
    };

    if (oldList && oldList.length) {
      inserData.version = oldList[0].version + 1;
    }

    const res = await versionsCollections.insertMany(inserData);

    return res;
  }

  async list() {
    return await versionsCollections.find();
  }
}
