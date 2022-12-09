import axios from 'axios';

const http: any = axios.create({
  timeout: 0,
  headers: {
    'content-type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => {
    let { status = 0, data: responseData } = response || {};
    responseData = responseData || {};
    status = status || 0;

    if (status !== 200) {
      return '';
    }

    return responseData;
  },
  (error) => {
    let { message = '' } = error || {};
    message = message || '';
    console.error('message', message);
    // 提示弹窗

    return Promise.reject(error);
  },
);

export { http };
