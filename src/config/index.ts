export const envConfig = {
  dev: 'dev',
  test: 'test',
  pro: 'pro',
} as const;

export let env = '';
if (process.env.NODE_ENV === envConfig.pro) {
  env = envConfig.pro;
} else if (process.env.NODE_ENV === envConfig.test) {
  env = envConfig.test;
} else {
  env = envConfig.dev;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const config = require(`./${env}`);
