import Taro from '@tarojs/taro';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  url: string;
  method?: HttpMethod;
  data?: Record<string, any>;
  headers?: Record<string, string>;
}

const baseUrl = 'http://localhost:8080';

const request = async ({url, method = 'GET', data = {}, headers = {}}: RequestOptions): Promise<any> => {
  try {
    if(isLogin()){
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
        return response.data;
      } else {
        throw new Error(`请求发送错误 ${response.statusCode}`);
      }
    }else{
      // 如果没有登陆
      Taro.navigateTo({
        url: '/pages/login/login'
      });

    }
  } catch (error) {
    console.error('请求错误，', error);
    throw error;
  }
};

function isLogin() {
  // TODO 判断白名单和是否保存到store中
  return false
  // const openid = wx.getStorageSync('userOpenId');
  // if (!openid) {
  //   wx.redirectTo({ url: '/pages/login/login' }); // 跳转到登录页面
  //   return false;
  // }
}

export default request;
