<template>
  <view class="see-form-item" :class="formItemClasses" :data-field="props.field">
    <!-- 标签区域 -->
    <view v-if="hasLabel" class="see-form-item__label" :class="labelClasses" :style="labelStyle">
      <slot name="label">
        <text v-if="mergedIsRequired" class="see-form-item__required">*</text>
        <text class="see-form-item__label-text">{{ props.label }}</text>
      </slot>
    </view>

    <!-- 内容区域 -->
    <view class="see-form-item__content">
      <view class="see-form-item__control" @blur.capture="handleFieldBlur">
        <slot></slot>
      </view>
      <!-- 错误信息 -->
      <view v-if="mergedIsShowMessage && validateStatus === 'error' && validateMessage" class="see-form-item__error">
        <slot name="error">
          <text class="see-form-item__error-text">{{ validateMessage }}</text>
        </slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * FormItem 表单项
 * @description 表单中的每一项，配合 Form 使用，提供标签、校验、错误提示等功能
 * @tutorial https://www.seeuui.cn/components/form/
 */
import { computed, inject, watch } from 'vue'
import { useField } from '../../utils/hooks/useField'
import { formKey } from '../../utils/shared/form-keys'
import type { FormRule, FormContext } from '../../utils/shared/form-types'
import type { LabelPosition } from '../see-form/type'

defineOptions({ name: 'SeeFormItem' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 标签文本 */
    label?: string
    /** 字段名（用于校验和重置） */
    field?: string
    /** 标签宽度（覆盖 Form 级别） */
    labelWidth?: string | number
    /** 标签位置（覆盖 Form 级别） */
    labelPosition?: LabelPosition
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 该字段的校验规则（覆盖 Form 级别） */
    rules?: FormRule | FormRule[]
    /** 是否显示错误信息 */
    isShowMessage?: boolean
    /** 是否必填（覆盖自动检测） */
    isRequired?: boolean
  }>(),
  {
    label: '',
    field: '',
    labelWidth: undefined,
    labelPosition: undefined,
    isDisabled: false,
    isReadonly: false,
    rules: undefined,
    isShowMessage: undefined,
    isRequired: undefined
  }
)

/** ---------- inject ---------- */
const form = inject<FormContext | null>(formKey, null)

/** ---------- useField hook ---------- */
const {
  validateStatus,
  validateMessage,
  isValidating,
  isDisabled: hookIsDisabled,
  isReadonly: hookIsReadonly,
  isShowMessage: hookIsShowMessage,
  validate,
  resetField,
  clearValidate,
  handleChange,
  handleBlur
} = useField({
  field: props.field,
  getValue: () => form?.model[props.field],
  trigger: 'change',
  rules: props.rules
})

/** ---------- 自动校验接线 ---------- */
/**
 * 监听绑定字段值变化触发 change 校验（输入即校验）
 * 仅在存在字段名与 Form 上下文时监听；初始不触发，避免首屏误报与死循环
 * （校验只写 validateStatus/validateMessage，不回写 model，故不会递归触发本 watch）
 */
if (props.field && form) {
  watch(
    () => form.model[props.field],
    (value) => {
      handleChange(value)
    }
  )
}

/**
 * @title 处理失焦校验
 * @description 捕获内容区子控件冒泡的 blur 事件，触发 blur 校验
 */
const handleFieldBlur = () => {
  // useField 的 trigger 为 change，handleBlur 内部按 blur 触发无效，
  // 这里直接按 blur 触发方式跑规则（validate 会自行过滤 trigger）
  if (props.field) {
    validate('blur')
  }
  handleBlur()
}

/** ---------- computed ---------- */

/** 是否显示标签 */
const hasLabel = computed(() => {
  return !!(props.label || form?.props.labelPosition === 'top')
})

/** 实际标签位置（FormItem 优先于 Form） */
const mergedLabelPosition = computed<LabelPosition>(() => {
  return props.labelPosition || form?.props.labelPosition || 'right'
})

/** 实际标签宽度（FormItem 优先于 Form） */
const mergedLabelWidth = computed(() => {
  const width = props.labelWidth ?? form?.props.labelWidth ?? 'auto'
  if (typeof width === 'number') {
    return `${width}rpx`
  }
  return width
})

/** 实际禁用状态（FormItem 优先于 Form） */
const mergedIsDisabled = computed(() => {
  return props.isDisabled || hookIsDisabled.value
})

/** 实际只读状态（FormItem 优先于 Form） */
const mergedIsReadonly = computed(() => {
  return props.isReadonly || hookIsReadonly.value
})

/** 实际是否显示错误信息（FormItem 优先于 Form） */
const mergedIsShowMessage = computed(() => {
  return props.isShowMessage ?? hookIsShowMessage.value
})

/** 是否显示必填星号 */
const mergedIsRequired = computed(() => {
  // 如果显式指定了 isRequired，直接使用
  if (props.isRequired !== undefined && props.isRequired !== null) {
    return props.isRequired
  }
  // 检查 Form 是否启用了星号显示
  if (form?.props.isRequiredAsterisk === false) {
    return false
  }
  // 自动检测：检查该字段的规则中是否有 required
  return fieldRules.value.some((rule) => rule.required)
})

/** 获取该字段的所有规则（缓存） */
const fieldRules = computed<FormRule[]>(() => {
  // 优先使用 FormItem 自身的规则
  if (props.rules) {
    return Array.isArray(props.rules) ? props.rules : [props.rules]
  }
  // 否则从 Form 获取
  return form?.getRules(props.field) || []
})

/** 标签样式 */
const labelStyle = computed(() => {
  const style: Record<string, string> = {}
  const position = mergedLabelPosition.value
  if (position === 'left' || position === 'right') {
    style.width = mergedLabelWidth.value
  }
  return style
})

/** 标签 CSS 类 */
const labelClasses = computed(() => {
  const classes: string[] = []
  classes.push(`see-form-item__label--${mergedLabelPosition.value}`)
  return classes
})

/** FormItem CSS 类 */
const formItemClasses = computed(() => {
  const classes: string[] = [`see-form-item--${mergedLabelPosition.value}`]
  if (mergedIsDisabled.value) classes.push('is-disabled')
  if (mergedIsReadonly.value) classes.push('is-readonly')
  if (validateStatus.value === 'error') classes.push('is-error')
  if (validateStatus.value === 'success') classes.push('is-success')
  if (isValidating.value) classes.push('is-validating')
  if (form?.props.isInline) classes.push('see-form-item--inline')
  if (form?.props.size) classes.push(`see-form-item--${form.props.size}`)
  return classes
})

/** ---------- expose ---------- */
defineExpose({
  /** 字段名 */
  field: props.field,
  /** 校验状态 */
  validateStatus,
  /** 错误信息 */
  validateMessage,
  /** 校验该字段 */
  validate,
  /** 重置该字段 */
  resetField,
  /** 清除该字段校验状态 */
  clearValidate
})
</script>

<style lang="scss" scoped>
/* ---------- CSS 变量 ---------- */
.see-form-item {
  --form-item-label-font-size: 28rpx;
  --form-item-label-color: var(--see-content-color, #333333);
  --form-item-label-line-height: 48rpx;
  --form-item-error-font-size: 24rpx;
  --form-item-error-color: var(--see-error, #e43d33);
  --form-item-error-line-height: 36rpx;
  --form-item-error-margin-top: 8rpx;
  --form-item-required-color: var(--see-error, #e43d33);
  --form-item-required-margin: 4rpx;
  --form-item-content-gap: 16rpx;
  --form-item-margin-bottom: 32rpx;
  --form-item-padding-h: 0;
}

/* ---------- 基础布局 ---------- */
.see-form-item {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0 var(--form-item-padding-h);
  margin-bottom: var(--form-item-margin-bottom);

  &:last-child {
    margin-bottom: 0;
  }
}

/* ---------- 标签位置：左 / 右 ---------- */
.see-form-item--left,
.see-form-item--right {
  flex-direction: row;
  align-items: flex-start;
}

/* ---------- 标签位置：上 ---------- */
.see-form-item--top {
  flex-direction: column;
}

/* ---------- 标签 ---------- */
.see-form-item__label {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-height: var(--form-item-label-line-height);
  font-size: var(--form-item-label-font-size);
  line-height: var(--form-item-label-line-height);
  color: var(--form-item-label-color);
  box-sizing: border-box;

  &--left {
    justify-content: flex-start;
    padding-right: var(--form-item-content-gap);
  }

  &--right {
    justify-content: flex-end;
    padding-right: var(--form-item-content-gap);
  }

  &--top {
    justify-content: flex-start;
    width: 100% !important;
    padding-bottom: var(--form-item-content-gap);
    padding-right: 0;
  }
}

.see-form-item__label-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 必填星号 ---------- */
.see-form-item__required {
  color: var(--form-item-required-color);
  margin-right: var(--form-item-required-margin);
  font-size: var(--form-item-label-font-size);
  line-height: 1;
  flex-shrink: 0;
}

/* ---------- 内容区域 ---------- */
.see-form-item__content {
  flex: 1;
  min-width: 0;
}

.see-form-item__control {
  width: 100%;
}

/* ---------- 错误信息 ---------- */
.see-form-item__error {
  margin-top: var(--form-item-error-margin-top);
}

.see-form-item__error-text {
  font-size: var(--form-item-error-font-size);
  line-height: var(--form-item-error-line-height);
  color: var(--form-item-error-color);
}

/* ---------- 状态：错误 ---------- */
.see-form-item.is-error {
  :deep(.see-input) {
    border-color: var(--see-error, #e43d33) !important;
  }
}

/* ---------- 状态：成功 ---------- */
.see-form-item.is-success {
  :deep(.see-input) {
    border-color: var(--see-success, #19be6b) !important;
  }
}

/* ---------- 禁用状态 ---------- */
.see-form-item.is-disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* ---------- 行内模式 ---------- */
.see-form-item--inline {
  display: inline-flex;
  width: auto;
  margin-bottom: 0;
  margin-right: var(--form-item-margin-bottom);
}

/* ---------- 尺寸变体 ---------- */
.see-form-item--small {
  --form-item-label-font-size: 24rpx;
  --form-item-label-line-height: 40rpx;
  --form-item-error-font-size: 22rpx;
  --form-item-error-line-height: 32rpx;
  --form-item-margin-bottom: 24rpx;
}

.see-form-item--large {
  --form-item-label-font-size: 32rpx;
  --form-item-label-line-height: 56rpx;
  --form-item-error-font-size: 26rpx;
  --form-item-error-line-height: 40rpx;
  --form-item-margin-bottom: 40rpx;
}
</style>
