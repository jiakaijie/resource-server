import { Injectable } from '@nestjs/common';
import {
  resCollection,
  versionsCollections,
  userCollection,
} from '../../dbs/index';

interface CreateResourceData {
  resourceName: string;
  resourceDesc: string;
  data: object;
}

@Injectable()
export class ResourcesService {
  makeResourceParams(params: CreateResourceData) {
    const { resourceName, resourceDesc, data } = params;
    return {
      name: resourceName,
      desc: resourceDesc,
      data: data,
      create_user_id: 1,
      update_user_id: 1,
      version_id: 0,
    };
  }
  createResourceService(params: CreateResourceData) {
    const insertData = this.makeResourceParams(params);
    console.log('insertData', insertData);
    return resCollection.insertMany(insertData);
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
        currentItem.create_user = `${name}(${workcode})`;
      }
      if (updateUserObj) {
        const currentobj = updateUserObj.toObject();
        const { name, workcode } = currentobj;
        currentItem.update_user = `${name}(${workcode})`;
      }

      res.push({ ...item, ...currentItem });
    }
    console.log('res', res);
    return {
      list: res,
      total: res.length,
    };
  }
}
