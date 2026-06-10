<template>
  <see-config>
    <text class="title">水平分割线（默认）</text>
    <view class="demo-content">
      <text>上方内容</text>
      <see-line />
      <text>下方内容</text>
    </view>

    <text class="title">自定义颜色</text>
    <view class="demo-content">
      <text>上方内容</text>
      <see-line color="#007aff" />
      <text>下方内容</text>
    </view>

    <text class="title">自定义粗细</text>
    <view class="demo-content">
      <text>上方内容</text>
      <see-line size="4rpx" />
      <text>下方内容</text>
    </view>

    <text class="title">虚线样式</text>
    <view class="demo-content">
      <text>上方内容</text>
      <see-line :is-dashed="true" />
      <text>下方内容</text>
    </view>

    <text class="title">自定义长度</text>
    <view class="demo-content">
      <see-line length="50%" />
    </view>

    <text class="title">垂直分割线</text>
    <view class="demo-content">
      <view style="display: flex; align-items: center; height: 60rpx">
        <text>左</text>
        <see-line direction="vertical" length="60rpx" margin="0 20rpx" />
        <text>右</text>
      </view>
    </view>

    <text class="title">垂直虚线</text>
    <view class="demo-content">
      <view style="display: flex; align-items: center; height: 60rpx">
        <text>左</text>
        <see-line direction="vertical" :is-dashed="true" length="60rpx" margin="0 20rpx" />
        <text>右</text>
      </view>
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
