<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-notice-bar text="这是一条通知信息，文字过长时会自动滚动显示完整内容" />
    </view>

    <text class="title">不同类型</text>
    <view class="demo-content">
      <see-notice-bar text="信息类型通知" type="info" />
      <view class="gap" />
      <see-notice-bar text="警告类型通知" type="warning" />
      <view class="gap" />
      <see-notice-bar text="错误类型通知" type="error" />
    </view>

    <text class="title">可关闭</text>
    <view class="demo-content">
      <see-notice-bar v-if="show1" text="这是一条可关闭的通知" is-closable @on-close="show1 = false" />
    </view>

    <text class="title">自定义图标</text>
    <view class="demo-content">
      <see-notice-bar text="自定义图标的通知" icon="📢" />
    </view>

    <text class="title">无图标</text>
    <view class="demo-content">
      <see-notice-bar text="无图标的通知" :is-show-icon="false" />
    </view>

    <text class="title">静态文字（不滚动）</text>
    <view class="demo-content">
      <see-notice-bar text="短文字不滚动" :is-scrollable="false" />
    </view>

    <text class="title">垂直轮播</text>
    <view class="demo-content">
      <see-notice-bar vertical :messages="verticalMessages" :vertical-interval="3000" />
    </view>

    <text class="title">自定义速度</text>
    <view class="demo-content">
      <see-notice-bar text="快速滚动的通知信息" :speed="100" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const show1 = ref(true)

const verticalMessages = ['第一条通知信息', '第二条通知信息', '第三条通知信息']
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
.gap {
  height: 16rpx;
}
</style>
