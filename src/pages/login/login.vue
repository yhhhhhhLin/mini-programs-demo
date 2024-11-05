<template>
  <view class="login-container">
    <image class="background" src='../../images/login-background.png' mode="aspectFill"/>
    <div class="login-btn-container">
      <button class="wx-login-button" @click="handleWxLogin">微信授权登录</button>
      <button class="pw-login-button" @click="handleLogin">账号密码登陆</button>
    </div>

    <nut-notify
      @click="onLoginNotifyClick"
      @closed="onLoginNotifyClosed"
      :type="loginNotifyState.state.type"
      v-model:visible="loginNotifyState.state.show"
      :msg="loginNotifyState.state.desc"
    />
  </view>
</template>

<script setup>
import {getWxLoginId} from "../../services/user/login";
import Taro from "@tarojs/taro";
import {reactive} from "vue";

const onLoginNotifyClosed = () => console.log('closed');
const onLoginNotifyClick = () => console.log('click');
const loginNotifyState = {
  state: reactive({
    show: false,
    desc: '',
    type: 'primary'
  })}

const handleWxLogin = () => {
  wx.login({
    success: (res) => {
      if (res.code) {
        // 发送 res.code 到服务器
        getAndSetWxLoginId(res.code);
      } else {
        console.error('登录失败！' + res.errMsg);
      }
    },
    fail: (err) => {
      console.error('wx.login failed', err);
    }
  });
};

const getAndSetWxLoginId = (code) => {
  // 在这里调用后端 API 发送 code 并获取 session_key 和 openid
  // 调用后端发送请求
  // console.log(code)
  getWxLoginId(code).then((resp => {
    const loginId = resp.data
    wx.setStorageSync('loginId', loginId);
    console.log('登陆成功，保存到storage中:' + loginId)
    loginNotifyState.state.desc = '登陆成功'
    loginNotifyState.state.type = 'success'
    loginNotifyState.state.show = true;
    // 停止一秒
    setTimeout(() => {
      back();
    }, 1000);

  })).catch((err) => {
    console.error('获取登录 ID 失败', err);
  });

  // wx.request({
  //   url: 'https://your-backend-url.com/api/login', // 替换为你的后端 API 地址
  //   method: 'POST',
  //   data: {
  //     code: code
  //   },
  //   success: (res) => {
  //     if (res.data.success) {
  //       // 登录成功，存储用户信息
  //       wx.setStorageSync('userOpenId', res.data.openid);
  //       wx.setStorageSync('sessionKey', res.data.session_key);
  //       wx.navigateTo({ url: '/pages/index/index' }); // 登录成功后跳转
  //     } else {
  //       console.error('登录失败', res.data.message);
  //     }
  //   },
  //   fail: (err) => {
  //     console.error('请求失败', err);
  //   }
  // });
};

const back = ()=>{
  const pages = Taro.getCurrentPages();
  const prevPage = pages[pages.length - 2];

  if (prevPage) {
    console.log('登陆成功，跳回上个页面....')
    Taro.navigateBack({
      delta: 1,
    });
  } else {
    console.log('登陆成功，跳回首页....')
    Taro.reLaunch({
      url: '/pages/index/index',
    });
  }
}
</script>
