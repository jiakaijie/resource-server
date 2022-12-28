export const envConfig = {
  dev: 'dev',
  test: 'test',
  pro: 'pro',
} as const;

export let env = '12312321213';
if (process.env.NODE_ENV === envConfig.pro) {
  env = envConfig.pro;
} else if (process.env.NODE_ENV === envConfig.test) {
  env = envConfig.test;
} else {
  env = envConfig.dev;
}

export const getConfig = async () => {
  return import(`./${env}`);
};

// import(`./${env}`)
//   .then((res) => {
//     console.log('res-----------------------------', res);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
