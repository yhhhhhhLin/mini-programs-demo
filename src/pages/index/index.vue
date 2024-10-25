<template>
  <view class="index">
    <image class="background-image" src="https://pic1.zhimg.com/v2-0dda71bc9ced142bf7bb2d6adbebe4f0_r.jpg?source=1940ef5c" mode="aspectFill" />

    <view class="button-container">
      <nut-button type="primary" @click="jumpToQuestion">开始答题</nut-button>
    </view>

    <nut-notify v-model:visible="show" msg="跳转中..." type="success" />
  </view>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
const jumpToQuestion = () => {
  show.value = true
}
</script>

<style scoped>
.index {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.button-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
