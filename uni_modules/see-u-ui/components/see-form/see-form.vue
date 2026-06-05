<template>
  <view class="see-form" :class="formClasses">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
/**
 * Form 表单
 * @description 用于数据收集、校验和提交，由 FormItem 组成表单项
 * @tutorial https://www.seeuui.cn/components/form/
 */
import { computed, watch } from 'vue'
import { useForm } from '../../utils/hooks/useForm'
import type { FormRule, FormInstance, ValidateResult } from '../../utils/shared/form-types'
import type { LabelPosition, FormSize } from './type'

defineOptions({ name: 'SeeForm' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 表单数据对象（必填） */
    model: Record<string, unknown>
    /** 校验规则 */
    rules?: Record<string, FormRule | FormRule[]>
    /** 标签位置 */
    labelPosition?: LabelPosition
    /** 标签宽度 */
    labelWidth?: string | number
    /** 是否禁用整组 */
    isDisabled?: boolean
    /** 是否只读整组 */
    isReadonly?: boolean
    /** 是否显示必填星号 */
    isRequiredAsterisk?: boolean
    /** 是否显示校验错误信息 */
    isShowMessage?: boolean
    /** 是否行内模式 */
    isInline?: boolean
    /** 尺寸 */
    size?: FormSize
  }>(),
  {
    rules: () => ({}),
    labelPosition: 'right',
    labelWidth: 'auto',
    isDisabled: false,
    isReadonly: false,
    isRequiredAsterisk: true,
    isShowMessage: true,
    isInline: false,
    size: 'default'
  }
)

/** ---------- useForm hook ---------- */
const {
  validate: hookValidate,
  validateField: hookValidateField,
  resetFields: hookResetFields,
  clearValidate: hookClearValidate,
  scrollToField: hookScrollToField,
  getFieldsValue: hookGetFieldsValue,
  setFieldsValue: hookSetFieldsValue,
  formContext
} = useForm({
  model: props.model,
  rules: props.rules,
  labelPosition: props.labelPosition,
  labelWidth: props.labelWidth,
  isDisabled: props.isDisabled,
  isReadonly: props.isReadonly,
  isRequiredAsterisk: props.isRequiredAsterisk,
  isShowMessage: props.isShowMessage,
  isInline: props.isInline,
  size: props.size
})

/** ---------- 同步 props 到 formContext ---------- */
watch(
  () => props.labelPosition,
  (val) => {
    formContext.props.labelPosition = val
  }
)
watch(
  () => props.labelWidth,
  (val) => {
    formContext.props.labelWidth = val
  }
)
watch(
  () => props.isDisabled,
  (val) => {
    formContext.props.isDisabled = val
  }
)
watch(
  () => props.isReadonly,
  (val) => {
    formContext.props.isReadonly = val
  }
)
watch(
  () => props.isRequiredAsterisk,
  (val) => {
    formContext.props.isRequiredAsterisk = val
  }
)
watch(
  () => props.isShowMessage,
  (val) => {
    formContext.props.isShowMessage = val
  }
)
watch(
  () => props.isInline,
  (val) => {
    formContext.props.isInline = val
  }
)
watch(
  () => props.size,
  (val) => {
    formContext.props.size = val
  }
)
watch(
  () => props.rules,
  (val) => {
    formContext.rules = val || {}
  },
  { deep: true }
)

/** ---------- computed ---------- */

/** 表单 CSS 类 */
const formClasses = computed(() => {
  const classes: string[] = [`see-form--${props.size}`]
  if (props.isInline) classes.push('see-form--inline')
  classes.push(`see-form--label-${props.labelPosition}`)
  return classes
})

/** ---------- 包装方法（带事件通知） ---------- */

/**
 * @title 校验整个表单
 * @description 校验所有字段并返回结果
 */
const validate = async (): Promise<ValidateResult> => {
  const result = await hookValidate()
  // 触发每个字段的校验回调
  // 注意：fields 在 hook 内部管理，这里通过 result 获取信息
  return result
}

/**
 * @title 校验指定字段
 * @description 校验指定的一个或多个字段
 */
const validateField = async (fields: string | string[]): Promise<ValidateResult> => {
  return await hookValidateField(fields)
}

/**
 * @title 重置表单
 * @description 重置指定字段（或全部字段）的值和校验状态
 */
const resetFields = (fields?: string | string[]) => {
  hookResetFields(fields)
}

/**
 * @title 清除校验状态
 * @description 清除指定字段（或全部字段）的校验状态
 */
const clearValidate = (fields?: string | string[]) => {
  hookClearValidate(fields)
}

/**
 * @title 滚动到指定字段
 * @description 滚动页面到指定字段位置
 */
const scrollToField = (field: string) => {
  hookScrollToField(field)
}

/**
 * @title 获取表单数据
 * @description 获取当前表单数据的深拷贝
 */
const getFieldsValue = (): Record<string, unknown> => {
  return hookGetFieldsValue()
}

/**
 * @title 设置表单数据
 * @description 批量设置表单字段值
 */
const setFieldsValue = (values: Record<string, unknown>) => {
  hookSetFieldsValue(values)
}

/** ---------- expose ---------- */
defineExpose<FormInstance>({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
  getFieldsValue,
  setFieldsValue
})
</script>

<style lang="scss" scoped>
/* ---------- CSS 变量 ---------- */
.see-form {
  --form-label-font-size: 28rpx;
  --form-label-color: var(--see-content-color, #333333);
  --form-label-width: auto;
  --form-item-gap: 32rpx;
  --form-error-font-size: 24rpx;
  --form-error-color: var(--see-error, #e43d33);
  --form-required-color: var(--see-error, #e43d33);
  --form-star-margin: 4rpx;
}

/* ---------- 基础布局 ---------- */
.see-form {
  width: 100%;
}

/* ---------- 行内模式 ---------- */
.see-form--inline {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0 var(--form-item-gap);

  :deep(.see-form-item) {
    margin-bottom: 0;
  }
}
</style>
