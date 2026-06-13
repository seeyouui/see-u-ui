<template>
  <view class="demo-backtop">
    <view class="demo-header">
      <text class="demo-header__title">{{ t('backTop.demo.title') }}</text>
      <text class="demo-header__desc">{{ t('backTop.demo.scrollHint') }}</text>
    </view>

    <!-- 长列表内容 -->
    <view class="demo-list">
      <view v-for="i in 50" :key="i" class="demo-list__item">
        <text class="demo-list__text">{{ t('backTop.demo.listItem', { i }) }}</text>
      </view>
    </view>

    <!-- 1. 基础用法 -->
    <see-backtop />

    <!-- 底部占位 -->
    <view style="height: 200rpx" />
  </view>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeBackTop')
</script>

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
