<template>
  <view class="see-textarea" :class="textareaClasses">
    <!-- 输入区域容器 -->
    <view class="see-textarea__wrapper" :style="wrapperStyle">
      <!-- uni-app 原生 textarea -->
      <textarea
        class="see-textarea__inner"
        :value="innerValue"
        :placeholder="placeholder"
        :disabled="mergedDisabled || mergedReadonly"
        :maxlength="maxlength"
        :auto-height="isAutoHeight"
        :focus="isFocus"
        :confirm-type="confirmType"
        :placeholder-style="placeholderStyleStr"
        :placeholder-class="'see-textarea__placeholder'"
        :style="innerStyle"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
        @keyboardheightchange="handleKeyboardHeightChange"
        @linechange="handleLineChange"
      />

      <!-- 清除按钮 -->
      <view v-if="isShowClear" class="see-textarea__clear" @click.stop="handleClear">
        <text class="see-textarea__clear-icon">&times;</text>
      </view>
    </view>

    <!-- 底部栏：字数统计 -->
    <view v-if="isShowWordLimit" class="see-textarea__footer">
      <text class="see-textarea__word-count" :class="{ 'is-over': isOverLimit }">{{ currentLength }}/{{ maxlength }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Textarea 文本域
 * @description 文本域组件，支持自动增高、字数统计、清除按钮、表单联动等功能。
 * @tutorial https://www.seeuui.cn/components/textarea/
 *
 * @property {String}                       modelValue        绑定值（v-model）
 * @property {String}                       placeholder       占位符
 * @property {Boolean}                      isDisabled        是否禁用（默认 false）
 * @property {Boolean}                      isReadonly        是否只读（默认 false）
 * @property {Number}                       maxlength         最大输入长度（默认 -1 不限制）
 * @property {Boolean}                      isShowWordLimit   是否显示字数统计（默认 false）
 * @property {Number}                       rows              行数（默认 3）
 * @property {Boolean}                      isAutoHeight      是否自动增高（默认 false）
 * @property {Boolean}                      isBorder          是否显示边框（默认 true）
 * @property {Boolean}                      isFocus           是否自动聚焦（默认 false）
 * @property {Boolean}                      isClearable       是否显示清除按钮（默认 false）
 * @property {'small' | 'default' | 'large'} size            尺寸（默认 'default'）
 * @property {String}                       name              表单字段名
 * @property {Record<String, any>}          inputStyle        自定义输入框样式
 * @property {'return' | 'send' | 'search' | 'next' | 'go'} confirmType 键盘右下角按钮文字（默认 'return'）
 */
import { computed, inject, ref, watch } from 'vue'
import { useField } from '../../utils/hooks/useField'
import { formKey } from '../../utils/shared/form-keys'
import type { ConfirmType, FormContext, TextareaSize, TextareaInputEvent, TextareaKeyboardEvent, TextareaLineChangeEvent } from './type'

defineOptions({ name: 'SeeTextarea' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值（v-model） */
    modelValue?: string
    /** 占位符 */
    placeholder?: string
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 最大输入长度（-1 表示不限制） */
    maxlength?: number
    /** 是否显示字数统计 */
    isShowWordLimit?: boolean
    /** 行数 */
    rows?: number
    /** 是否自动增高 */
    isAutoHeight?: boolean
    /** 是否显示边框 */
    isBorder?: boolean
    /** 是否自动聚焦 */
    isFocus?: boolean
    /** 是否显示清除按钮 */
    isClearable?: boolean
    /** 尺寸 */
    size?: TextareaSize
    /** 表单字段名 */
    name?: string
    /** 自定义输入框样式 */
    inputStyle?: import('vue').CSSProperties
    /** 键盘右下角按钮文字 */
    confirmType?: ConfirmType
  }>(),
  {
    modelValue: '',
    placeholder: '请输入内容',
    isDisabled: false,
    isReadonly: false,
    maxlength: -1,
    isShowWordLimit: false,
    rows: 3,
    isAutoHeight: false,
    isBorder: true,
    isFocus: false,
    isClearable: false,
    size: 'default',
    name: '',
    inputStyle: () => ({}),
    confirmType: 'return'
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 输入时触发 */
  (e: 'onInput', value: string): void
  /** 聚焦时触发 */
  (e: 'onFocus', event: TextareaInputEvent): void
  /** 失焦时触发 */
  (e: 'onBlur', event: TextareaInputEvent): void
  /** 清除时触发 */
  (e: 'onClear'): void
  /** 值变化时触发（失焦后） */
  (e: 'onChange', value: string): void
  /** 键盘确认时触发 */
  (e: 'onConfirm', value: string): void
  /** 键盘高度变化时触发 */
  (e: 'onKeyboardHeightChange', height: number): void
  /** 行数变化时触发 */
  (e: 'onLineChange', lines: number): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string): void
}>()

/** ---------- inject ---------- */
const formContext = inject<FormContext | null>(formKey, null)

/** ---------- Form 联动（useField） ---------- */
const field = useField({
  field: props.name || '',
  getValue: () => props.modelValue,
  trigger: 'blur',
  onValueChange: (val: unknown) => {
    emit('update:modelValue', val as string)
  }
})

const validateStatus = field?.validateStatus ?? ref('')
const validateMessage = field?.validateMessage ?? ref('')
const fieldDisabled = field?.isDisabled ?? computed(() => false)
const fieldReadonly = field?.isReadonly ?? computed(() => false)

/** ---------- state ---------- */
/** 每行基准高度（px），用于计算 min-height / height */
const ROW_LINE_HEIGHT = 24

/** 内部维护的值，用于处理 v-model */
const innerValue = ref(props.modelValue)
/** 是否聚焦 */
const isFocused = ref(false)

/** ---------- computed ---------- */
/** 实际禁用状态（考虑 Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || fieldDisabled.value || false
})

/** 实际只读状态（考虑 Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || fieldReadonly.value || false
})

/** 实际尺寸（考虑 Form 联动） */
const mergedSize = computed(() => {
  return props.size || formContext?.props?.size || 'default'
})

/** 当前输入长度 */
const currentLength = computed(() => {
  return innerValue.value.length
})

/** 是否超出字数限制 */
const isOverLimit = computed(() => {
  return props.maxlength > 0 && currentLength.value > props.maxlength
})

/** 是否显示清除按钮 */
const isShowClear = computed(() => {
  return props.isClearable && !mergedDisabled.value && !mergedReadonly.value && innerValue.value.length > 0
})

/** 是否显示字数统计（组件级别） */
const isShowWordLimit = computed(() => {
  return props.isShowWordLimit && props.maxlength > 0
})

/** 是否处于校验错误状态 */
const isError = computed(() => {
  return validateStatus.value === 'error'
})

/** placeholder 样式字符串（静态值，避免不必要的响应式开销） */
const placeholderStyleStr = 'color: var(--see-tips-color);'

/** ---------- classes ---------- */
/** 组件样式类 */
const textareaClasses = computed(() => {
  const classes: string[] = [`see-textarea--${mergedSize.value}`]
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (isFocused.value) classes.push('is-focused')
  if (props.isBorder) classes.push('is-border')
  if (isOverLimit.value) classes.push('is-over-limit')
  if (isError.value) classes.push('is-error')
  return classes.join(' ')
})

/** 容器样式 */
const wrapperStyle = computed(() => {
  const style: Record<string, string> = {}
  if (!props.isAutoHeight && props.rows > 0) {
    style.minHeight = `${props.rows * ROW_LINE_HEIGHT}px`
  }
  return style
})

/** 输入框内部样式 */
const innerStyle = computed<Record<string, string | number>>(() => {
  const style: Record<string, string | number> = {
    ...props.inputStyle
  }
  if (!props.isAutoHeight && props.rows > 0) {
    style.height = `${props.rows * ROW_LINE_HEIGHT}px`
  }
  return style
})

/** ---------- watch ---------- */
/** 监听外部 modelValue 变化（immediate 确保初始化时同步） */
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== innerValue.value) {
      innerValue.value = newVal
    }
  },
  { immediate: true }
)

/** ---------- events ---------- */
/**
 * @title 处理输入事件
 * @description 处理 textarea 的输入事件，同步更新 v-model 并触发 onInput
 */
const handleInput = (e: TextareaInputEvent) => {
  const value = e.detail?.value ?? ''
  innerValue.value = value
  emit('update:modelValue', value)
  emit('onInput', value)
}

/**
 * @title 处理聚焦事件
 * @description 触发 onFocus 事件并更新聚焦状态
 */
const handleFocus = (e: TextareaInputEvent) => {
  isFocused.value = true
  emit('onFocus', e)
}

/**
 * @title 处理失焦事件
 * @description 触发 onBlur 和 onChange 事件并更新聚焦状态
 */
const handleBlur = (e: TextareaInputEvent) => {
  isFocused.value = false
  emit('onBlur', e)
  emit('onChange', innerValue.value)
  field?.handleBlur()
  field?.handleChange(innerValue.value)
}

/**
 * @title 处理键盘确认事件
 * @description 触发 onConfirm 事件
 */
const handleConfirm = (_e: TextareaInputEvent) => {
  emit('onConfirm', innerValue.value)
}

/**
 * @title 处理键盘高度变化
 * @description 触发 onKeyboardHeightChange 事件
 */
const handleKeyboardHeightChange = (e: TextareaKeyboardEvent) => {
  const height = e.detail?.height ?? 0
  emit('onKeyboardHeightChange', height)
}

/**
 * @title 处理行数变化
 * @description 触发 onLineChange 事件
 */
const handleLineChange = (e: TextareaLineChangeEvent) => {
  const lines = e.detail?.lineCount ?? 0
  emit('onLineChange', lines)
}

/**
 * @title 处理清除事件
 * @description 清空输入值并触发 onClear 和 onChange 事件
 */
const handleClear = () => {
  if (mergedDisabled.value || mergedReadonly.value) return
  innerValue.value = ''
  emit('update:modelValue', '')
  emit('onClear')
  emit('onChange', '')
}

/** ---------- expose ---------- */
defineExpose({
  /** 获取当前值 */
  getValue: () => innerValue.value,
  /** 设置值 */
  setValue: (value: string) => {
    innerValue.value = value
    emit('update:modelValue', value)
  },
  /** 清空值 */
  clear: handleClear,
  /** 是否禁用 */
  isDisabled: () => mergedDisabled.value,
  /** 是否聚焦 */
  isFocused: () => isFocused.value,
  /** 校验状态 */
  validateStatus,
  /** 校验信息 */
  validateMessage
})
</script>

<style lang="scss" scoped>
.see-textarea {
  /* ---------- 组件级 CSS 变量 ---------- */
  --textarea-font-size-small: 24rpx;
  --textarea-font-size-default: 28rpx;
  --textarea-font-size-large: 32rpx;
  --textarea-clear-size: 40rpx;
  --textarea-border-radius-small: 8rpx;
  --textarea-border-radius-default: 12rpx;
  --textarea-border-radius-large: 16rpx;
  --textarea-padding-h-small: 16rpx;
  --textarea-padding-v-small: 12rpx;
  --textarea-padding-h-default: 24rpx;
  --textarea-padding-v-default: 20rpx;
  --textarea-padding-h-large: 32rpx;
  --textarea-padding-v-large: 24rpx;
}

.see-textarea {
  position: relative;
  width: 100%;

  /* ---------- 尺寸变体 ---------- */
  &--small {
    .see-textarea__wrapper {
      padding: var(--textarea-padding-v-small) var(--textarea-padding-h-small);
      border-radius: var(--textarea-border-radius-small);
    }

    .see-textarea__inner {
      font-size: var(--textarea-font-size-small);
      line-height: 1.5;
    }

    .see-textarea__clear-icon {
      font-size: 28rpx;
    }

    .see-textarea__word-count {
      font-size: 22rpx;
    }
  }

  &--default {
    .see-textarea__wrapper {
      padding: var(--textarea-padding-v-default) var(--textarea-padding-h-default);
      border-radius: var(--textarea-border-radius-default);
    }

    .see-textarea__inner {
      font-size: var(--textarea-font-size-default);
      line-height: 1.5;
    }

    .see-textarea__clear-icon {
      font-size: 32rpx;
    }

    .see-textarea__word-count {
      font-size: 24rpx;
    }
  }

  &--large {
    .see-textarea__wrapper {
      padding: var(--textarea-padding-v-large) var(--textarea-padding-h-large);
      border-radius: var(--textarea-border-radius-large);
    }

    .see-textarea__inner {
      font-size: var(--textarea-font-size-large);
      line-height: 1.5;
    }

    .see-textarea__clear-icon {
      font-size: 36rpx;
    }

    .see-textarea__word-count {
      font-size: 26rpx;
    }
  }

  /* ---------- 包裹层 ---------- */
  &__wrapper {
    position: relative;
    display: flex;
    align-items: flex-start;
    background-color: var(--see-bg-color);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  /* ---------- 边框模式 ---------- */
  &.is-border &__wrapper {
    border: 2rpx solid var(--see-border-three-color);

    &:hover {
      border-color: var(--see-border-two-color);
    }
  }

  /* ---------- 聚焦状态 ---------- */
  &.is-focused.is-border &__wrapper {
    border-color: var(--see-primary);
    box-shadow: 0 0 0 2rpx var(--see-primary-light);
  }

  /* ---------- 错误状态 ---------- */
  &.is-error.is-border &__wrapper {
    border-color: var(--see-error);
    box-shadow: 0 0 0 2rpx var(--see-error-light);
  }

  /* ---------- 输入框 ---------- */
  &__inner {
    flex: 1;
    width: 100%;
    min-height: 0;
    padding: 0;
    margin: 0;
    background-color: transparent;
    color: var(--see-main-color);
    border: none;
    outline: none;
    resize: none;
    box-sizing: border-box;
    caret-color: var(--see-primary);

    /* 隐藏 uni-app 原生 textarea 的边框（小程序端） */
    /* #ifdef MP */
    &::after {
      display: none;
    }
    /* #endif */
  }

  /* ---------- 占位符 ---------- */
  &__placeholder {
    color: var(--see-tips-color);
  }

  /* ---------- 清除按钮 ---------- */
  &__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40rpx;
    height: 40rpx;
    margin-left: 12rpx;
    margin-top: 4rpx;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: var(--see-border-three-color);
    cursor: pointer;

    &:active {
      background-color: var(--see-border-two-color);
    }
  }

  &__clear-icon {
    color: var(--see-bg-color);
    line-height: 1;
    font-weight: bold;
  }

  /* ---------- 底部栏 ---------- */
  &__footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 8rpx;
    padding: 0 4rpx;
  }

  /* ---------- 字数统计 ---------- */
  &__word-count {
    color: var(--see-tips-color);

    &.is-over {
      color: var(--see-error);
    }
  }

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;

    .see-textarea__inner {
      cursor: not-allowed;
      -webkit-text-fill-color: var(--see-content-color);
    }
  }

  /* ---------- 只读状态 ---------- */
  &.is-readonly {
    .see-textarea__inner {
      cursor: default;
    }
  }

  /* ---------- 超出限制 ---------- */
  &.is-over-limit {
    .see-textarea__inner {
      color: var(--see-error);
    }
  }
}
</style>
