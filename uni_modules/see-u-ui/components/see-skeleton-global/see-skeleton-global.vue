<template>
  <view v-if="visible" class="see-skeleton-global" :class="{ 'see-skeleton-global--animate': animate }">
    <!-- 状态栏占位 -->
    <view class="see-skeleton-global__status-bar" />

    <!-- 导航栏骨架 -->
    <view class="see-skeleton-global__navbar">
      <view class="see-skeleton-global__navbar-left">
        <view class="see-skeleton-global__block see-skeleton-global__back-icon" />
      </view>
      <view class="see-skeleton-global__navbar-title">
        <view class="see-skeleton-global__block" style="width: 200rpx; height: 36rpx" />
      </view>
      <view class="see-skeleton-global__navbar-right" />
    </view>

    <!-- 内容区域 -->
    <view class="see-skeleton-global__body">
      <slot>
        <!-- 模拟配置页面的卡片布局 -->
        <view class="see-skeleton-global__card">
          <view class="see-skeleton-global__card-header">
            <view class="see-skeleton-global__block" style="width: 160rpx; height: 32rpx" />
          </view>
          <view class="see-skeleton-global__card-body">
            <view class="see-skeleton-global__block" style="width: 100%; height: 24rpx" />
            <view class="see-skeleton-global__block" style="width: 80%; height: 24rpx; margin-top: 16rpx" />
          </view>
          <view class="see-skeleton-global__card-actions">
            <view class="see-skeleton-global__block see-skeleton-global__btn" />
            <view class="see-skeleton-global__block see-skeleton-global__btn" />
            <view class="see-skeleton-global__block see-skeleton-global__btn" />
          </view>
        </view>

        <!-- 第二个卡片 -->
        <view class="see-skeleton-global__card">
          <view class="see-skeleton-global__card-header">
            <view class="see-skeleton-global__block" style="width: 120rpx; height: 32rpx" />
          </view>
          <view class="see-skeleton-global__card-body">
            <view class="see-skeleton-global__block" style="width: 100%; height: 24rpx" />
            <view class="see-skeleton-global__block" style="width: 90%; height: 24rpx; margin-top: 16rpx" />
          </view>
          <view class="see-skeleton-global__card-actions">
            <view class="see-skeleton-global__block see-skeleton-global__btn" />
            <view class="see-skeleton-global__block see-skeleton-global__btn" />
          </view>
        </view>

        <!-- 第三个卡片 -->
        <view class="see-skeleton-global__card">
          <view class="see-skeleton-global__card-header">
            <view class="see-skeleton-global__block" style="width: 180rpx; height: 32rpx" />
            <view class="see-skeleton-global__block" style="width: 100rpx; height: 28rpx" />
          </view>
          <view class="see-skeleton-global__card-body">
            <view class="see-skeleton-global__color-row">
              <view class="see-skeleton-global__block see-skeleton-global__color-dot" />
              <view class="see-skeleton-global__block see-skeleton-global__color-dot" />
              <view class="see-skeleton-global__block see-skeleton-global__color-dot" />
              <view class="see-skeleton-global__block see-skeleton-global__color-dot" />
            </view>
            <view class="see-skeleton-global__block" style="width: 100%; height: 80rpx; margin-top: 24rpx" />
            <view class="see-skeleton-global__block" style="width: 100%; height: 80rpx; margin-top: 16rpx" />
          </view>
        </view>

        <!-- 第四个卡片 -->
        <view class="see-skeleton-global__card">
          <view class="see-skeleton-global__card-header">
            <view class="see-skeleton-global__block" style="width: 140rpx; height: 32rpx" />
            <view class="see-skeleton-global__block see-skeleton-global__switch" />
          </view>
          <view class="see-skeleton-global__card-body">
            <view class="see-skeleton-global__block" style="width: 100%; height: 24rpx" />
          </view>
        </view>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeSkeletonGlobal 全局骨架屏
 * @description 全局骨架屏组件，配合 useSkeletonGlobal 使用
 * @tutorial https://www.seeuui.cn/components/skeleton-global/
 * @property {Number} rows 骨架行数
 * @property {Boolean} animate 是否启用动画
 * @property {String} bgColor 骨架背景色
 * @property {String} highlightColor 高亮色
 */
import { computed } from 'vue'
import { useSkeletonGlobal } from '@/uni_modules/see-u-ui/utils/hooks/useSkeletonGlobal'
import type { SeeSkeletonGlobalProps } from './type'

defineOptions({ name: 'SeeSkeletonGlobal' })

const props = withDefaults(defineProps<SeeSkeletonGlobalProps>(), {
  rows: 5,
  animate: true,
  bgColor: 'var(--see-skeleton-bg, #f0f0f0)',
  highlightColor: 'var(--see-skeleton-highlight, #e0e0e0)'
})

const { visible } = useSkeletonGlobal()
</script>

<style lang="scss" scoped>
.see-skeleton-global {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: var(--see-bg-color);
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &__status-bar {
    height: var(--status-bar-height, 44rpx);
    background-color: var(--see-bg-color);
  }

  &__navbar {
    height: 88rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    background-color: var(--see-bg-color);
    border-bottom: 1rpx solid var(--see-border-four-color);
  }

  &__navbar-left {
    width: 80rpx;
    display: flex;
    align-items: center;
  }

  &__navbar-title {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  &__navbar-right {
    width: 80rpx;
  }

  &__back-icon {
    width: 40rpx !important;
    height: 40rpx !important;
    border-radius: 50% !important;
  }

  &__body {
    flex: 1;
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;
  }

  &__card {
    background-color: var(--see-bg-color);
    border-radius: 16rpx;
    overflow: hidden;
    border: 1rpx solid var(--see-border-four-color);
  }

  &__card-header {
    padding: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1rpx solid var(--see-border-four-color);
  }

  &__card-body {
    padding: 24rpx;
  }

  &__card-actions {
    padding: 16rpx 24rpx;
    display: flex;
    gap: 16rpx;
    border-top: 1rpx solid var(--see-border-four-color);
  }

  &__btn {
    flex: 1;
    height: 72rpx !important;
    border-radius: 12rpx !important;
  }

  &__color-row {
    display: flex;
    gap: 16rpx;
  }

  &__color-dot {
    width: 60rpx !important;
    height: 60rpx !important;
    border-radius: 50% !important;
  }

  &__switch {
    width: 88rpx !important;
    height: 48rpx !important;
    border-radius: 24rpx !important;
  }

  // 骨架块基础样式 - 参考 see-skeleton
  &__block {
    background-color: var(--see-info);
    border-radius: 8rpx;
    position: relative;
    overflow: hidden;
  }

  // 动画效果 - 参考 see-skeleton 的 shimmer 动画
  &--animate &__block {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--see-bg-color) 50%, transparent);
      animation: see-skeleton-global-shimmer 1.5s ease-in-out infinite;
    }
  }
}

@keyframes see-skeleton-global-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}
</style>
