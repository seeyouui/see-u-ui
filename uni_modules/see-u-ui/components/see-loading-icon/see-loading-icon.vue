<template>
  <view :class="['see-loading-icon', `see-loading-icon--${props.type}`]" :style="iconStyle">
    <!-- spinner 类型 -->
    <view v-if="props.type === 'spinner'" class="see-loading-icon__spinner">
      <view class="see-loading-icon__spinner-circle" />
    </view>

    <!-- circular 类型 -->
    <view v-else-if="props.type === 'circular'" class="see-loading-icon__circular">
      <view class="see-loading-icon__circular-dot" />
    </view>

    <!-- dots 类型 -->
    <view v-else-if="props.type === 'dots'" class="see-loading-icon__dots">
      <view class="see-loading-icon__dot" />
      <view class="see-loading-icon__dot" />
      <view class="see-loading-icon__dot" />
    </view>

    <!-- pulse 类型 -->
    <view v-else class="see-loading-icon__pulse">
      <view class="see-loading-icon__pulse-ring" />
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeLoadingIcon 加载动画
 * @description 加载状态动画图标，支持 spinner / circular / dots / pulse 四种动画类型。
 * @tutorial https://www.seeuui.cn/components/loading-icon/
 * @property {'spinner'|'circular'|'dots'|'pulse'} type 动画类型
 * @property {String} size 尺寸
 * @property {String} color 颜色
 * @property {Number} speed 动画速度
 */
import { computed } from 'vue'
import type { SeeLoadingIconProps } from './type'

defineOptions({ name: 'SeeLoadingIcon' })

const props = withDefaults(defineProps<SeeLoadingIconProps>(), {
  type: 'spinner',
  size: '100rpx',
  color: 'var(--see-primary)',
  speed: 0.8
})

const iconStyle = computed(() => ({
  width: props.size,
  height: props.size,
  color: props.color,
  '--see-loading-speed': `${props.speed}s`
}))
</script>

<style lang="scss" scoped>
.see-loading-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // spinner：圆弧缺口旋转
  &--spinner {
    .see-loading-icon__spinner {
      width: 100%;
      height: 100%;
    }
    .see-loading-icon__spinner-circle {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 10rpx solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: see-spin var(--see-loading-speed, 0.8s) linear infinite;
    }
  }

  // circular：圆弧缺口旋转（带拖尾渐变）
  &--circular {
    .see-loading-icon__circular {
      width: 100%;
      height: 100%;
    }
    .see-loading-icon__circular-dot {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 10rpx solid transparent;
      border-radius: 50%;
      border-top-color: currentColor;
      border-right-color: currentColor;
      border-bottom-color: currentColor;
      animation: see-spin var(--see-loading-speed, 0.8s) linear infinite;
    }
  }

  // dots：三点弹跳
  &--dots {
    .see-loading-icon__dots {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .see-loading-icon__dot {
      width: 20%;
      height: 20%;
      margin: 0 6%;
      background-color: currentColor;
      border-radius: 50%;
      animation: see-bounce var(--see-loading-speed, 0.8s) ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.16s;
      }
      &:nth-child(3) {
        animation-delay: 0.32s;
      }
    }
  }

  // pulse：脉冲扩散
  &--pulse {
    .see-loading-icon__pulse {
      width: 100%;
      height: 100%;
    }
    .see-loading-icon__pulse-ring {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 6rpx solid currentColor;
      border-radius: 50%;
      animation: see-pulse var(--see-loading-speed, 0.8s) ease-out infinite;
    }
  }
}

@keyframes see-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes see-bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes see-pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}
</style>
