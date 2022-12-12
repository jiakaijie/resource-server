import { model, Schema, Types } from 'mongoose';
const ObjectId = Types.ObjectId;

// 表名称
const versionCollectionName = 'versions';

const versionCollectionSchema = new Schema({
  _id: {
    type: String,
    default: function () {
      return new ObjectId().toString();
    },
  },
  version: {
    type: Number,
    default: 1,
  },
  resource_id: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: {},
  },
  create_time: {
    type: Date,
    default: Date.now,
  },
  update_time: {
    type: Date,
    default: Date.now,
  },
  create_user_id: {
    type: String,
    default: '',
  },
  update_user_id: {
    type: String,
    default: '',
  },
  version_desc: {
    type: String,
    default: '',
  },
  is_online_version: {
    type: Number,
    default: 0,
  },
});

// 定义所有的表并且抛出供使用
const versionCollection = model(versionCollectionName, versionCollectionSchema);
console.log(`表${versionCollectionName} 加载成功`);

export default versionCollection;
