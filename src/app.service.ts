import { Injectable } from '@nestjs/common';
import { userCollection } from './dbs/index';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    console.log('userCollection', userCollection);
    // await userCollection.insertMany({
    //   name: 'guoshuang',
    //   age: 20,
    // });
    const list = await userCollection.find();
    console.log('list', list);
    return list;
  }
}
