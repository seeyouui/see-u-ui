<template>
  <see-config>
    <text class="title">基础用法 - 底部弹出</text>
    <view class="demo-content">
      <see-button title="底部弹出" type="primary" is-ripple @click="show1 = true" />
      <see-popup v-model:show="show1">
        <view class="popup-content">
          <text class="popup-text">底部弹出内容</text>
        </view>
      </see-popup>
    </view>

    <text class="title">顶部弹出</text>
    <view class="demo-content">
      <see-button title="顶部弹出" type="primary" is-ripple @click="show2 = true" />
      <see-popup v-model:show="show2" position="top">
        <view class="popup-content">
          <text class="popup-text">顶部弹出内容</text>
        </view>
      </see-popup>
    </view>

    <text class="title">左侧弹出</text>
    <view class="demo-content">
      <see-button title="左侧弹出" type="primary" is-ripple @click="show3 = true" />
      <see-popup v-model:show="show3" position="left">
        <view class="popup-content popup-content--side">
          <text class="popup-text">左侧弹出内容</text>
        </view>
      </see-popup>
    </view>

    <text class="title">右侧弹出</text>
    <view class="demo-content">
      <see-button title="右侧弹出" type="primary" is-ripple @click="show4 = true" />
      <see-popup v-model:show="show4" position="right">
        <view class="popup-content popup-content--side">
          <text class="popup-text">右侧弹出内容</text>
        </view>
      </see-popup>
    </view>

    <text class="title">居中弹出</text>
    <view class="demo-content">
      <see-button title="居中弹出" type="primary" is-ripple @click="show5 = true" />
      <see-popup v-model:show="show5" position="center">
        <view class="popup-content popup-content--center">
          <text class="popup-text">居中弹出内容</text>
        </view>
      </see-popup>
    </view>

    <text class="title">带标题栏</text>
    <view class="demo-content">
      <see-button title="带标题栏" type="primary" is-ripple @click="show6 = true" />
      <see-popup v-model:show="show6" title="标题" is-show-header>
        <view class="popup-content">
          <text class="popup-text">带标题栏的弹出层</text>
        </view>
      </see-popup>
    </view>

    <text class="title">带关闭按钮</text>
    <view class="demo-content">
      <see-button title="带关闭按钮" type="primary" is-ripple @click="show7 = true" />
      <see-popup v-model:show="show7" is-show-close-btn>
        <view class="popup-content">
          <text class="popup-text">带关闭按钮的弹出层</text>
        </view>
      </see-popup>
    </view>

    <text class="title">无遮罩</text>
    <view class="demo-content">
      <see-button title="无遮罩" type="primary" is-ripple @click="show8 = true" />
      <see-popup v-model:show="show8" :is-overlay="false">
        <view class="popup-content">
          <text class="popup-text">无遮罩的弹出层</text>
        </view>
      </see-popup>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)
const show6 = ref(false)
const show7 = ref(false)
const show8 = ref(false)
</script>

<style lang="scss" scoped>
.title {
  display: block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: var(--see-tips-color);
}
.demo-content {
  padding: 0 30rpx 30rpx;
}
.popup-content {
  padding: 60rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300rpx;

  &--side {
    min-height: 100vh;
    width: 500rpx;
  }

  &--center {
    width: 500rpx;
    min-height: 300rpx;
    background-color: var(--see-bg-color);
    border-radius: 16rpx;
  }
}
.popup-text {
  font-size: 28rpx;
  color: var(--see-main-color);
}
</style>
