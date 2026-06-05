<template>
  <view class="see-code" :class="codeClasses" :style="codeStyle" @click="handleContainerClick">
    <!-- 隐藏的原生 input 接收输入 -->
    <input
      ref="inputRef"
      class="see-code__hidden-input"
      :value="modelValue"
      :type="inputType"
      :maxlength="length"
      :focus="needFocus"
      :disabled="mergedDisabled"
      :adjust-position="true"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @paste="handlePaste"
    />

    <!-- 显示的格子 -->
    <view
      v-for="(_, index) in length"
      :key="index"
      class="see-code__cell"
      :class="getCellClasses(index)"
      @click="handleCellClick(index)"
    >
      <!-- 遮罩圆点 -->
      <view v-if="isMask && chars[index]" class="see-code__dot"></view>
      <!-- 文字 -->
      <text v-else-if="chars[index]" class="see-code__text">
        {{ chars[index] }}
      </text>
      <!-- 光标 -->
      <view v-if="shouldShowCursor(index)" class="see-code__cursor"></view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeCode 验证码输入框
 * @description 验证码/短密码输入框，支持多种显示模式和遮罩
 * @tutorial https://www.seeuui.cn/components/code/
 *
 * @property {String}   modelValue  绑定值（v-model）
 * @property {Number}   length      验证码长度（默认 4）
 * @property {Boolean}  isFocus     是否自动聚焦（默认 true）
 * @property {Boolean}  isDisabled  是否禁用（默认 false）
 * @property {Boolean}  isReadonly  是否只读（默认 false）
 * @property {String}   size        尺寸（默认 'default'）
 * @property {String}   type        显示类型（默认 'box'）
 * @property {Boolean}  isMask      是否遮罩（默认 false）
 * @property {Number}   gap         格子间距，单位 rpx（默认 10）
 * @property {String}   name        表单字段名
 * @property {String}   keyboard    键盘类型（默认 'number'）
 * @property {Boolean}  isCursor    是否显示光标闪烁动画（默认 false）
 */
import { computed, inject, nextTick, ref, watch } from 'vue'
import { formKey } from '../../utils/shared/form-keys'
import type { CodeSize, CodeType, FormContext } from './type'

defineOptions({ name: 'SeeCode' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值（v-model） */
    modelValue?: string
    /** 验证码长度 */
    length?: number
    /** 是否自动聚焦 */
    isFocus?: boolean
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 尺寸 */
    size?: CodeSize
    /** 显示类型：方框/底线/下划线 */
    type?: CodeType
    /** 输入时是否遮罩（显示为圆点） */
    isMask?: boolean
    /** 格子间距，单位 rpx */
    gap?: number
    /** 表单字段名 */
    name?: string
    /** 键盘类型 */
    keyboard?: 'number' | 'text'
    /** 是否显示光标闪烁动画 */
    isCursor?: boolean
  }>(),
  {
    modelValue: '',
    length: 4,
    isFocus: true,
    isDisabled: false,
    isReadonly: false,
    size: 'default',
    type: 'box',
    isMask: false,
    gap: 10,
    name: '',
    keyboard: 'number',
    isCursor: false
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 值变化时触发 */
  (e: 'onChange', value: string): void
  /** 输入完成时触发（达到指定长度） */
  (e: 'onComplete', value: string): void
  /** 聚焦时触发 */
  (e: 'onFocus'): void
  /** 失焦时触发 */
  (e: 'onBlur'): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string): void
}>()

/** ---------- inject ---------- */
const formContext = inject(formKey, null)

/** ---------- refs ---------- */
const inputRef = ref<any>(null)
const isFocused = ref(false)
/** 非 H5 端通过切换此 ref 来重新触发 input 聚焦 */
const needFocus = ref(props.isFocus)

/** ---------- computed ---------- */
/** 实际禁用状态（考虑 Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.isDisabled || false
})

/** 实际只读状态（考虑 Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || formContext?.isReadonly || false
})

/** 实际尺寸（优先本地 > Form > default） */
const mergedSize = computed(() => {
  return props.size || formContext?.size || 'default'
})

/** input 的 type 属性 */
const inputType = computed(() => {
  return props.keyboard === 'number' ? 'number' : 'text'
})

/** 自动聚焦（仅在组件挂载时生效） */
const autoFocus = computed(() => {
  return props.isFocus && !mergedDisabled.value && !mergedReadonly.value
})

/** 当前值的字符数组 */
const chars = computed(() => {
  const val = props.modelValue || ''
  const result: string[] = []
  for (let i = 0; i < props.length; i++) {
    result.push(val[i] || '')
  }
  return result
})

/** 当前光标位置（下一个待输入的位置） */
const cursorIndex = computed(() => {
  const val = props.modelValue || ''
  if (val.length >= props.length) return -1
  return val.length
})

/** 组件样式类 */
const codeClasses = computed(() => {
  const classes: string[] = [`see-code--${mergedSize.value}`, `see-code--${props.type}`]
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (isFocused.value) classes.push('is-focused')
  return classes.join(' ')
})

/** 组件整体样式 */
const codeStyle = computed(() => {
  return {
    gap: `${props.gap}rpx`
  }
})

/** ---------- methods ---------- */
/**
 * @title 获取单元格样式类
 * @param index 单元格索引
 */
function getCellClasses(index: number): string {
  const classes: string[] = []
  const val = props.modelValue || ''

  if (val[index]) {
    classes.push('is-filled')
  }
  if (cursorIndex.value === index && isFocused.value) {
    classes.push('is-active')
  }
  if (mergedDisabled.value) {
    classes.push('is-disabled')
  }
  if (mergedReadonly.value) {
    classes.push('is-readonly')
  }

  return classes.join(' ')
}

/**
 * @title 是否显示光标
 * @param index 单元格索引
 */
function shouldShowCursor(index: number): boolean {
  return props.isCursor && isFocused.value && cursorIndex.value === index
}

/**
 * @title 处理输入事件
 * @description 截取到指定长度，更新 v-model，触发 onChange / onComplete
 */
function handleInput(e: { detail?: { value: string }, target?: { value: string } }) {
  if (mergedDisabled.value || mergedReadonly.value) return

  let value = String(e.detail?.value ?? e.target?.value ?? '')

  // 非数字键盘时，过滤非法字符（仅保留字母数字）
  if (props.keyboard === 'number') {
    value = value.replace(/[^0-9]/g, '')
  }

  // 截取到指定长度
  value = value.slice(0, props.length)

  // 更新 v-model
  emit('update:modelValue', value)
  emit('onChange', value)

  // 判断是否输入完成
  if (value.length === props.length) {
    emit('onComplete', value)
  }
}

/**
 * @title 处理粘贴事件
 * @description 将粘贴内容截取到指定长度并更新
 */
function handlePaste(e: { clipboardData?: { getData: (type: string) => string }, detail?: { value: string, text?: string } }) {
  if (mergedDisabled.value || mergedReadonly.value) return

  let pasted = (e.clipboardData?.getData('text') || '').trim()
  // #ifndef H5
  pasted = (e.detail?.value || e.detail?.text || '').trim()
  // #endif

  if (!pasted) return

  let value = props.keyboard === 'number' ? pasted.replace(/[^0-9]/g, '') : pasted
  value = value.slice(0, props.length)

  // 合并已有值（保留已输入的，用粘贴内容填充剩余位置）
  const existing = props.modelValue || ''
  const merged = (existing + value).slice(0, props.length)

  emit('update:modelValue', merged)
  emit('onChange', merged)

  if (merged.length === props.length) {
    emit('onComplete', merged)
  }
}

/**
 * @title 处理聚焦事件
 */
function handleFocus() {
  if (mergedDisabled.value) return
  isFocused.value = true
  emit('onFocus')
}

/**
 * @title 处理失焦事件
 */
function handleBlur() {
  isFocused.value = false
  emit('onBlur')
}

/**
 * @title 点击容器时聚焦 input
 */
function handleContainerClick() {
  if (mergedDisabled.value || mergedReadonly.value) return
  focusInput()
}

/**
 * @title 点击单元格时聚焦 input
 * @param index 单元格索引
 */
function handleCellClick(index: number) {
  if (mergedDisabled.value || mergedReadonly.value) return
  focusInput()
}

/**
 * @title 聚焦隐藏 input
 */
function focusInput() {
  if (mergedDisabled.value || mergedReadonly.value) return
  isFocused.value = true
  // #ifdef H5
  nextTick(() => {
    const el = inputRef.value?.$el?.querySelector?.('input') || inputRef.value
    if (el?.focus) el.focus()
  })
  // #endif
  // #ifndef H5
  // 小程序端通过切换 needFocus 来重新触发聚焦
  needFocus.value = false
  nextTick(() => {
    needFocus.value = true
  })
  // #endif
}

/** ---------- expose ---------- */
defineExpose({
  /** 聚焦输入框 */
  focus: focusInput,
  /** 获取当前值 */
  getValue: () => props.modelValue || '',
  /** 是否禁用 */
  isDisabled: () => mergedDisabled.value
})
</script>

<style lang="scss" scoped>
.see-code {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  /* ---------- 隐藏的原生 input ---------- */
  &__hidden-input {
    position: absolute;
    left: -200%;
    top: 0;
    width: 10rpx;
    height: 100%;
    opacity: 0;
    z-index: -1;
    pointer-events: none;
  }

  /* ---------- 单元格基础 ---------- */
  &__cell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    overflow: hidden;
  }

  /* ---------- 遮罩圆点 ---------- */
  &__dot {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    background-color: var(--see-main-color);
  }

  /* ---------- 文字 ---------- */
  &__text {
    color: var(--see-main-color);
    line-height: 1;
  }

  /* ---------- 光标 ---------- */
  &__cursor {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 4rpx;
    height: 40%;
    border-radius: 2rpx;
    background-color: var(--see-primary);
    animation: see-code-cursor-blink 1s step-end infinite;
  }

  @keyframes see-code-cursor-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  /* ========================================================
   * 尺寸变体 - small
   * ======================================================== */
  &--small {
    .see-code__cell {
      width: 80rpx;
      height: 80rpx;
    }

    .see-code__text {
      font-size: 40rpx;
    }

    .see-code__dot {
      width: 20rpx;
      height: 20rpx;
    }

    .see-code__cursor {
      width: 3rpx;
    }
  }

  /* ========================================================
   * 尺寸变体 - default
   * ======================================================== */
  &--default {
    .see-code__cell {
      width: 100rpx;
      height: 100rpx;
    }

    .see-code__text {
      font-size: 48rpx;
    }

    .see-code__dot {
      width: 24rpx;
      height: 24rpx;
    }

    .see-code__cursor {
      width: 4rpx;
    }
  }

  /* ========================================================
   * 尺寸变体 - large
   * ======================================================== */
  &--large {
    .see-code__cell {
      width: 120rpx;
      height: 120rpx;
    }

    .see-code__text {
      font-size: 56rpx;
    }

    .see-code__dot {
      width: 28rpx;
      height: 28rpx;
    }

    .see-code__cursor {
      width: 5rpx;
    }
  }

  /* ========================================================
   * 显示类型 - box（方框）
   * ======================================================== */
  &--box {
    .see-code__cell {
      border: 2rpx solid var(--see-border-color);
      border-radius: 12rpx;
      background-color: var(--see-bg-color, #ffffff);

      &.is-active {
        border-color: var(--see-primary);
        box-shadow: 0 0 0 2rpx var(--see-primary-light);
      }

      &.is-filled {
        border-color: var(--see-primary);
      }
    }
  }

  /* ========================================================
   * 显示类型 - line（底线）
   * ======================================================== */
  &--line {
    .see-code__cell {
      border: none;
      border-bottom: 4rpx solid var(--see-border-color);
      border-radius: 0;
      background-color: transparent;

      &.is-active {
        border-bottom-color: var(--see-primary);
      }

      &.is-filled {
        border-bottom-color: var(--see-primary);
      }
    }
  }

  /* ========================================================
   * 显示类型 - bottom（下划线）
   * ======================================================== */
  &--bottom {
    .see-code__cell {
      border: 2rpx solid var(--see-border-color);
      border-bottom: 6rpx solid var(--see-border-color);
      border-radius: 12rpx 12rpx 0 0;
      background-color: var(--see-bg-color, #ffffff);

      &.is-active {
        border-color: var(--see-primary);
        border-bottom-color: var(--see-primary);
      }

      &.is-filled {
        border-color: var(--see-primary);
        border-bottom-color: var(--see-primary);
      }
    }
  }

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    .see-code__cell {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: var(--see-info-disabled, #ebeef5);
    }

    .see-code__text {
      color: var(--see-tips-color);
    }

    .see-code__dot {
      background-color: var(--see-tips-color);
    }
  }

  /* ---------- 只读状态 ---------- */
  &.is-readonly {
    cursor: default;

    .see-code__cell {
      cursor: default;
    }
  }
}
</style>
