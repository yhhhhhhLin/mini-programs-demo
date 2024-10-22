<template>
  <view class="index">
    <AtButton type='primary'>按钮文案</AtButton>
  </view>
</template>

<script setup lang="ts">
import './index.scss'
import {ref} from "vue";
import { AtButton } from 'taro-ui-vue3/lib'

const msg = ref('hello worlsssd!!!!')

</script>

<style scoped>

</style>
