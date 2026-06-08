<template>
  <view class="see-input" :class="inputClasses">
    <!-- 前缀插槽 / 图标 -->
    <view v-if="$slots.prefix || props.prefixIcon" class="see-input__prefix">
      <slot name="prefix">
        <text v-if="props.prefixIcon" :class="safePrefixIcon" class="see-input__icon"></text>
      </slot>
    </view>

    <!-- 输入框主体 -->
    <view class="see-input__wrapper">
      <input
        ref="inputRef"
        class="see-input__inner"
        :style="props.inputStyle"
        :value="displayValue"
        :type="computedType"
        :password="isActualPassword"
        :placeholder="props.placeholder"
        :disabled="mergedDisabled || mergedReadonly"
        :maxlength="computedMaxlength"
        :focus="needFocus"
        :confirm-type="'done'"
        :adjust-position="true"
        :auto-blur="false"
        placeholder-class="see-input__placeholder"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
        @keyboardheightchange="handleKeyboardHeightChange"
      />

      <!-- 字数统计（在输入框内部右侧） -->
      <view v-if="isShowWordLimit" class="see-input__word-limit">
        <text class="see-input__word-num">{{ currentLength }}</text>
        <text class="see-input__word-sep">/</text>
        <text class="see-input__word-max">{{ props.maxlength }}</text>
      </view>
    </view>

    <!-- 清除按钮 -->
    <view v-if="isShowClear" class="see-input__action" @click.stop="handleClear">
      <text class="see-input__action-icon see-input-icon-close-circle"></text>
    </view>

    <!-- 密码切换按钮 -->
    <view v-if="isShowPasswordToggle" class="see-input__action" @click.stop="togglePasswordVisible">
      <text class="see-input__action-icon" :class="passwordVisible ? 'see-input-icon-eye' : 'see-input-icon-eye-off'"></text>
    </view>

    <!-- 后缀插槽 / 图标 -->
    <view v-if="showSuffix" class="see-input__suffix">
      <slot name="suffix">
        <text v-if="props.suffixIcon" :class="safeSuffixIcon" class="see-input__icon"></text>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Input 输入框
 * @description 通过键盘输入内容，是最基础的表单域包装
 * @tutorial https://www.seeuui.cn/components/input/
 *
 * @property {String | Number}  modelValue         绑定值（v-model）
 * @property {String}           type               输入类型（默认 'text'）
 * @property {String}           placeholder        占位符
 * @property {Boolean}          isDisabled          是否禁用
 * @property {Boolean}          isReadonly          是否只读
 * @property {Boolean}          isClearable         是否显示清除按钮
 * @property {Number}           maxlength           最大输入长度
 * @property {Boolean}          isShowWordLimit     是否显示字数统计
 * @property {String}           prefixIcon          前缀图标
 * @property {String}           suffixIcon          后缀图标
 * @property {String}           size                尺寸（默认 'default'）
 * @property {Boolean}          isBorder            是否显示边框（默认 true）
 * @property {Boolean}          isFocus             是否自动聚焦
 * @property {Object}           inputStyle          自定义输入框样式
 * @property {String}           name                表单字段名
 * @property {Function}         formatter           输入格式化函数
 * @property {Function}         parser              格式化内容解析函数
 * @property {Boolean}          isShowPassword      是否显示密码切换按钮
 * @property {String}           autocomplete        自动完成（H5）
 */
import { ref, computed, watch, nextTick, inject, useSlots, onBeforeUnmount } from 'vue'
import { useField } from '../../utils/hooks/useField'
import { formKey } from '../../utils/shared/form-keys'
import type { InputType, InputSize, InputEvent, FormContext } from './type'

defineOptions({ name: 'SeeInput' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值 */
    modelValue?: string | number
    /** 输入类型 */
    type?: InputType
    /** 占位符 */
    placeholder?: string
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 是否显示清除按钮 */
    isClearable?: boolean
    /** 最大输入长度 */
    maxlength?: number
    /** 是否显示字数统计 */
    isShowWordLimit?: boolean
    /** 前缀图标 */
    prefixIcon?: string
    /** 后缀图标 */
    suffixIcon?: string
    /** 尺寸 */
    size?: InputSize
    /** 是否显示边框 */
    isBorder?: boolean
    /** 是否自动聚焦 */
    isFocus?: boolean
    /** 自定义输入框样式 */
    inputStyle?: import('vue').CSSProperties
    /** 表单字段名 */
    name?: string
    /** 输入格式化函数 */
    formatter?: (value: string) => string
    /** 格式化内容解析函数 */
    parser?: (value: string) => string
    /** 是否显示密码切换按钮 */
    isShowPassword?: boolean
    /** 自动完成（H5） */
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '请输入',
    isDisabled: false,
    isReadonly: false,
    isClearable: false,
    maxlength: -1,
    isShowWordLimit: false,
    prefixIcon: '',
    suffixIcon: '',
    size: 'default',
    isBorder: true,
    isFocus: false,
    inputStyle: () => ({}),
    name: '',
    formatter: undefined,
    parser: undefined,
    isShowPassword: false,
    autocomplete: 'off'
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 输入时触发 */
  (e: 'onInput', value: string | number): void
  /** 聚焦时触发 */
  (e: 'onFocus', event: InputEvent): void
  /** 失焦时触发 */
  (e: 'onBlur', event: InputEvent): void
  /** 清除时触发 */
  (e: 'onClear'): void
  /** 值变化时触发（失焦后） */
  (e: 'onChange', value: string | number): void
  /** 键盘确认时触发 */
  (e: 'onConfirm', value: string | number): void
  /** 键盘高度变化时触发 */
  (e: 'onKeyboardHeightChange', height: number): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string | number): void
}>()

/** 注入 Form 上下文（用于获取 Form 级别的 size） */
const formContext = inject<FormContext | null>(formKey, null)

/** ---------- Form 联动（useField） ---------- */
const field = useField({
  field: props.name || '',
  getValue: () => props.modelValue,
  trigger: 'blur',
  onValueChange: (_value: unknown) => {
    // 由 useField 内部管理 change 校验触发
  }
})

const validateStatus = field?.validateStatus ?? ref('')
const validateMessage = field?.validateMessage ?? ref('')
const fieldDisabled = field?.isDisabled ?? computed(() => false)
const fieldReadonly = field?.isReadonly ?? computed(() => false)

/** 插槽引用 */
const slots = useSlots()

/** ---------- refs ---------- */
/** uni-app input 组件实例引用 */
const inputRef = ref<Record<string, unknown> | null>(null)
/** 是否聚焦 */
const focused = ref(false)
/** 密码是否可见 */
const passwordVisible = ref(false)
/** 内部格式化后的显示值（formatter 存在时使用） */
const formattedValue = ref('')
/** 控制 focus 属性的响应式标记（用于手动聚焦） */
const needFocus = ref(false)

/** ---------- computed ---------- */

/** 实际禁用状态（组件自身 + Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || fieldDisabled.value
})

/** 实际只读状态（组件自身 + Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || fieldReadonly.value
})

/** 实际尺寸（组件自身 + Form 联动） */
const mergedSize = computed(() => {
  return props.size || formContext?.props?.size || 'default'
})

/** 显示的值 */
const displayValue = computed(() => {
  if (props.formatter) {
    return formattedValue.value
  }
  return props.modelValue != null ? String(props.modelValue) : ''
})

/** 当前字符长度 */
const currentLength = computed(() => {
  return String(props.modelValue ?? '').length
})

/** uni-app input 的 type 属性 */
const computedType = computed<InputType>(() => {
  // password 类型在 uni-app 中通过 password 属性控制密文
  // type 始终保持为 text，password 属性控制是否密文显示
  if (props.type === 'password') {
    return 'text'
  }
  return props.type
})

/** uni-app input 的 password 属性 */
const isActualPassword = computed(() => {
  if (props.type !== 'password') return false
  return !passwordVisible.value
})

/** uni-app input 的 maxlength（-1 表示不限制） */
const computedMaxlength = computed(() => {
  return props.maxlength > 0 ? props.maxlength : -1
})

/** 是否显示字数统计 */
const isShowWordLimit = computed(() => {
  return props.isShowWordLimit && props.maxlength > 0
})

/** 是否显示清除按钮 */
const isShowClear = computed(() => {
  if (!props.isClearable || mergedDisabled.value || mergedReadonly.value) return false
  return String(props.modelValue ?? '').length > 0 && focused.value
})

/** 是否显示密码切换按钮 */
const isShowPasswordToggle = computed(() => {
  return props.type === 'password' && props.isShowPassword && !mergedDisabled.value && !mergedReadonly.value
})

/** 是否显示后缀区域 */
const showSuffix = computed(() => {
  return !!props.suffixIcon || !!slots.suffix
})

/** 安全的前缀图标类名（防止 CSS 注入） */
const safePrefixIcon = computed(() => {
  if (!props.prefixIcon) return ''
  return props.prefixIcon.replace(/[^a-zA-Z0-9_\-\s]/g, '')
})

/** 安全的后缀图标类名（防止 CSS 注入） */
const safeSuffixIcon = computed(() => {
  if (!props.suffixIcon) return ''
  return props.suffixIcon.replace(/[^a-zA-Z0-9_\-\s]/g, '')
})

/** ---------- classes ---------- */

/** 输入框 CSS 类 */
const inputClasses = computed(() => {
  const classes: string[] = [`see-input--${mergedSize.value}`]
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (focused.value) classes.push('is-focused')
  if (props.isBorder) classes.push('is-border')
  if (validateStatus.value === 'error') classes.push('is-error')
  return classes
})

/** ---------- methods ---------- */

/**
 * @title 处理输入事件
 * @description 处理用户输入，支持 formatter/parser 和 v-model 双向绑定
 */
const handleInput = (event: InputEvent) => {
  let value: string | number = event.detail?.value ?? ''

  // parser: 将格式化后的内容解析回原始值
  if (props.parser) {
    value = props.parser(String(value))
  }

  // 数字类型转换
  if (props.type === 'number' || props.type === 'digit') {
    if (value !== '' && value !== '-') {
      const numVal = Number(value)
      if (!isNaN(numVal)) {
        value = numVal
      }
    }
  }

  // 非格式化模式下限制长度
  if (!props.formatter && props.maxlength > 0 && typeof value === 'string') {
    value = value.slice(0, props.maxlength)
  }

  // 更新 v-model
  emit('update:modelValue', value)
  emit('onInput', value)

  // formatter: 格式化显示值
  if (props.formatter) {
    formattedValue.value = props.formatter(String(value))
  }
}

/**
 * @title 处理聚焦事件
 */
const handleFocus = (event: InputEvent) => {
  focused.value = true
  emit('onFocus', event)
}

/**
 * @title 处理失焦事件
 * @description 触发 onBlur、onChange，同步 useField 校验
 */
const handleBlur = (event: InputEvent) => {
  focused.value = false
  emit('onBlur', event)
  emit('onChange', props.modelValue)

  // 通知 useField 触发 blur 校验
  field?.handleBlur()
  field?.handleChange(props.modelValue)
}

/**
 * @title 处理键盘确认事件
 */
const handleConfirm = (_event: InputEvent) => {
  emit('onConfirm', props.modelValue)
}

/**
 * @title 处理键盘高度变化
 * @description 转发键盘高度变化事件，供父组件处理页面偏移
 */
const handleKeyboardHeightChange = (event: { detail: { height: number } }) => {
  emit('onKeyboardHeightChange', event?.detail?.height)
}

/**
 * @title 清除输入内容
 */
const handleClear = () => {
  emit('update:modelValue', '')
  emit('onInput', '')
  emit('onClear')
  emit('onChange', '')

  if (props.formatter) {
    formattedValue.value = ''
  }

  // 清除后重新聚焦
  nextTick(() => {
    doFocus()
  })
}

/**
 * @title 切换密码可见性
 */
const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
}

/** 聚焦重置定时器 ID（用于组件卸载时清理） */
let focusResetTimer: ReturnType<typeof setTimeout> | null = null

/**
 * @title 手动聚焦（跨平台兼容）
 * @description 通过控制 focus 属性实现聚焦，使用单次 nextTick 避免竞态
 */
const doFocus = () => {
  if (focusResetTimer !== null) {
    clearTimeout(focusResetTimer)
    focusResetTimer = null
  }
  needFocus.value = false
  nextTick(() => {
    needFocus.value = true
    // 下一帧重置标记，避免后续 modelValue 变化导致重复聚焦
    focusResetTimer = setTimeout(() => {
      needFocus.value = false
      focusResetTimer = null
    }, 100)
  })
}

/**
 * @title 手动失焦（跨平台兼容）
 * @description 优先使用 uni.hideKeyboard() 关闭键盘，H5 平台回退到 DOM blur
 */
const doBlur = () => {
  // #ifdef H5
  try {
    const el = (inputRef.value as unknown as { $el?: HTMLElement })?.$el?.querySelector?.('input')
    if (el instanceof HTMLInputElement) {
      el.blur()
      return
    }
  } catch {
    // ignore - fall through to uni API
  }
  // #endif
  // 使用 uni-app 跨平台 API 关闭键盘
  uni.hideKeyboard()
}

/** ---------- watch ---------- */

/** 初始化 formatter */
if (props.formatter && props.modelValue != null && props.modelValue !== '') {
  formattedValue.value = props.formatter(String(props.modelValue))
}

/** 监听 modelValue 变化，同步 formatter 显示值 */
watch(
  () => props.modelValue,
  (newVal) => {
    if (props.formatter) {
      formattedValue.value = props.formatter(String(newVal ?? ''))
    }
  }
)

/** ---------- lifecycle ---------- */

/** 组件卸载时清理定时器 */
onBeforeUnmount(() => {
  if (focusResetTimer !== null) {
    clearTimeout(focusResetTimer)
    focusResetTimer = null
  }
})

/** ---------- expose ---------- */
defineExpose({
  /** 聚焦 */
  focus: doFocus,
  /** 失焦 */
  blur: doBlur,
  /** 校验状态 */
  validateStatus,
  /** 校验信息 */
  validateMessage
})
</script>

<style lang="scss" scoped>
/* ---------- 组件级 CSS 变量 ---------- */
.see-input {
  --input-height-small: 56rpx;
  --input-height-default: 72rpx;
  --input-height-large: 88rpx;
  --input-font-size-small: 24rpx;
  --input-font-size-default: 28rpx;
  --input-font-size-large: 32rpx;
  --input-padding-h: 24rpx;
  --input-icon-size: 32rpx;
  --input-action-size: 36rpx;
  --input-border-radius: 8rpx;
}

/* ---------- 基础布局 ---------- */
.see-input {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--see-bg-color);
  border-radius: var(--input-border-radius);
  transition: border-color 0.2s ease;

  /* ---------- 边框 ---------- */
  &.is-border {
    border: 1px solid var(--see-border-four-color);
  }

  &.is-focused.is-border {
    border-color: var(--see-primary);
  }

  &.is-error.is-border {
    border-color: var(--see-error);
  }

  /* ---------- 尺寸：small ---------- */
  &--small {
    min-height: var(--input-height-small);
    padding: 0 16rpx;

    .see-input__inner {
      font-size: var(--input-font-size-small);
    }

    .see-input__prefix,
    .see-input__suffix {
      padding: 0 6rpx;
    }

    .see-input__icon {
      font-size: 28rpx;
    }
  }

  /* ---------- 尺寸：default ---------- */
  &--default {
    min-height: var(--input-height-default);
    padding: 0 var(--input-padding-h);

    .see-input__inner {
      font-size: var(--input-font-size-default);
    }
  }

  /* ---------- 尺寸：large ---------- */
  &--large {
    min-height: var(--input-height-large);
    padding: 0 32rpx;

    .see-input__inner {
      font-size: var(--input-font-size-large);
    }

    .see-input__icon {
      font-size: 36rpx;
    }
  }

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--see-border-four-color);

    .see-input__inner {
      cursor: not-allowed;
      color: var(--see-tips-color);
    }
  }

  /* ---------- 只读状态 ---------- */
  &.is-readonly {
    .see-input__inner {
      cursor: default;
    }
  }
}

/* ---------- 输入框 wrapper ---------- */
.see-input__wrapper {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

/* ---------- 输入框本体 ---------- */
.see-input__inner {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--see-main-color);
  caret-color: var(--see-primary);
  padding: 0;
}

.see-input__placeholder {
  color: var(--see-tips-color) !important;
  font-size: inherit;
}

/* ---------- 前缀 / 后缀 ---------- */
.see-input__prefix,
.see-input__suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 8rpx;
}

.see-input__icon {
  font-size: var(--input-icon-size);
  color: var(--see-tips-color);
}

/* ---------- 操作按钮（清除/密码切换） ---------- */
.see-input__action {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 8rpx;
  cursor: pointer;
}

.see-input__action-icon {
  font-size: var(--input-action-size);
  color: var(--see-tips-color);
  transition: color 0.2s ease;
}

/* ---------- 清除按钮 ---------- */
.see-input__action:active .see-input-icon-close-circle {
  color: var(--see-content-color);
}

/* ---------- 密码切换按钮 ---------- */
.see-input__action:active .see-input-icon-eye,
.see-input__action:active .see-input-icon-eye-off {
  color: var(--see-content-color);
}

/* ---------- 字数统计 ---------- */
.see-input__word-limit {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 8rpx;
  font-size: 22rpx;
  white-space: nowrap;
  pointer-events: none;
}

.see-input__word-num {
  color: var(--see-content-color);
}

.see-input__word-sep {
  margin: 0 2rpx;
  color: var(--see-border-color);
}

.see-input__word-max {
  color: var(--see-tips-color);
}

/* ---------- 内置图标（清除、密码可见/隐藏） ---------- */
.see-input-icon-close-circle::before {
  content: '\2715';
  font-size: 18rpx;
}

.see-input-icon-eye::before {
  content: '\1F441';
  font-size: 26rpx;
}

.see-input-icon-eye-off::before {
  content: '\1F441';
  font-size: 26rpx;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: -2rpx;
    top: 50%;
    width: 30rpx;
    height: 2rpx;
    background-color: var(--see-tips-color);
    transform: rotate(-45deg);
  }
}
</style>
