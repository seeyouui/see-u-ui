<script lang="ts" setup>
/**
 * SeeLineProgress 线形进度条
 * @description 用于任务进度、上传进度、步骤完成度和仪表盘进度展示。
 */
import { computed, watch } from 'vue'
import type { SeeLineProgressProps } from './type'

defineOptions({ name: 'SeeLineProgress' })

const props = withDefaults(defineProps<SeeLineProgressProps>(), {
  percentage: 0,
  max: 100,
  strokeWidth: '16rpx',
  trackColor: 'var(--see-fill-color-light, #f2f3f5)',
  activeColor: '',
  status: 'normal',
  striped: false,
  animated: false,
  showText: true,
  textInside: false,
  round: true,
  inactive: false,
  duration: 300
})

const emit = defineEmits<{
  (e: 'onChange', percentage: number): void
  (e: 'onComplete'): void
}>()

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const safePercentage = computed(() => {
  const max = props.max > 0 ? props.max : 100
  return Math.round(clamp((props.percentage / max) * 100, 0, 100) * 100) / 100
})

const statusColor = computed(() => {
  if (props.inactive) return 'var(--see-disabled-color, #c8c9cc)'
  if (props.activeColor) return props.activeColor
  const colors = {
    normal: 'var(--see-primary, #2979ff)',
    success: 'var(--see-success, #67c23a)',
    warning: 'var(--see-warning, #e6a23c)',
    error: 'var(--see-error, #f56c6c)'
  }
  return colors[props.status]
})

const displayText = computed(() => {
  if (props.format) return props.format(safePercentage.value)
  return `${safePercentage.value}%`
})

const showInnerText = computed(() => props.showText && props.textInside)
const showOuterText = computed(() => props.showText && !props.textInside)

const progressClasses = computed(() => [
  'see-line-progress',
  `see-line-progress--${props.status}`,
  {
    'is-striped': props.striped,
    'is-animated': props.animated,
    'is-round': props.round,
    'is-inactive': props.inactive,
    'is-text-inside': props.textInside
  }
])

const trackStyle = computed(() => ({
  height: props.strokeWidth,
  backgroundColor: props.trackColor,
  borderRadius: props.round ? props.strokeWidth : '0'
}))

const activeBackground = computed(() => {
  if (Array.isArray(statusColor.value)) {
    return `linear-gradient(90deg, ${statusColor.value.join(', ')})`
  }
  return statusColor.value
})

const barStyle = computed(() => ({
  width: `${safePercentage.value}%`,
  height: '100%',
  background: activeBackground.value,
  borderRadius: props.round ? props.strokeWidth : '0',
  transitionDuration: `${props.duration}ms`
}))

watch(
  safePercentage,
  (value, oldValue) => {
    if (value !== oldValue) emit('onChange', value)
    if (value >= 100 && oldValue !== 100) emit('onComplete')
  },
  { immediate: true }
)
</script>

<template>
  <view :class="progressClasses">
    <view class="see-line-progress__track" :style="trackStyle">
      <view class="see-line-progress__bar" :style="barStyle">
        <view v-if="showInnerText" class="see-line-progress__text see-line-progress__text--inside">
          <slot name="text" :percentage="safePercentage">{{ displayText }}</slot>
        </view>
      </view>
    </view>

    <view v-if="showOuterText" class="see-line-progress__text see-line-progress__text--outside">
      <slot name="text" :percentage="safePercentage">{{ displayText }}</slot>
    </view>

    <slot />
  </view>
</template>

<style lang="scss" scoped>
.see-line-progress {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;

  &__track {
    position: relative;
    flex: 1;
    overflow: hidden;
  }

  &__bar {
    position: relative;
    min-width: 0;
    overflow: hidden;
    transition-property: width, background-color;
    transition-timing-function: ease;
  }

  &__text {
    color: var(--see-text-color, #303133);
    font-size: 24rpx;
    line-height: 1;
    white-space: nowrap;
  }

  &__text--outside {
    margin-left: 16rpx;
  }

  &__text--inside {
    position: absolute;
    top: 50%;
    right: 12rpx;
    color: #fff;
    transform: translateY(-50%);
    font-size: 20rpx;
  }

  &.is-striped .see-line-progress__bar::after {
    position: absolute;
    inset: 0;
    content: '';
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.25) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.25) 50%,
      rgba(255, 255, 255, 0.25) 75%,
      transparent 75%,
      transparent
    );
    background-size: 32rpx 32rpx;
  }

  &.is-animated .see-line-progress__bar::after {
    animation: see-line-progress-stripes 1s linear infinite;
  }
}

@keyframes see-line-progress-stripes {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 32rpx 0;
  }
}
</style>
