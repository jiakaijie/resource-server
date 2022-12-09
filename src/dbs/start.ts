import { connect, connection } from 'mongoose';
// 初始化数据库
const host = 'localhost';
const dbname = 'test';

async function init() {
  const url = `mongodb://${host}/${dbname}`;
  // 开始连接
  connection.on('connecting', () => {
    console.log(`mongodb ${url} 开始连接`);
  });

  // 连接失败
  connection.on('disconnected', () => {
    console.log(`mongodb 3s 未连接上`);
  });

  // 异常情况
  connection.on('error', (err) => {
    console.log(`mongodb 异常`, err);
  });

  // 直接连接数据库名，没有创建库也不会失败
  await connect(`mongodb://${host}/${dbname}`, {
    serverSelectionTimeoutMS: 3000, // 设置连接超时时长
    socketTimeoutMS: 2000,
  });
  console.log(`mongodb ${url}连接成功`);
}

async function startDb() {
  await init();
}

export { startDb };
