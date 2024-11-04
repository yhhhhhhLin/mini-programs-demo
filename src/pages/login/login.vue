<template>
  <view class="login-container">
    <image class="background" src='../../images/login-background.png' mode="aspectFill" />
    <div class="login-btn-container">
      <button class="wx-login-button" @click="handleWxLogin">微信授权登录</button>
      <button class="pw-login-button" @click="handleLogin">账号密码登陆</button>
    </div>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import {getWxLoginId} from "../../services/user/login";

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
  console.log(code)
  getWxLoginId(code).then((resp=>{
    const loginId = resp.data
    // TODO 保存到storage中....
  }))

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
</script>
