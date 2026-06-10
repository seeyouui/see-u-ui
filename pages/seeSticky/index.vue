<template>
  <see-config>
    <text class="title">基础吸顶</text>
    <view class="demo-content">
      <view style="height: 200rpx; background: var(--see-info); display: flex; align-items: center; justify-content: center">
        <text>向下滚动查看吸顶效果</text>
      </view>
      <see-sticky>
        <view style="background: var(--see-primary); padding: 20rpx; color: var(--see-text)">
          <text style="color: var(--see-text)">吸顶内容</text>
        </view>
      </see-sticky>
      <view style="height: 1000rpx; padding: 20rpx">
        <text>长内容区域</text>
      </view>
    </view>

    <text class="title">自定义 offsetTop</text>
    <view class="demo-content">
      <view style="height: 200rpx; background: var(--see-info); display: flex; align-items: center; justify-content: center">
        <text>距离顶部 100px 吸顶</text>
      </view>
      <see-sticky :offset-top="100">
        <view style="background: var(--see-success); padding: 20rpx">
          <text style="color: var(--see-text)">offsetTop=100px</text>
        </view>
      </see-sticky>
      <view style="height: 1000rpx; padding: 20rpx">
        <text>长内容区域</text>
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
