<template>
  <view class="see-navbar-mini" :style="navbarStyle">
    <!-- 左侧区域 -->
    <view class="see-navbar-mini__left" @tap="handleBack">
      <slot name="left">
        <view v-if="isShowBack" class="see-navbar-mini__back">
          <text class="see-navbar-mini__back-icon">‹</text>
        </view>
      </slot>
    </view>

    <!-- 中间区域 -->
    <view class="see-navbar-mini__center">
      <slot name="center">
        <text class="see-navbar-mini__title">{{ title }}</text>
      </slot>
    </view>

    <!-- 右侧区域 -->
    <view class="see-navbar-mini__right">
      <slot name="right" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { SeeNavbarMiniProps, SeeNavbarMiniEmits } from './type'

defineOptions({ name: 'SeeNavbarMini' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeNavbarMiniProps>(), {
  title: '',
  isShowBack: true,
  height: '',
  bgColor: ''
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeNavbarMiniEmits>()

/** ---------- computed ---------- */
const navbarStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.height) {
    style.height = props.height
  }
  if (props.bgColor) {
    style.background = props.bgColor
  }
  return style
})

/** ---------- methods ---------- */
const handleBack = () => {
  // 仅在显示返回按钮时才触发 onBack，避免使用 #left 插槽时被误触发
  if (!props.isShowBack) return
  emit('onBack')
}
</script>

<style lang="scss" scoped>
.see-navbar-mini {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--see-navbar-mini-height, 64rpx);
  padding: 0 24rpx;
  background: var(--see-navbar-bg, var(--see-bg-color));
  border-bottom: 1px solid var(--see-navbar-border-color, var(--see-border-four-color));
  box-sizing: border-box;

  &__left {
    display: flex;
    align-items: center;
    min-width: 80rpx;
    z-index: 1;
  }

  &__back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48rpx;
    height: 48rpx;
  }

  &__back-icon {
    font-size: 36rpx;
    color: var(--see-navbar-title-color, var(--see-main-color));
    font-weight: bold;
  }

  &__center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 80rpx;
    right: 80rpx;
    top: 0;
    bottom: 0;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 600;
    color: var(--see-navbar-title-color, var(--see-main-color));
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 80rpx;
    z-index: 1;
  }
}
</style>
