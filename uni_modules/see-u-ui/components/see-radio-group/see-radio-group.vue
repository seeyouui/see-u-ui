<template>
  <view class="see-radio-group" :class="groupClasses">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
/**
 * RadioGroup 单选框组
 * @description 管理一组 Radio 组件，提供统一的选中状态和事件处理
 * @tutorial https://www.seeuui.cn/components/radio/
 *
 * @property {String | Number | Boolean} modelValue    绑定值（v-model）
 * @property {Boolean}                     isDisabled   是否禁用整组（默认 false）
 * @property {Boolean}                     isReadonly   是否只读整组（默认 false）
 * @property {'small'|'default'|'large'}   size         尺寸（默认 'default'）
 * @property {Boolean}                     isBorder     是否显示边框（默认 false）
 * @property {Boolean}                     isInline     是否行内排列（默认 true）
 * @property {String}                      checkedColor 选中时颜色
 * @property {String}                      name         表单字段名
 */
import { computed, provide, inject } from 'vue'
import type { RadioGroupContext, FormContext } from '../see-radio/type'

defineOptions({ name: 'SeeRadioGroup' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值（v-model） */
    modelValue?: string | number | boolean
    /** 是否禁用整组 */
    isDisabled?: boolean
    /** 是否只读整组 */
    isReadonly?: boolean
    /** 尺寸 */
    size?: 'small' | 'default' | 'large'
    /** 是否显示边框 */
    isBorder?: boolean
    /** 是否行内排列 */
    isInline?: boolean
    /** 选中时颜色 */
    checkedColor?: string
    /** 表单字段名 */
    name?: string
  }>(),
  {
    modelValue: '',
    isDisabled: false,
    isReadonly: false,
    size: 'default',
    isBorder: false,
    isInline: true,
    checkedColor: '',
    name: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 值变化时触发 */
  (e: 'onChange', value: string | number | boolean): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string | number | boolean): void
}>()

/** ---------- inject ---------- */
const formContext = inject<FormContext | null>('formKey', null)

/** ---------- computed ---------- */
/** 实际禁用状态（考虑 Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.isDisabled || false
})

/** 实际只读状态（考虑 Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || false
})

/** 样式类 */
const groupClasses = computed(() => {
  const classes: string[] = []
  if (!props.isInline) classes.push('see-radio-group--block')
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  return classes.join(' ')
})

/** ---------- provide ---------- */
/**
 * @title 更新选中值
 * @description 供子 Radio 调用，更新 Group 的绑定值
 */
const updateValue = (label: string | number | boolean) => {
  if (mergedDisabled.value || mergedReadonly.value) return
  emit('update:modelValue', label)
  emit('onChange', label)
}

/** 向子组件提供上下文 */
provide<RadioGroupContext>('RadioGroupKey', {
  get modelValue() {
    return props.modelValue
  },
  get isDisabled() {
    return mergedDisabled.value
  },
  get isReadonly() {
    return mergedReadonly.value
  },
  get size() {
    return props.size
  },
  get isBorder() {
    return props.isBorder
  },
  get checkedColor() {
    return props.checkedColor
  },
  updateValue
})
</script>

<style lang="scss" scoped>
.see-radio-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24rpx;

  /* 块级排列模式 */
  &--block {
    flex-direction: column;
    align-items: flex-start;
    gap: 16rpx;
  }

  /* 禁用状态 */
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  /* 只读状态 */
  &.is-readonly {
    pointer-events: none;
  }
}
</style>
