import { Injectable } from '@nestjs/common';
import { userCollection } from '../../dbs/index';
import { http } from '../../utils/http';

import { LoginData, TicketRes } from './user.type';
import { jwtSign, jwtVerify } from '../../utils/jwt';
import { ticketConfig, userInfoConfig } from '../../../ignoreConfig';

interface CreateData {
  name: string;
  workcode: string;
}

@Injectable()
export class UsersService {
  async modelFind(data) {
    return await userCollection.find(data);
  }

  async modelInsert(data) {
    const user = await userCollection.insertMany(data);
    return user[0].toObject();
  }

  async create(data: CreateData) {
    const user = await userCollection.findOne({
      workcode: data.workcode,
    });
    console.log('user------', user);

    if (!user) {
      return await this.modelInsert(data);
    }

    return user.toObject();
  }

  async list(queryData) {
    let { page = 1, page_size = 10, name, email, workcode } = queryData;

    page = +page;
    page_size = +page_size;

    const findData: any = {};

    name && (findData.name = name);
    email && (findData.email = email);
    workcode && (findData.workcode = workcode);

    const skipNum = (page - 1) * page_size;
    const list = await userCollection
      .find(findData)
      .sort({ create_time: -1 })
      .skip(skipNum)
      .limit(page_size);

    const total = await userCollection.find(queryData).count();
    return {
      list,
      total,
    };
  }

  async allList() {
    return await userCollection.find();
  }

  async getTicket(): Promise<TicketRes> {
    return await http({
      method: 'get',
      url: ticketConfig.url,
      params: {
        appid: ticketConfig.appid,
        appkey: ticketConfig.appkey,
      },
    });
  }

  async getUserInfo(ticket: string, talToken: string) {
    return await http({
      method: 'get',
      url: userInfoConfig.url,
      params: {
        ticket: ticket,
        token: talToken,
      },
    });
  }

  async getJwtTokenAndUserInfo(bodayData: LoginData) {
    const tiketRes: TicketRes = await this.getTicket();
    console.log('tiketRes', tiketRes);

    const ssoRes = await this.getUserInfo(tiketRes.ticket, bodayData.token);
    console.log('ssoRes', ssoRes);
    if (!ssoRes?.data?.workcode) {
      return {
        msg: `token失效 ${ssoRes?.error || ''}`,
      };
    }

    const user: any = await this.create(ssoRes.data);

    const jwtToken = await jwtSign({
      id: user._id,
      workcode: user.workcode,
    });

    console.log('user', user);
    const resData = {
      Authorization: jwtToken,
      id: user._id,
      ...user,
    };
    return resData;
  }

  async getUserInfoByModle(req) {
    // const Authorization = req.headers['authorization'];
    const Authorization = req.header('Authorization');

    const data: any = await jwtVerify(Authorization);
    const user = await userCollection.findOne({
      _id: data.id,
    });
    return (user && user.toObject()) || {};
  }

  async updateUser(bodayData, req) {
    const user: any = await this.getUserInfoByModle(req);

    // if (user.role === 0) {
    //   return {
    //     isSuccess: false,
    //     msg: '超级管理员才能编辑角色',
    //   };
    // } else {
      await userCollection.findOneAndUpdate(
        {
          _id: bodayData._id,
        },
        {
          role: bodayData.role,
        },
      );
      return {
        isSuccess: true,
      };
    // }
  }
}
