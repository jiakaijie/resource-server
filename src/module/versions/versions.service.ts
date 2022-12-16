import { Injectable } from '@nestjs/common';
import {
  versionsCollections,
  userCollection,
  resCollection,
} from '../../dbs/index';
import { UsersService } from '../users/users.service';
import { UploadService } from '../upload/upload.service';
import { ResourcesService } from '../resources/resources.service';

import { jwtVerify } from '../../utils/jwt';
import versionCollection from 'src/dbs/versionsCollection';

interface CreateData {
  resource_id: string;
  data: any;
  create_user_id: string;
  [propName: string]: any;
}

@Injectable()
export class VersionsService {
  constructor(
    private readonly userSerivice: UsersService,
    private readonly uploadService: UploadService,
    private readonly resourcesService: ResourcesService,
  ) {}
  async modelFind(data) {
    return await versionsCollections.find(data).sort({
      num: -1,
    });
  }

  async modelInsert(data) {
    return await versionsCollections.insertMany(data);
  }

  async create(bodyData: CreateData, req) {
    const { resource_id, data, desc } = bodyData;

    await this.resourcesService.checkUser(resource_id, req);

    const Authorization = req.header('Authorization');

    const jwtData: any = await jwtVerify(Authorization);

    try {
      const resourceObj = await resCollection.findOne({
        _id: resource_id,
      });

      let url = resourceObj.url;

      let insertData: any = {};

      if (!resourceObj.version_id) {
        url = await this.uploadService.uploadVersionData(data);

        insertData = {
          num: 1,
          resource_id,
          desc,
          create_user_id: jwtData.id,
          is_online_version: 1,
          data,
        };
      } else {
        url = await this.uploadService.updateVersionData(data, url);
        const oldList = await this.modelFind({
          resource_id,
        });

        insertData = {
          num: oldList[0].num + 1,
          resource_id,
          create_user_id: jwtData.id,
          is_online_version: 1,
          desc,
          data,
        };

        await versionsCollections.findOneAndUpdate(
          {
            resource_id,
            is_online_version: 1,
          },
          {
            is_online_version: 0,
          },
        );
      }

      const newVersionList = await this.modelInsert(insertData);

      const aaa = await resCollection.findOneAndUpdate(
        {
          _id: resource_id,
        },
        {
          url,
          version_id: newVersionList[0]._id,
        },
      );

      return {
        isSuccess: true,
      };
    } catch (err) {
      console.error(err);
      return {
        isSuccess: false,
      };
    }
  }

  async rollBack(bodyData, req) {
    const { version_id } = bodyData;

    try {
      // 找将要上线版本
      const publushVersion = await versionCollection.findOne({
        _id: version_id,
      });

      await this.resourcesService.checkUser(publushVersion.resource_id, req);

      // 将上线的版本切换为下线
      await versionCollection.findOneAndUpdate(
        {
          resource_id: publushVersion.resource_id,
          is_online_version: 1,
        },
        {
          is_online_version: 0,
        },
      );

      // 找资源并且更新版本号
      const resource = await resCollection.findOneAndUpdate(
        {
          _id: publushVersion.resource_id,
        },
        {
          version_id: publushVersion._id,
        },
      );

      // 发布数据
      const url = await this.uploadService.updateVersionData(
        publushVersion.data,
        resource.url,
      );

      await versionCollection.findOneAndUpdate(
        {
          _id: version_id,
        },
        {
          is_online_version: 1,
        },
      );

      return {
        isSuccess: true,
      };
    } catch (error) {
      return {
        isSuccess: false,
      };
    }
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
