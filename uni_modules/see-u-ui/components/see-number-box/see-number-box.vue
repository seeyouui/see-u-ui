<template>
  <view class="see-number-box" :class="numberBoxClasses">
    <!-- 减少按钮 -->
    <view
      class="see-number-box__minus"
      :class="minusClasses"
      @click="handleMinus"
      @touchstart.passive="onMinusTouchStart"
      @touchend.passive="onTouchEnd"
      @touchcancel.passive="onTouchEnd"
      @mousedown="onMinusMouseDown"
    >
      <text class="see-number-box__icon">-</text>
    </view>

    <!-- 输入框 -->
    <view class="see-number-box__input" :style="inputStyle">
      <input
        class="see-number-box__input-inner"
        type="number"
        :value="displayValue"
        :disabled="inputDisabled"
        :readonly="inputReadonly"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
    </view>

    <!-- 增加按钮 -->
    <view
      class="see-number-box__plus"
      :class="plusClasses"
      @click="handlePlus"
      @touchstart.passive="onPlusTouchStart"
      @touchend.passive="onTouchEnd"
      @touchcancel.passive="onTouchEnd"
      @mousedown="onPlusMouseDown"
    >
      <text class="see-number-box__icon">+</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * NumberBox 步进器
 * @description 步进器组件，用于增加或减少某个数值。支持长按连续增减、小数位数限制、表单联动等特性。
 * @tutorial https://www.seeuui.cn/components/number-box/
 *
 * @property {Number}   modelValue       绑定值（v-model，默认 0）
 * @property {Number}   min              最小值（默认 0）
 * @property {Number}   max              最大值（默认 Infinity）
 * @property {Number}   step             步长（默认 1）
 * @property {Boolean}  isDisabled       是否禁用
 * @property {Boolean}  isReadonly       是否只读（输入框只读）
 * @property {Boolean}  isDisabledInput  是否禁用输入框（仅禁用输入，按钮可用）
 * @property {Boolean}  isDisabledPlus   是否禁用增加按钮
 * @property {Boolean}  isDisabledMinus  是否禁用减少按钮
 * @property {Number}   decimalLength    保留小数位数
 * @property {String}   size             尺寸（默认 'default'）
 * @property {Number}   inputWidth       输入框宽度（默认 60）
 * @property {Boolean}  isAsync          是否异步模式（外部控制值）
 * @property {String}   name             表单字段名
 */
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import { formKey } from '../../utils/shared/form-keys'
import type { NumberBoxSize } from './type'

defineOptions({ name: 'SeeNumberBox' })

/** ---------- constants ---------- */
/** 长按初始延迟（ms） */
const LONG_PRESS_DELAY = 600
/** 长按最小间隔（ms），即加速上限 */
const LONG_PRESS_MIN_INTERVAL = 50
/** 长按初始间隔（ms） */
const LONG_PRESS_INITIAL_INTERVAL = 200
/** 长按每次间隔递减量（ms） */
const LONG_PRESS_INTERVAL_STEP = 20

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值 */
    modelValue?: number
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
    /** 是否禁用输入框（仅禁用输入，按钮可用） */
    isDisabledInput?: boolean
    /** 是否禁用增加按钮 */
    isDisabledPlus?: boolean
    /** 是否禁用减少按钮 */
    isDisabledMinus?: boolean
    /** 保留小数位数 */
    decimalLength?: number
    /** 尺寸 */
    size?: NumberBoxSize
    /** 输入框宽度，单位 rpx */
    inputWidth?: number
    /** 是否异步模式（外部控制值） */
    isAsync?: boolean
    /** 表单字段名 */
    name?: string
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: Infinity,
    step: 1,
    isDisabled: false,
    isReadonly: false,
    isDisabledInput: false,
    isDisabledPlus: false,
    isDisabledMinus: false,
    decimalLength: undefined,
    size: 'default',
    inputWidth: 60,
    isAsync: false,
    name: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 值变化时触发 */
  (e: 'onChange', value: number): void
  /** 超出限制时触发 */
  (e: 'onOverlimit'): void
  /** 点击增加按钮触发 */
  (e: 'onPlus'): void
  /** 点击减少按钮触发 */
  (e: 'onMinus'): void
  /** 输入框聚焦触发 */
  (e: 'onFocus'): void
  /** 输入框失焦触发 */
  (e: 'onBlur'): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: number): void
}>()

/** ---------- inject ---------- */
const formContext = inject(formKey, null)

/** ---------- refs ---------- */
/** 输入框当前显示的文本 */
const inputText = ref('')
/** 是否正在输入中（控制显示 modelValue 还是 inputText） */
const isInputting = ref(false)

/** 长按定时器 */
let longPressTimer: ReturnType<typeof setTimeout> | null = null
let longPressRepeatTimer: ReturnType<typeof setTimeout> | null = null
/** 长按结束延迟重置定时器 */
let longPressEndTimer: ReturnType<typeof setTimeout> | null = null
let currentLongPressInterval = LONG_PRESS_INITIAL_INTERVAL
/** 当前长按方向 */
let longPressDirection: 'plus' | 'minus' | null = null
/** 活跃的 document mouseup 监听器（用于卸载时清理） */
let activeMouseUpHandler: (() => void) | null = null

/** ---------- computed ---------- */
/** 实际禁用状态 */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.props.isDisabled || false
})

/** 实际只读状态 */
const mergedReadonly = computed(() => {
  return props.isReadonly || formContext?.props.isReadonly || false
})

/** 实际尺寸 */
const mergedSize = computed(() => {
  return props.size || formContext?.props.size || 'default'
})

/** 输入框是否禁用 */
const inputDisabled = computed(() => {
  return mergedDisabled.value || mergedReadonly.value || props.isDisabledInput
})

/** 输入框是否只读 */
const inputReadonly = computed(() => {
  return mergedDisabled.value || mergedReadonly.value || props.isDisabledInput
})

/** 是否已达到最大值 */
const isMax = computed(() => {
  return props.modelValue >= props.max
})

/** 是否已达到最小值 */
const isMin = computed(() => {
  return props.modelValue <= props.min
})

/** 增加按钮是否禁用 */
const isPlusDisabled = computed(() => {
  return mergedDisabled.value || mergedReadonly.value || props.isDisabledPlus || isMax.value
})

/** 减少按钮是否禁用 */
const isMinusDisabled = computed(() => {
  return mergedDisabled.value || mergedReadonly.value || props.isDisabledMinus || isMin.value
})

/** 输入框显示值 */
const displayValue = computed(() => {
  if (isInputting.value) {
    return inputText.value
  }
  return formatValue(props.modelValue)
})

/** 格式化数值为字符串 */
function formatValue(val: number): string {
  if (props.decimalLength !== undefined && props.decimalLength >= 0) {
    return val.toFixed(props.decimalLength)
  }
  return String(val)
}

/** ---------- styles ---------- */
const numberBoxClasses = computed(() => {
  const classes: string[] = [`see-number-box--${mergedSize.value}`]
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  return classes.join(' ')
})

const inputStyle = computed(() => ({
  width: `${props.inputWidth}rpx`
}))

const minusClasses = computed(() => ({
  'is-disabled': isMinusDisabled.value
}))

const plusClasses = computed(() => ({
  'is-disabled': isPlusDisabled.value
}))

/** ---------- methods ---------- */
/**
 * @title 对数值进行精度修正
 * @description 处理浮点数精度问题，并根据 decimalLength 限制小数位数
 */
function correctPrecision(value: number): number {
  // 处理浮点精度问题：1.005.toFixed(2) => "1.00"
  const factor = Math.pow(10, props.decimalLength ?? 10)
  const result = Math.round(value * factor) / factor

  if (props.decimalLength !== undefined && props.decimalLength >= 0) {
    return Number(result.toFixed(props.decimalLength))
  }
  return result
}

/**
 * @title 将值限制在合法范围内
 */
function clampValue(value: number): number {
  return Math.max(props.min, Math.min(props.max, value))
}

/**
 * @title 更新绑定值
 * @description 计算新值并触发事件
 */
function updateValue(newValue: number, source: 'plus' | 'minus' | 'input'): void {
  const correctedValue = correctPrecision(newValue)

  // 检查是否超出限制
  if (correctedValue > props.max) {
    emit('onOverlimit')
    if (!props.isAsync) {
      emit('update:modelValue', props.max)
      emit('onChange', props.max)
    }
    return
  }
  if (correctedValue < props.min) {
    emit('onOverlimit')
    if (!props.isAsync) {
      emit('update:modelValue', props.min)
      emit('onChange', props.min)
    }
    return
  }

  const finalValue = clampValue(correctedValue)

  if (source === 'plus') {
    emit('onPlus')
  } else if (source === 'minus') {
    emit('onMinus')
  }

  emit('update:modelValue', finalValue)
  emit('onChange', finalValue)
}

/**
 * @title 增加操作
 */
function doPlus(): void {
  if (isPlusDisabled.value) return
  const newValue = props.modelValue + props.step
  updateValue(newValue, 'plus')
}

/**
 * @title 减少操作
 */
function doMinus(): void {
  if (isMinusDisabled.value) return
  const newValue = props.modelValue - props.step
  updateValue(newValue, 'minus')
}

/** ---- 点击事件 ---- */
function handlePlus(): void {
  // 长按结束后会同时触发 click，这里通过长按标记跳过
  if (wasLongPress.value) return
  doPlus()
}

function handleMinus(): void {
  if (wasLongPress.value) return
  doMinus()
}

/** ---- 长按相关 ---- */
/** 标记是否发生了长按（用于区分 click 和长按结束） */
const wasLongPress = ref(false)

/**
 * @title 清除长按定时器
 */
function clearLongPressTimers(): void {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
  if (longPressRepeatTimer) {
    clearTimeout(longPressRepeatTimer)
    longPressRepeatTimer = null
  }
  if (longPressEndTimer) {
    clearTimeout(longPressEndTimer)
    longPressEndTimer = null
  }
  longPressDirection = null
  currentLongPressInterval = LONG_PRESS_INITIAL_INTERVAL
}

/**
 * @title 开始长按重复执行（使用递归 setTimeout 替代 setInterval 实现加速）
 */
function startLongPressRepeat(direction: 'plus' | 'minus'): void {
  const action = direction === 'plus' ? doPlus : doMinus

  // 重置间隔
  currentLongPressInterval = LONG_PRESS_INITIAL_INTERVAL

  // 立即执行一次
  action()

  // 使用递归 setTimeout 实现加速
  function scheduleNext(): void {
    longPressRepeatTimer = setTimeout(() => {
      if (longPressDirection !== direction) return
      action()
      // 加速：逐步缩短间隔
      if (currentLongPressInterval > LONG_PRESS_MIN_INTERVAL) {
        currentLongPressInterval = Math.max(LONG_PRESS_MIN_INTERVAL, currentLongPressInterval - LONG_PRESS_INTERVAL_STEP)
      }
      scheduleNext()
    }, currentLongPressInterval)
  }

  scheduleNext()
}

/**
 * @title 处理长按开始
 */
function handleLongPressStart(direction: 'plus' | 'minus'): void {
  longPressDirection = direction
  wasLongPress.value = false

  longPressTimer = setTimeout(() => {
    wasLongPress.value = true
    startLongPressRepeat(direction)
  }, LONG_PRESS_DELAY)
}

/**
 * @title 处理长按结束
 */
function handleLongPressEnd(): void {
  clearLongPressTimers()
  // 延迟重置长按标记，确保后续 click 事件已被拦截
  longPressEndTimer = setTimeout(() => {
    wasLongPress.value = false
    longPressEndTimer = null
  }, 50)
}

/** ---- Touch 事件（移动端长按） ---- */
function onPlusTouchStart(): void {
  if (isPlusDisabled.value) return
  handleLongPressStart('plus')
}

function onMinusTouchStart(): void {
  if (isMinusDisabled.value) return
  handleLongPressStart('minus')
}

function onTouchEnd(): void {
  handleLongPressEnd()
}

/** ---- Mouse 事件（H5 端长按） ---- */
function onPlusMouseDown(): void {
  // #ifdef H5
  if (isPlusDisabled.value) return
  handleLongPressStart('plus')
  attachMouseUpHandler()
  // #endif
}

function onMinusMouseDown(): void {
  // #ifdef H5
  if (isMinusDisabled.value) return
  handleLongPressStart('minus')
  attachMouseUpHandler()
  // #endif
}

/** 统一注册 document mouseup 监听器，确保不泄漏 */
function attachMouseUpHandler(): void {
  // #ifdef H5
  detachMouseUpHandler()
  activeMouseUpHandler = () => {
    handleLongPressEnd()
    detachMouseUpHandler()
  }
  document.addEventListener('mouseup', activeMouseUpHandler)
  // #endif
}

/** 移除 document mouseup 监听器 */
function detachMouseUpHandler(): void {
  // #ifdef H5
  if (activeMouseUpHandler) {
    document.removeEventListener('mouseup', activeMouseUpHandler)
    activeMouseUpHandler = null
  }
  // #endif
}

/** ---- 输入框事件 ---- */
function onInput(e: { detail?: { value?: string }; target?: EventTarget | null }): void {
  const value = (e.detail?.value ?? (e.target as HTMLInputElement)?.value ?? '') as string
  inputText.value = value

  // 空字符串或负号（正在输入负数）不做处理
  if (value === '' || value === '-') return

  const numValue = Number(value)
  if (isNaN(numValue)) return

  const corrected = correctPrecision(numValue)

  // 不超过 max 的情况下更新
  if (corrected >= props.min && corrected <= props.max) {
    emit('update:modelValue', corrected)
    emit('onChange', corrected)
  }
}

function onFocus(): void {
  isInputting.value = true
  inputText.value = props.modelValue === 0 ? '' : String(props.modelValue)
  emit('onFocus')
}

function onBlur(): void {
  isInputting.value = false

  const rawValue = inputText.value
  // 空输入恢复原值
  if (rawValue === '' || rawValue === '-') {
    // 不做额外处理，displayValue 会恢复为 formatValue(modelValue)
  } else {
    let numValue = Number(rawValue)
    if (!isNaN(numValue)) {
      numValue = correctPrecision(numValue)
      numValue = clampValue(numValue)

      if (numValue !== props.modelValue) {
        emit('update:modelValue', numValue)
        emit('onChange', numValue)
      }
    }
  }

  inputText.value = ''
  emit('onBlur')
}

/** ---------- watch ---------- */
watch(
  () => props.modelValue,
  (newVal) => {
    if (props.isAsync) return
    const clamped = clampValue(newVal)
    if (clamped !== newVal) {
      emit('update:modelValue', clamped)
    }
  },
  { immediate: true }
)

/** ---------- lifecycle ---------- */
onBeforeUnmount(() => {
  clearLongPressTimers()
  detachMouseUpHandler()
})

/** ---------- expose ---------- */
defineExpose({
  /** 获取当前值 */
  getValue: () => props.modelValue,
  /** 是否禁用 */
  isDisabled: () => mergedDisabled.value,
  /** 手动增加 */
  plus: doPlus,
  /** 手动减少 */
  minus: doMinus
})
</script>

<style lang="scss" scoped>
.see-number-box {
  display: inline-flex;
  align-items: center;
  user-select: none;

  /* ---------- 尺寸变体 ---------- */
  &--small {
    height: 52rpx;

    .see-number-box__minus,
    .see-number-box__plus {
      width: 52rpx;
    }

    .see-number-box__icon {
      font-size: 28rpx;
    }

    .see-number-box__input-inner {
      font-size: 24rpx;
    }
  }

  &--default {
    height: 64rpx;

    .see-number-box__minus,
    .see-number-box__plus {
      width: 64rpx;
    }

    .see-number-box__icon {
      font-size: 32rpx;
    }

    .see-number-box__input-inner {
      font-size: 28rpx;
    }
  }

  &--large {
    height: 80rpx;

    .see-number-box__minus,
    .see-number-box__plus {
      width: 80rpx;
    }

    .see-number-box__icon {
      font-size: 36rpx;
    }

    .see-number-box__input-inner {
      font-size: 32rpx;
    }
  }

  /* ---------- 减少按钮 ---------- */
  &__minus {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: var(--see-bg-color, #f5f7fa);
    border-radius: 12rpx 0 0 12rpx;
    border: 2rpx solid var(--see-border-color, #dcdfe6);
    border-right: none;
    cursor: pointer;
    transition:
      opacity 0.2s,
      background-color 0.2s;

    &:active {
      background-color: var(--see-border-color, #dcdfe6);
    }

    &.is-disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  /* ---------- 输入框容器 ---------- */
  &__input {
    height: 100%;
    border-top: 2rpx solid var(--see-border-color, #dcdfe6);
    border-bottom: 2rpx solid var(--see-border-color, #dcdfe6);
    background-color: var(--see-bg-color, #ffffff);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ---------- 输入框 ---------- */
  &__input-inner {
    width: 100%;
    height: 100%;
    text-align: center;
    color: var(--see-text-color, #303133);
    background-color: transparent;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;

    &::placeholder {
      color: var(--see-text-color-placeholder, #c0c4cc);
    }

    &[disabled],
    &[readonly] {
      color: var(--see-text-color-disabled, #c0c4cc);
      cursor: not-allowed;
    }
  }

  /* ---------- 增加按钮 ---------- */
  &__plus {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: var(--see-bg-color, #f5f7fa);
    border-radius: 0 12rpx 12rpx 0;
    border: 2rpx solid var(--see-border-color, #dcdfe6);
    border-left: none;
    cursor: pointer;
    transition:
      opacity 0.2s,
      background-color 0.2s;

    &:active {
      background-color: var(--see-border-color, #dcdfe6);
    }

    &.is-disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  /* ---------- 图标 ---------- */
  &__icon {
    color: var(--see-text-color, #303133);
    font-weight: 600;
    line-height: 1;
  }

  /* ---------- 整体禁用 ---------- */
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;

    .see-number-box__minus,
    .see-number-box__plus {
      cursor: not-allowed;
    }

    .see-number-box__input-inner {
      cursor: not-allowed;
    }
  }

  /* ---------- 整体只读 ---------- */
  &.is-readonly {
    .see-number-box__input-inner {
      cursor: default;
    }
  }
}
</style>
