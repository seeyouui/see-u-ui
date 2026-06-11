<template>
  <view class="see-steps" :class="stepsClass">
    <view v-for="(step, index) in steps" :key="index" class="see-steps__item" :class="getStepClass(index, step)" @tap="handleStepClick(index, step)">
      <!-- 图标区域 -->
      <view class="see-steps__icon" :style="getIconStyle(index, step)">
        <view v-if="isDotStyle" class="see-steps__dot" />
        <template v-else>
          <text v-if="getStepStatus(index, step) === 'finish'" class="see-steps__icon-text">✓</text>
          <text v-else-if="getStepStatus(index, step) === 'error'" class="see-steps__icon-text">✗</text>
          <text v-else class="see-steps__icon-number">{{ index + 1 }}</text>
        </template>
      </view>

      <!-- 连接线 -->
      <view v-if="index < steps.length - 1" class="see-steps__line" :style="getLineStyle(index, step)" />

      <!-- 文字区域 -->
      <view class="see-steps__content">
        <text class="see-steps__title" :style="getTitleStyle(index, step)">{{ step.title }}</text>
        <text v-if="step.description && !isDotStyle" class="see-steps__description">{{ step.description }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { StepItem, SeeStepsProps, SeeStepsEmits } from './type'

defineOptions({ name: 'SeeSteps' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeStepsProps>(), {
  modelValue: 0,
  steps: () => [],
  direction: 'horizontal',
  activeColor: '',
  inactiveColor: '',
  isDotStyle: false,
  isClickable: false,
  isFreeJump: false
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeStepsEmits>()

/** ---------- computed ---------- */
const stepsClass = computed(() => ({
  [`see-steps--${props.direction}`]: true,
  'see-steps--dot': props.isDotStyle
}))

// 将 modelValue clamp 到 [0, steps.length - 1] 范围内，避免越界导致全部 step 显示 finish
const safeCurrent = computed(() => {
  const n = props.steps.length
  if (n === 0) return 0
  if (props.modelValue < 0) return 0
  if (props.modelValue > n - 1) return n - 1
  return props.modelValue
})

/** ---------- methods ---------- */
const getStepStatus = (index: number, step: StepItem): 'wait' | 'process' | 'finish' | 'error' => {
  if (step.status) return step.status
  if (index < safeCurrent.value) return 'finish'
  if (index === safeCurrent.value) return 'process'
  return 'wait'
}

const getStepClass = (index: number, step: StepItem) => {
  const status = getStepStatus(index, step)
  return {
    [`see-steps__item--${status}`]: true,
    'see-steps__item--clickable': props.isClickable
  }
}

const getIconStyle = (index: number, step: StepItem) => {
  const status = getStepStatus(index, step)
  const style: Record<string, string> = {}
  if (status === 'process' && props.activeColor) {
    style.background = props.activeColor
    style.borderColor = props.activeColor
  }
  return style
}

const getLineStyle = (index: number, step: StepItem) => {
  const status = getStepStatus(index, step)
  const style: Record<string, string> = {}
  if (status === 'finish' && props.activeColor) {
    style.borderColor = props.activeColor
  }
  return style
}

const getTitleStyle = (index: number, step: StepItem) => {
  const status = getStepStatus(index, step)
  const style: Record<string, string> = {}
  if (status === 'process' && props.activeColor) {
    style.color = props.activeColor
  }
  return style
}

const handleStepClick = (index: number, step: StepItem) => {
  if (!props.isClickable) return
  // 越界保护：不能点击不存在的步骤
  if (index < 0 || index >= props.steps.length) return
  // isFreeJump=false（默认）时只允许回退到已完成步骤；isFreeJump=true 时允许任意跳转
  if (!props.isFreeJump && index > safeCurrent.value) return
  emit('update:modelValue', index)
  emit('onChange', index, step)
  if (index === props.steps.length - 1) {
    emit('onFinish')
  }
}
</script>

<style lang="scss" scoped>
.see-steps {
  display: flex;
  width: 100%;

  &--horizontal {
    flex-direction: row;
    align-items: flex-start;
  }

  &--vertical {
    flex-direction: column;
  }

  &__item {
    display: flex;
    position: relative;

    .see-steps--horizontal & {
      flex: 1;
      flex-direction: column;
      align-items: center;
    }

    .see-steps--vertical & {
      flex-direction: row;
      align-items: flex-start;
      padding-bottom: 32rpx;
    }

    &--clickable {
      cursor: pointer;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--see-steps-icon-size, 44rpx);
    height: var(--see-steps-icon-size, 44rpx);
    border-radius: 50%;
    border: 2rpx solid var(--see-steps-line-color, var(--see-border-four-color));
    background: var(--see-bg-color);
    box-sizing: border-box;
    z-index: 1;
  }

  &__dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: var(--see-steps-wait-color, var(--see-tips-color));
  }

  &__icon-text {
    font-size: 24rpx;
    color: #ffffff;
    font-weight: bold;
  }

  &__icon-number {
    font-size: 24rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }

  &__line {
    .see-steps--horizontal & {
      position: absolute;
      top: calc(var(--see-steps-icon-size, 44rpx) / 2);
      left: calc(50% + var(--see-steps-icon-size, 44rpx) / 2 + 8rpx);
      right: calc(-50% + var(--see-steps-icon-size, 44rpx) / 2 + 8rpx);
      border-top: 2rpx solid var(--see-steps-line-color, var(--see-border-four-color));
    }

    .see-steps--vertical & {
      position: absolute;
      top: calc(var(--see-steps-icon-size, 44rpx) + 8rpx);
      left: calc(var(--see-steps-icon-size, 44rpx) / 2);
      bottom: 8rpx;
      border-left: 2rpx solid var(--see-steps-line-color, var(--see-border-four-color));
    }
  }

  &__content {
    .see-steps--horizontal & {
      margin-top: 12rpx;
      text-align: center;
    }

    .see-steps--vertical & {
      margin-left: 16rpx;
      padding-top: 4rpx;
    }
  }

  &__title {
    font-size: 28rpx;
    color: var(--see-content-color);
    display: block;
  }

  &__description {
    font-size: 24rpx;
    color: var(--see-steps-description-color, var(--see-tips-color));
    margin-top: 4rpx;
    display: block;
  }

  // 状态样式
  &__item--process &__icon {
    background: var(--see-steps-active-color, var(--see-primary));
    border-color: var(--see-steps-active-color, var(--see-primary));
  }

  &__item--process &__icon-number {
    color: #ffffff;
  }

  &__item--process &__dot {
    background: var(--see-steps-active-color, var(--see-primary));
  }

  &__item--finish &__icon {
    background: var(--see-steps-finish-color, var(--see-success));
    border-color: var(--see-steps-finish-color, var(--see-success));
  }

  &__item--finish &__line {
    border-color: var(--see-steps-finish-color, var(--see-success));
  }

  &__item--error &__icon {
    background: var(--see-steps-error-color, var(--see-error));
    border-color: var(--see-steps-error-color, var(--see-error));
  }
}
</style>
