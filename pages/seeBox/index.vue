<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-box padding="20rpx" bg-color="var(--see-info)">
        <text>我是一个带内边距和背景色的盒子</text>
      </see-box>
    </view>

    <text class="title">Flex 布局</text>
    <view class="demo-content">
      <see-box direction="row" justify="space-between" align="center" padding="20rpx" bg-color="var(--see-primary-light)">
        <text>左</text>
        <text>中</text>
        <text>右</text>
      </see-box>
    </view>

    <text class="title">阴影效果</text>
    <view class="demo-content">
      <see-box direction="row" gap="20rpx" wrap="wrap">
        <see-box padding="30rpx" radius="12rpx" shadow="small">
          <text>小阴影</text>
        </see-box>
        <see-box padding="30rpx" radius="12rpx" shadow="medium">
          <text>中阴影</text>
        </see-box>
        <see-box padding="30rpx" radius="12rpx" shadow="large">
          <text>大阴影</text>
        </see-box>
      </see-box>
    </view>

    <text class="title">垂直排列</text>
    <view class="demo-content">
      <see-box direction="column" gap="16rpx" padding="20rpx" bg-color="var(--see-info-light)">
        <text>第一行</text>
        <text>第二行</text>
        <text>第三行</text>
      </see-box>
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
</style>
