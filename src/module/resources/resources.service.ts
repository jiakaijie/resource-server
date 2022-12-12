import { Injectable } from '@nestjs/common';
import {
  resCollection,
  versionsCollections,
  userCollection,
} from '../../dbs/index';
import { jwtVerify } from '../../utils/jwt';

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

  async updateResource(bodyData: UpdateResourceData, req): Promise<any> {
    const Authorization = req.header('Authorization');

    const data: any = await jwtVerify(Authorization);

    const res = await resCollection.findByIdAndUpdate(
      {
        _id: bodyData._id,
      },
      {
        name: bodyData.resourceName,
        desc: bodyData.resourceDesc,
        data: bodyData.data,
        update_time: Date.now(),
        update_user_id: data.id,
      },
    );

    return res;
  }

  async getResourcesList() {
    const resourceList = await resCollection.find();

    const res = [];
    for (let i = 0; i < resourceList.length; i++) {
      const item = resourceList[i].toObject();
      const { version_id, create_user_id, update_user_id } = item;
      const versionObj = await versionsCollections.findOne({
        _id: version_id,
      });
      const createUserObj = await userCollection.findOne({
        _id: create_user_id,
      });
      const updateUserObj = await userCollection.findOne({
        _id: update_user_id,
      });
      console.log(versionObj);
      const currentItem = {
        version: -1,
        create_user: '-',
        update_user: '-',
      };
      if (versionObj) {
        currentItem.version = versionObj.toObject().version;
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
    console.log('res', res);
    return {
      list: res,
      total: res.length,
    };
  }

  async getResourceDetail(query) {
    return await resCollection.findOne({
      _id: query._id,
    });
  }
}
