import { model, Schema, Types } from 'mongoose';
const ObjectId = Types.ObjectId;

// 表名称
const resCollectionName = 'resources';

const resCollectionSchema = new Schema({
  // _id: {
  //   type: String,
  //   default: function () {
  //     return new ObjectId().toString();
  //   },
  // },
  // 资源名称
  name: {
    type: String,
    default: '',
  },
  // 创建时间
  create_time: {
    type: Date,
    default: Date.now,
  },
  // 修改时间
  update_time: {
    type: Date,
    default: Date.now,
  },
  // 创建人ID
  create_user_id: {
    type: String,
    default: '',
  },
  // 修改人ID
  update_user_id: {
    type: String,
    default: '',
  },
  // 资源描述
  desc: {
    type: String,
    default: '',
  },
  // 资源版本ID
  version_id: {
    type: String,
    default: '',
  },
  // 资源url
  url: {
    type: String,
    default: '',
  },
  // 数据
  data: {
    type: Object,
    default: {},
  },
});

// 定义所有的表并且抛出供使用
const resCollection = model(resCollectionName, resCollectionSchema);
console.log(`表${resCollectionName} 加载成功`);

export default resCollection;
