import { model, Schema } from 'mongoose';

// 表名称
const userCollectionName = 'users';

// cdnFiles表字段Schema信息
const userCollectionSchema = new Schema({
  account_id: {
    type: String,
    default: '',
  },
  account: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  workcode: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  yachid: {
    type: String,
    default: '',
  },
  // 0 普通角色 1 超级管理员角色
  role: {
    type: Number,
    default: 0,
  },
  // 创建时间
  create_time: {
    type: Date,
    default: Date.now,
  },
});

// 定义所有的表并且抛出供使用
const userCollection = model(userCollectionName, userCollectionSchema);
console.log(`表${userCollectionName} 加载成功`);

export default userCollection;
