import { Injectable, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  resCollection,
  versionsCollections,
  userCollection,
} from '../../dbs/index';
import { jwtVerify } from '../../utils/jwt';
import { UserExceptiosn } from '../../filters/user';

interface CreateResourceData {
  resourceName: string;
  resourceDesc: string;
  userId: string;
  data: object;
  [propName: string]: any;
}

interface UpdateResourceData extends CreateResourceData {
  _id: string;
}

@Injectable()
export class ResourcesService {
  constructor(private readonly usersService: UsersService) {}
  makeResourceParams(params: CreateResourceData) {
    const { resourceName, resourceDesc, data, userId } = params;
    return {
      name: resourceName,
      desc: resourceDesc,
      data: data,
      create_user_id: userId,
      update_user_id: userId,
      version_id: '',
    };
  }
  async createResourceService(params: CreateResourceData, req) {
    const Authorization = req.header('Authorization');

    const data: any = await jwtVerify(Authorization);

    params.userId = data.id;
    const insertData = this.makeResourceParams(params);
    console.log('insertData', insertData);
    return resCollection.insertMany(insertData);
  }

  async checkUser(resource_id, req) {
    const user: any = await this.usersService.getUserInfoByModle(req);

    const resource: any = await resCollection.findOne({
      _id: resource_id,
    });

    // 超级管理员工或者自己的资源可以操作
    if (!(user.role === 1 || resource.create_user_id === user._id.toString())) {
      throw new UserExceptiosn('无权限', HttpStatus.FORBIDDEN);
    } else {
      return user;
    }
  }

  async updateResource(bodyData: UpdateResourceData, req): Promise<any> {
    const data: any = await this.checkUser(bodyData._id, req);

    const res = await resCollection.findByIdAndUpdate(
      {
        _id: bodyData._id,
      },
      {
        name: bodyData.resourceName,
        desc: bodyData.resourceDesc,
        data: bodyData.data,
        update_time: Date.now(),
        update_user_id: data._id,
      },
    );

    return res;
  }

  async getResourcesList(queryData) {
    let {
      page = 1,
      page_size = 10,
      _id,
      name,
      create_user_id,
      update_user_id,
    } = queryData;
    page = +page;
    page_size = +page_size;

    const findData: any = {};
    _id && (findData._id = _id);
    name && (findData.name = name);
    create_user_id && (findData.create_user_id = create_user_id);
    update_user_id && (findData.update_user_id = update_user_id);

    const skipNum = (page - 1) * page_size;

    let resourceList = [];

    try {
      resourceList = await resCollection
        .find(findData)
        .sort({ create_time: -1 })
        .skip(skipNum)
        .limit(page_size);
    } catch (error) {
      resourceList = [];
    }

    // console.log("findData-+++++++++++", findData);
    // console.log('resourceList----------', resourceList);
    let total = 0;
    try {
      total = await resCollection.find(findData).count();
    } catch (error) {
      total = 0;
    }

    const res = [];
    for (let i = 0; i < resourceList.length; i++) {
      const item = resourceList[i].toObject();
      const { version_id, create_user_id, update_user_id } = item;

      let versionObj = null;
      let createUserObj = null;
      let updateUserObj = null;

      try {
        versionObj = await versionsCollections.findOne({
          _id: version_id,
        });
      } catch (error) {
        versionObj = null;
      }

      try {
        createUserObj = await userCollection.findOne({
          _id: create_user_id,
        });
      } catch (error) {
        createUserObj = null;
      }

      try {
        updateUserObj = await userCollection.findOne({
          _id: update_user_id,
        });
      } catch (error) {
        updateUserObj = null;
      }

      const currentItem = {
        num: -1,
        create_user: '-',
        update_user: '-',
      };
      if (versionObj) {
        currentItem.num = versionObj.toObject().num;
      }
      if (createUserObj) {
        const currentobj = createUserObj.toObject();
        const { name, workcode } = currentobj;
        currentItem.create_user = `${name}（${workcode}）`;
      }
      if (updateUserObj) {
        const currentobj = updateUserObj.toObject();
        const { name, workcode } = currentobj;
        currentItem.update_user = `${name}（${workcode}）`;
      }

      res.push({ ...item, ...currentItem });
    }
    return {
      list: res,
      total,
    };
  }

  async getResourceDetail(query) {
    return await resCollection.findOne({
      _id: query._id,
    });
  }

  async getVersionDetail(query) {
    const { resource_id } = query;

    let resData = {
      currentVersion: {
        num: null,
        desc: null,
      },
      highVersion: {
        num: null,
        desc: null,
      },
    };

    try {
      const resourceObj = await resCollection.findOne({
        _id: resource_id,
      });

      if (!resourceObj.version_id) {
        return resData;
      }

      const curtVersion = await versionsCollections.findOne({
        _id: resourceObj.version_id,
      });

      const versionList = await versionsCollections
        .find({
          resource_id,
        })
        .sort({ num: -1 });

      let highVersion: any = {};
      if (versionList && versionList.length) {
        highVersion = versionList[0];
      } else {
        highVersion = {};
      }

      resData = {
        currentVersion: {
          num: curtVersion.num,
          desc: curtVersion.desc,
        },
        highVersion: {
          num: highVersion.num,
          desc: highVersion.desc,
        },
      };
    } catch (err) {
      console.log(err);
    }
    return resData;
  }
}
