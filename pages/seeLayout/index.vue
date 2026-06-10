<template>
  <see-config>
    <text class="title">等分布局</text>
    <view class="demo-content">
      <see-layout>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">2:1 比例</text>
    <view class="demo-content">
      <see-layout>
        <see-layout-item :span="16">
          <view class="grid-item">span=16</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">偏移</text>
    <view class="demo-content">
      <see-layout>
        <see-layout-item :span="8" :offset="8">
          <view class="grid-item">span=8 offset=8</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">带间距</text>
    <view class="demo-content">
      <see-layout :gap="16">
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">Flex 自定义比例</text>
    <view class="demo-content">
      <see-layout>
        <see-layout-item :flex="2">
          <view class="grid-item">flex=2</view>
        </see-layout-item>
        <see-layout-item :flex="1">
          <view class="grid-item">flex=1</view>
        </see-layout-item>
        <see-layout-item :flex="1">
          <view class="grid-item">flex=1</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">垂直方向</text>
    <view class="demo-content">
      <see-layout direction="column" :gap="10">
        <see-layout-item>
          <view class="grid-item">第一行</view>
        </see-layout-item>
        <see-layout-item>
          <view class="grid-item">第二行</view>
        </see-layout-item>
        <see-layout-item>
          <view class="grid-item">第三行</view>
        </see-layout-item>
      </see-layout>
    </view>
  </see-config>
</template>

<script lang="ts" setup></script>

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
.grid-item {
  background: var(--see-primary);
  color: #fff;
  text-align: center;
  padding: 20rpx 0;
  font-size: 24rpx;
  border-radius: 8rpx;
}
</style>
