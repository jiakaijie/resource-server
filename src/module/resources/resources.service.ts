import { Injectable } from '@nestjs/common';
import { resCollection, userCollection } from '../../dbs/index';

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
    console.log(resourceList);
    return resourceList;
  }
}
