<template>
  <view class="see-loading-page">
    <!-- 加载状态 -->
    <view
      v-show="props.loading"
      :class="[
        'see-loading-page__mask',
        {
          'see-loading-page__mask--fullscreen': props.isFullscreen
        }
      ]"
      :style="maskStyle"
    >
      <view class="see-loading-page__content">
        <see-loading-icon :type="props.iconType" :size="props.iconSize" />
        <text v-if="props.message" class="see-loading-page__message">
          {{ props.message }}
        </text>
      </view>
    </view>

    <!-- 内容区域始终存在 -->
    <view class="see-loading-page__body">
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeLoadingPage 加载页
 * @description 全屏或区域加载状态页面，内置加载动画和提示文字。
 * @tutorial https://www.seeuui.cn/components/loading-page/
 * @property {Boolean} loading 是否加载中
 * @property {String} message 加载提示文字
 * @property {String} iconType 加载图标类型
 * @property {String} iconSize 加载图标大小
 * @property {Boolean} isFullscreen 是否全屏
 * @property {String} background 背景色
 * @property {Number} zIndex z-index
 */
import { computed } from 'vue'
import type { SeeLoadingPageProps } from './type'

defineOptions({ name: 'SeeLoadingPage' })

const props = withDefaults(defineProps<SeeLoadingPageProps>(), {
  loading: true,
  message: '加载中...',
  iconType: 'spinner',
  iconSize: '80rpx',
  isFullscreen: false,
  zIndex: 999
})

const maskStyle = computed(() => ({
  backgroundColor: props.background || 'var(--see-bg-color)',
  zIndex: props.isFullscreen ? props.zIndex : undefined
}))
</script>

<style lang="scss" scoped>
.see-loading-page {
  width: 100%;
  min-height: 200rpx;

  &__mask {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;

    &--fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24rpx;
  }

  &__message {
    font-size: 26rpx;
    color: var(--see-tips-color);
  }

  &__body {
    width: 100%;
  }
}
</style>
