<template>
  <view class="demo-backtop">
    <view class="demo-header">
      <text class="demo-header__title">BackTop 返回顶部</text>
      <text class="demo-header__desc">请向下滚动查看效果</text>
    </view>

    <!-- 长列表内容 -->
    <view class="demo-list">
      <view v-for="i in 50" :key="i" class="demo-list__item">
        <text class="demo-list__text">列表项 {{ i }}</text>
      </view>
    </view>

    <!-- 1. 基础用法 -->
    <see-backtop />

    <!-- 2. 自定义位置（演示用，实际只需一个） -->
    <!-- <see-backtop :right="50" :bottom="100" /> -->

    <!-- 3. 自定义图标 -->
    <!-- <see-backtop>
      <view class="custom-btn">
        <text class="custom-btn__text">TOP</text>
      </view>
    </see-backtop> -->

    <!-- 底部占位 -->
    <view style="height: 200rpx" />
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.demo-backtop {
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-header {
  padding: 32rpx;

  &__title {
    display: block;
    font-size: 36rpx;
    font-weight: 600;
    color: var(--see-main-color);
    margin-bottom: 12rpx;
  }

  &__desc {
    display: block;
    font-size: 28rpx;
    color: var(--see-tips-color);
  }
}

.demo-list {
  padding: 0 32rpx;

  &__item {
    padding: 24rpx 0;
    border-bottom: 1px solid var(--see-border-four-color);
  }

  &__text {
    font-size: 28rpx;
    color: var(--see-content-color);
  }
}

.custom-btn {
  width: 80rpx;
  height: 80rpx;
  background: var(--see-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__text {
    font-size: 24rpx;
    color: #ffffff;
    font-weight: bold;
  }
}
</style>
