<template>
  <view class="see-slider" :class="sliderClasses">
    <!-- 值显示 - 范围模式左侧 / 单值模式 -->
    <text v-if="isShowValue" class="see-slider__value see-slider__value--start">
      {{ displayStartValue }}
    </text>

    <!-- 滑轨容器 -->
    <view
      ref="trackRef"
      class="see-slider__track"
      :style="trackStyle"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
      @touchcancel.passive="onTouchEnd"
      @mousedown="onMouseDown"
    >
      <!-- 背景轨道 -->
      <view class="see-slider__rail" :style="railStyle"></view>

      <!-- 激活区域 -->
      <view class="see-slider__fill" :style="fillStyle"></view>

      <!-- 步长刻度 -->
      <view v-if="isShowStep && stepCount > 0" class="see-slider__steps">
        <view
          v-for="index in stepCount"
          :key="index"
          class="see-slider__step-dot"
          :class="{ 'is-active': isStepActive(index - 1) }"
          :style="getStepDotStyle(index - 1)"
        ></view>
      </view>

      <!-- 最小值滑块（范围模式） -->
      <view
        v-if="isRange"
        class="see-slider__thumb see-slider__thumb--min"
        :class="{ 'is-dragging': activeThumb === 'min' }"
        :style="getThumbStyle('min')"
      >
        <view v-if="isShowValue && activeThumb === 'min'" class="see-slider__tooltip">
          {{ displayMinValue }}
        </view>
      </view>

      <!-- 主滑块 / 最大值滑块 -->
      <view
        class="see-slider__thumb"
        :class="{
          'is-dragging': isRange ? activeThumb === 'max' : isDragging,
          'see-slider__thumb--max': isRange
        }"
        :style="getThumbStyle('max')"
      >
        <view v-if="isShowValue && !isRange && isDragging" class="see-slider__tooltip">
          {{ displayMaxValue }}
        </view>
      </view>
    </view>

    <!-- 值显示 - 范围模式右侧 -->
    <text v-if="isShowValue && isRange" class="see-slider__value see-slider__value--end">
      {{ displayEndValue }}
    </text>
  </view>
</template>

<script lang="ts" setup>
/**
 * Slider 滑动选择器
 * @description 通过拖动滑块在一个固定区间内进行数值选择
 * @tutorial https://www.seeuui.cn/components/slider/
 *
 * @property {Number | Array} modelValue    绑定值（v-model，范围模式为 [minVal, maxVal]）
 * @property {Number}         min           最小值（默认 0）
 * @property {Number}         max           最大值（默认 100）
 * @property {Number}         step          步长（默认 1）
 * @property {Boolean}        isDisabled    是否禁用（默认 false）
 * @property {Boolean}        isReadonly    是否只读（默认 false）
 * @property {Boolean}        isRange       是否范围选择（默认 false）
 * @property {Boolean}        isVertical    是否垂直模式（默认 false）
 * @property {Number}         barHeight     进度条高度，单位 px（默认 4）
 * @property {String}         activeColor   已选部分颜色
 * @property {String}         inactiveColor 未选部分颜色
 * @property {Boolean}        isShowValue   是否显示当前值（默认 false）
 * @property {Boolean}        isShowStep    是否显示步长刻度（默认 false）
 * @property {String}         size          尺寸（默认 'default'）
 * @property {String}         name          表单字段名
 */
import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formKey } from '../../utils/shared/form-keys'
import type { FormContext, SliderSize, TrackRect } from './type'

defineOptions({ name: 'SeeSlider' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值 */
    modelValue?: number | number[]
    /** 最小值 */
    min?: number
    /** 最大值 */
    max?: number
    /** 步长 */
    step?: number
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 是否范围选择 */
    isRange?: boolean
    /** 是否垂直模式 */
    isVertical?: boolean
    /** 进度条高度，单位 px */
    barHeight?: number
    /** 已选部分颜色 */
    activeColor?: string
    /** 未选部分颜色 */
    inactiveColor?: string
    /** 是否显示当前值 */
    isShowValue?: boolean
    /** 是否显示步长刻度 */
    isShowStep?: boolean
    /** 尺寸 */
    size?: SliderSize
    /** 表单字段名 */
    name?: string
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    isDisabled: false,
    isReadonly: false,
    isRange: false,
    isVertical: false,
    barHeight: 4,
    activeColor: '',
    inactiveColor: '',
    isShowValue: false,
    isShowStep: false,
    size: 'default',
    name: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 值变化时触发 */
  (e: 'onChange', value: number | number[]): void
  /** 开始拖动时触发 */
  (e: 'onDragStart'): void
  /** 结束拖动时触发 */
  (e: 'onDragEnd'): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: number | number[]): void
}>()

/** ---------- inject ---------- */
const formContext = inject<FormContext | null>(formKey, null)
const instance = getCurrentInstance()

/** ---------- refs ---------- */
const trackRef = ref<Record<string, unknown> | null>(null)
const isDragging = ref(false)
const activeThumb = ref<'min' | 'max'>('max')
const trackRect = ref<TrackRect>({ left: 0, top: 0, width: 0, height: 0 })
const isMouseDown = ref(false)

/** ---------- computed ---------- */
/** 实际禁用状态 */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.props?.isDisabled || false
})

/** 实际只读状态 */
const mergedReadonly = computed(() => {
  return props.isReadonly || formContext?.props?.isReadonly || false
})

/** 实际尺寸 */
const mergedSize = computed(() => {
  return props.size || formContext?.props?.size || 'default'
})

/** 值范围 */
const valueRange = computed(() => {
  return props.max - props.min
})

/** 当前最小值（范围模式） */
const currentMin = computed<number>(() => {
  if (props.isRange && Array.isArray(props.modelValue)) {
    return clampNumber(props.modelValue[0] ?? props.min)
  }
  return props.min
})

/** 当前最大值 / 单值模式值 */
const currentMax = computed<number>(() => {
  if (Array.isArray(props.modelValue)) {
    return clampNumber(props.modelValue[1] ?? props.max)
  }
  return clampNumber(props.modelValue ?? props.min)
})

/** 最小值百分比 */
const minPercent = computed(() => {
  if (valueRange.value <= 0) return 0
  return ((currentMin.value - props.min) / valueRange.value) * 100
})

/** 最大值百分比 */
const maxPercent = computed(() => {
  if (valueRange.value <= 0) return 0
  return ((currentMax.value - props.min) / valueRange.value) * 100
})

/** 显示文本 */
const displayStartValue = computed(() => {
  return props.isRange ? formatValue(currentMin.value) : formatValue(currentMax.value)
})

const displayEndValue = computed(() => formatValue(currentMax.value))
const displayMinValue = computed(() => formatValue(currentMin.value))
const displayMaxValue = computed(() => formatValue(currentMax.value))

/** 步长刻度数量 */
const stepCount = computed(() => {
  if (props.step <= 0 || valueRange.value <= 0) return 0
  return Math.floor(valueRange.value / props.step) + 1
})

/** ---------- styles ---------- */
const sliderClasses = computed(() => {
  const classes: string[] = [`see-slider--${mergedSize.value}`]
  if (props.isVertical) classes.push('is-vertical')
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (isDragging.value) classes.push('is-dragging')
  return classes.join(' ')
})

const trackStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.isVertical) {
    style.width = `${props.barHeight}px`
  } else {
    style.height = `${props.barHeight}px`
  }
  return style
})

const railStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.inactiveColor) {
    style.backgroundColor = props.inactiveColor
  }
  return style
})

const fillStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.activeColor) {
    style.backgroundColor = props.activeColor
  }
  if (props.isVertical) {
    style['--fill-top'] = `${100 - maxPercent.value}%`
    style['--fill-height'] = `${maxPercent.value - minPercent.value}%`
  } else {
    style.left = `${minPercent.value}%`
    style.width = `${maxPercent.value - minPercent.value}%`
  }
  return style
})

/** ---------- methods ---------- */
/** 数值限制在范围内 */
function clampNumber(val: number): number {
  return Math.max(props.min, Math.min(props.max, val))
}

/** 格式化数值显示 */
function formatValue(val: number): string {
  const stepStr = String(props.step)
  const decimalIndex = stepStr.indexOf('.')
  if (decimalIndex !== -1) {
    const decimals = stepStr.length - decimalIndex - 1
    return val.toFixed(decimals)
  }
  return String(Math.round(val))
}

/** 获取滑块样式 */
function getThumbStyle(type: 'min' | 'max'): Record<string, string> {
  const percent = type === 'min' ? minPercent.value : maxPercent.value
  const style: Record<string, string> = {}
  if (props.isVertical) {
    // 用 CSS 变量传递值，在 CSS 中用 var() 读取
    style['--thumb-y'] = `${100 - percent}%`
  } else {
    style.left = `${percent}%`
  }
  return style
}

/** 判断步长点是否在激活区域内 */
function isStepActive(index: number): boolean {
  const stepVal = props.min + index * props.step
  return stepVal >= currentMin.value - 0.0001 && stepVal <= currentMax.value + 0.0001
}

/** 获取步长刻度点样式 */
function getStepDotStyle(index: number): Record<string, string> {
  const total = stepCount.value - 1
  const percent = total > 0 ? (index / total) * 100 : 0
  const style: Record<string, string> = {}
  if (props.isVertical) {
    style.top = `${100 - percent}%`
  } else {
    style.left = `${percent}%`
  }
  return style
}

/** 百分比转实际值（带步长对齐） */
function percentToValue(percent: number): number {
  const rawValue = props.min + (percent / 100) * valueRange.value
  if (props.step > 0) {
    const stepped = Math.round((rawValue - props.min) / props.step) * props.step + props.min
    return clampNumber(stepped)
  }
  return clampNumber(rawValue)
}

/** 获取轨道元素位置信息（跨平台） */
function getTrackRect(): Promise<TrackRect> {
  return new Promise((resolve) => {
    let query = uni.createSelectorQuery()
    // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ || MP-KUAISHOU || MP-JD || MP-360 || MP-LARK
    query = uni.createSelectorQuery().in(instance?.proxy)
    // #endif
    query
      .select('.see-slider__track')
      .boundingClientRect((rect: { left?: number; top?: number; width?: number; height?: number } | null) => {
        if (rect) {
          resolve({
            left: rect.left || 0,
            top: rect.top || 0,
            width: rect.width || 0,
            height: rect.height || 0
          })
        } else {
          resolve({ left: 0, top: 0, width: 0, height: 0 })
        }
      })
      .exec()
  })
}

/** 根据触摸/鼠标坐标计算百分比（跨平台，依赖缓存的 trackRect） */
function getPercentByPosition(clientX: number, clientY: number): number {
  const { left, top, width, height } = trackRect.value

  if (props.isVertical) {
    if (height <= 0) return 0
    const offsetY = top + height - clientY
    return Math.max(0, Math.min(100, (offsetY / height) * 100))
  } else {
    if (width <= 0) return 0
    const offsetX = clientX - left
    return Math.max(0, Math.min(100, (offsetX / width) * 100))
  }
}

/** 判断触摸点更接近哪个滑块 */
function getClosestThumb(clientX: number, clientY: number): 'min' | 'max' {
  if (!props.isRange) return 'max'

  const percent = getPercentByPosition(clientX, clientY)
  const distToMin = Math.abs(percent - minPercent.value)
  const distToMax = Math.abs(percent - maxPercent.value)

  return distToMin <= distToMax ? 'min' : 'max'
}

/** 根据坐标更新值 */
function updateValue(clientX: number, clientY: number) {
  const percent = getPercentByPosition(clientX, clientY)
  const newValue = percentToValue(percent)

  if (props.isRange && Array.isArray(props.modelValue)) {
    const arr = [...props.modelValue] as [number, number]
    if (activeThumb.value === 'min') {
      arr[0] = Math.min(newValue, currentMax.value)
    } else {
      arr[1] = Math.max(newValue, currentMin.value)
    }
    emit('update:modelValue', arr)
    emit('onChange', arr)
  } else {
    emit('update:modelValue', newValue)
    emit('onChange', newValue)
  }
}

/** 异步获取轨道位置（跨平台，使用 uni API） */
async function syncTrackRect(): Promise<boolean> {
  const rect = await getTrackRect()
  const { width, height } = rect
  if (width <= 0 && height <= 0) return false
  trackRect.value = rect
  return true
}

/** ---- Touch 事件处理 ---- */
async function onTouchStart(e: TouchEvent) {
  if (mergedDisabled.value || mergedReadonly.value) return
  if (e.touches.length === 0) return

  const touch = e.touches[0]

  // 先刷新轨道位置，确保坐标计算准确
  await syncTrackRect()

  isDragging.value = true

  // 判断最接近的滑块
  activeThumb.value = getClosestThumb(touch.clientX, touch.clientY)

  updateValue(touch.clientX, touch.clientY)

  emit('onDragStart')
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  if (e.touches.length === 0) return

  const touch = e.touches[0]
  updateValue(touch.clientX, touch.clientY)
}

function onTouchEnd() {
  if (!isDragging.value) return

  isDragging.value = false
  emit('onDragEnd')
}

/** ---- Mouse 事件处理（H5 端） ---- */
async function onMouseDown(e: MouseEvent) {
  // #ifdef H5
  if (mergedDisabled.value || mergedReadonly.value) return

  await syncTrackRect()

  activeThumb.value = getClosestThumb(e.clientX, e.clientY)
  isDragging.value = true
  isMouseDown.value = true

  updateValue(e.clientX, e.clientY)
  emit('onDragStart')

  document.addEventListener('mousemove', onDocumentMouseMove)
  document.addEventListener('mouseup', onDocumentMouseUp)
  // #endif
}

function onDocumentMouseMove(e: MouseEvent) {
  // #ifdef H5
  if (!isDragging.value) return
  updateValue(e.clientX, e.clientY)
  // #endif
}

function onDocumentMouseUp() {
  // #ifdef H5
  if (!isDragging.value) return

  isDragging.value = false
  isMouseDown.value = false
  emit('onDragEnd')

  document.removeEventListener('mousemove', onDocumentMouseMove)
  document.removeEventListener('mouseup', onDocumentMouseUp)
  // #endif
}

/** ---------- watch ---------- */
watch(
  () => props.modelValue,
  (newVal) => {
    if (Array.isArray(newVal)) {
      const clamped: [number, number] = [clampNumber(newVal[0] ?? props.min), clampNumber(newVal[1] ?? props.max)]
      if (clamped[0] !== newVal[0] || clamped[1] !== newVal[1]) {
        emit('update:modelValue', clamped)
      }
    } else {
      const clamped = clampNumber(newVal)
      if (clamped !== newVal) {
        emit('update:modelValue', clamped)
      }
    }
  },
  { immediate: true }
)

/** ---------- lifecycle ---------- */
/** 组件挂载后预缓存轨道位置 */
onMounted(() => {
  nextTick(() => {
    syncTrackRect().catch(() => {
      // 轨道未就绪时忽略，会在触摸时重新获取
    })
  })
})

onBeforeUnmount(() => {
  // #ifdef H5
  document.removeEventListener('mousemove', onDocumentMouseMove)
  document.removeEventListener('mouseup', onDocumentMouseUp)
  // #endif
})

/** ---------- expose ---------- */
defineExpose({
  /** 获取当前值 */
  getValue: () => props.modelValue,
  /** 是否禁用 */
  isDisabled: () => mergedDisabled.value
})
</script>

<style lang="scss" scoped>
.see-slider {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 0;
  user-select: none;
  position: relative;
  width: 100%;

  /* ---------- 尺寸变体 ---------- */
  &--small {
    .see-slider__thumb {
      width: 48rpx;
      height: 48rpx;
    }

    .see-slider__value {
      font-size: 24rpx;
      min-width: 48rpx;
    }

    .see-slider__tooltip {
      font-size: 20rpx;
      padding: 4rpx 10rpx;
    }
  }

  &--default {
    .see-slider__thumb {
      width: 56rpx;
      height: 56rpx;
    }

    .see-slider__value {
      font-size: 28rpx;
      min-width: 56rpx;
    }

    .see-slider__tooltip {
      font-size: 22rpx;
      padding: 6rpx 12rpx;
    }
  }

  &--large {
    .see-slider__thumb {
      width: 64rpx;
      height: 64rpx;
    }

    .see-slider__value {
      font-size: 32rpx;
      min-width: 64rpx;
    }

    .see-slider__tooltip {
      font-size: 24rpx;
      padding: 8rpx 14rpx;
    }
  }

  /* ---------- 滑轨容器 ---------- */
  &__track {
    position: relative;
    flex: 1;
    min-width: 0;
    width: 100%;
    display: flex;
    align-items: center;
    touch-action: none;
  }

  /* ---------- 背景轨道 ---------- */
  &__rail {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: var(--see-border-color);
    border-radius: 999rpx;
    overflow: hidden;
  }

  /* ---------- 激活区域 ---------- */
  &__fill {
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: var(--see-primary);
    border-radius: 999rpx;
  }

  /* ---------- 步长刻度 ---------- */
  &__steps {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
  }

  &__step-dot {
    position: absolute;
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    background-color: var(--see-border-three-color);
    transform: translate(-50%, -50%);
    top: 50%;

    &.is-active {
      background-color: var(--see-primary);
    }
  }

  /* ---------- 滑块 ---------- */
  &__thumb {
    position: absolute;
    left: var(--thumb-left, 50%);
    top: var(--thumb-y, 50%);
    transform: translate(-50%, -50%);
    background-color: var(--see-surface-color);
    border-radius: 50%;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
    z-index: 10;
    cursor: grab;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 30%;
      height: 30%;
      border-radius: 50%;
      background-color: var(--see-primary);
      transform: translate(-50%, -50%);
    }

    &.is-dragging {
      cursor: grabbing;
      box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.2);
      transform: translate(-50%, -50%) scale(1.2);
    }

    /* 范围模式 - 最小值滑块 */
    &--min::after {
      background-color: var(--see-primary-light, #a0cfff);
    }
  }

  /* ---------- 提示气泡 ---------- */
  &__tooltip {
    position: absolute;
    bottom: calc(100% + 16rpx);
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--see-main-color);
    color: var(--see-text);
    border-radius: 8rpx;
    white-space: nowrap;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 8rpx solid transparent;
      border-top-color: var(--see-main-color);
    }
  }

  /* ---------- 值文本 ---------- */
  &__value {
    color: var(--see-main-color);
    text-align: center;
    flex-shrink: 0;

    &--start {
      min-width: 80rpx;
    }

    &--end {
      min-width: 80rpx;
    }
  }

  /* ---------- 垂直模式 ---------- */
  &.is-vertical {
    flex-direction: column-reverse;
    width: auto;
    min-height: 300rpx;
    padding: 24rpx;

    .see-slider__track {
      flex: 1;
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .see-slider__rail {
      left: 50%;
      right: auto;
      top: 0;
      bottom: 0;
      width: 100%;
      height: auto;
      transform: translateX(-50%);
    }

    .see-slider__fill {
      left: 50%;
      right: auto;
      top: var(--fill-top, 0);
      bottom: auto;
      width: 100%;
      height: var(--fill-height, 100%);
      transform: translateX(-50%);
    }

    .see-slider__thumb {
      /* top 由 CSS 变量 --thumb-top 控制（base CSS 已设置） */
    }

    .see-slider__tooltip {
      bottom: auto;
      left: calc(100% + 16rpx);
      top: 50%;
      transform: translateY(-50%);

      &::after {
        top: 50%;
        left: auto;
        right: 100%;
        transform: translateY(-50%);
        border: 8rpx solid transparent;
        border-right-color: var(--see-main-color);
        border-top-color: transparent;
      }
    }

    .see-slider__step-dot {
      top: auto;
      left: 50%;
      transform: translate(-50%, 50%);
    }
  }

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;

    .see-slider__thumb {
      cursor: not-allowed;

      &::after {
        background-color: var(--see-border-three-color);
      }
    }

    .see-slider__fill {
      background-color: var(--see-primary-disabled, #a0cfff);
    }
  }

  /* ---------- 只读状态 ---------- */
  &.is-readonly {
    cursor: default;
    pointer-events: none;

    .see-slider__thumb {
      cursor: default;
    }
  }
}
</style>
