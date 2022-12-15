import { Injectable } from '@nestjs/common';
import { versionsCollections } from '../../dbs/index';
import { UsersService } from '../users/users.service';
import { userCollection } from '../../dbs/index';

interface CreateData {
  resource_id: string;
  data: any;
  create_user_id: string;
  [propName: string]: any;
}

@Injectable()
export class VersionsService {
  constructor(private readonly userSerivice: UsersService) {}
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

  async list(queryData) {
    let { page = 1, page_size = 10, resource_id, is_online_version } = queryData;

    page = +page;
    page_size = +page_size;

    const findData: any = {};
    resource_id && (findData.resource_id = resource_id);
    if (is_online_version !== undefined) {
      findData.is_online_version = +is_online_version;
    }

    const skipNum = (page - 1) * page_size;
    const versions = await versionsCollections
      .find(findData)
      .sort({ create_time: -1 })
      .skip(skipNum)
      .limit(page_size);

    const list = [];
    for (let i = 0; i < versions.length; i++) {
      const versionItem = versions[i].toObject();

      let user = null;

      try {
        user = await this.userSerivice.modleFindOne({
          _id: versionItem.create_user_id,
        });
      } catch (error) {
        user = null;
      }

      const create_user = user ? `${user.name}（${user.workcode}）` : '-';
      list.push({
        create_user,
        ...versionItem,
      });
    }
    const total = await versionsCollections.find(findData).count();

    return {
      list,
      total,
    };
  }
}
