<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-button title="显示遮罩层" type="primary" is-ripple @click="show1 = true" />
      <see-overlay v-model:show="show1" />
    </view>

    <text class="title">自定义背景色</text>
    <view class="demo-content">
      <see-button title="红色遮罩" type="primary" is-ripple @click="show2 = true" />
      <see-overlay v-model:show="show2" background="rgba(255, 0, 0, 0.3)" />
    </view>

    <text class="title">不可点击关闭</text>
    <view class="demo-content">
      <see-button title="显示遮罩（需手动关闭）" type="primary" is-ripple @click="show3 = true" />
      <see-overlay v-model:show="show3" :clickable="false">
        <view class="overlay-content">
          <text class="overlay-text">点击遮罩层不会关闭</text>
          <see-button title="手动关闭" type="primary" is-ripple @click="show3 = false" />
        </view>
      </see-overlay>
    </view>

    <text class="title">带内容的遮罩</text>
    <view class="demo-content">
      <see-button title="带内容遮罩" type="primary" is-ripple @click="show4 = true" />
      <see-overlay v-model:show="show4">
        <view class="overlay-content">
          <text class="overlay-text">自定义内容</text>
          <see-button title="关闭" type="primary" is-ripple @click="show4 = false" />
        </view>
      </see-overlay>
    </view>

    <text class="title">无动画</text>
    <view class="demo-content">
      <see-button title="无动画遮罩" type="primary" is-ripple @click="show5 = true" />
      <see-overlay v-model:show="show5" :is-animated="false" />
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
.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 40rpx;
}
.overlay-text {
  color: #fff;
  font-size: 36rpx;
}
</style>
