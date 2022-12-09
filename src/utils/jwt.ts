const jwt = require('jsonwebtoken');

class SignData {
  workcode: string;
  id: string;
  [propName: string]: any;
}

const jwtKey = '~!@#$%^&*()+,';

export const jwtSign = (signData: SignData): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        ...signData,
      },
      jwtKey,
      {
        expiresIn: '12h',
      },
      (_, token: string) => {
        resolve(token);
      },
    );
  });
};

interface JwtTokenData {
  workcode: string;
  id: string;
  exp: number;
  [propName: string]: any;
}
export const jwtVerify = (token: string): Promise<boolean | JwtTokenData> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtKey, (err, data: JwtTokenData) => {
      if (err) {
        console.log('err', err);
        resolve(false);
      } else {
        console.log('data', data);
        resolve(data);
      }
    });
  });
};
