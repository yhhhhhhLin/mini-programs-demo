import Taro from '@tarojs/taro';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  url: string;
  method?: HttpMethod;
  data?: Record<string, any>;
  headers?: Record<string, string>;
}

const baseUrl = 'http://192.168.20.119:7001/api';

const request = async ({ url, method = 'GET', data = {}, headers = {} }: RequestOptions): Promise<any> => {
  try {
    // // 判断是否登录
    // const loggedIn = await isLogin();
    //
    // if (!loggedIn) {
    //   return;
    // }
    //
    headers.loginId = Taro.getStorageSync('loginId');
    // 如果请求方法是GET，处理数据为查询字符串
    if (method === 'GET' && Object.keys(data).length > 0) {
      const queryString = new URLSearchParams(data).toString();
      url += '?' + queryString;  // 拼接查询字符串到URL
    }
    const response = await Taro.request({
      url: baseUrl + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      // TODO 增加登陆校验和一些其他的错误判断
      const baseResponse = response.data;
      // 未登录代码
      if(baseResponse.code == 40100){
        // 跳转到登陆页面
        Taro.redirectTo({url: '/pages/login/login'});
      }
      return response.data;
    } else {
      throw new Error(`请求发送错误 ${response.statusCode}`);
    }
  } catch (error) {
    console.error('请求错误，', error);
    throw error;
  }
};

export async function isLogin() {
  const userLoginId = Taro.getStorageSync('loginId');

  if (!userLoginId) {
    console.log('没登陆，跳转到登陆页面....')
    Taro.redirectTo({ url: '/pages/login/login' });
    return false;
  }

  return true;
}

export default request;
