<template>
  <view class="see-checkbox-group" :class="groupClasses">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
/**
 * CheckboxGroup 复选框组
 * @description 管理多个 Checkbox 的容器组件
 * @tutorial https://www.seeuui.cn/components/checkbox/
 *
 * @property {Array}                       modelValue      绑定值数组（v-model）
 * @property {Boolean}                     isDisabled      是否禁用整组
 * @property {Boolean}                     isReadonly      是否只读整组
 * @property {Number}                      max             最多可选数量
 * @property {Number}                      min             最少可选数量
 * @property {'small' | 'default' | 'large'} size         尺寸
 * @property {Boolean}                     isBorder        是否显示边框
 * @property {Boolean}                     isInline        是否行内排列
 * @property {String}                      checkedColor    选中时颜色
 * @property {String}                      name            表单字段名
 */
import { computed, inject, provide, reactive, toRef } from 'vue'
import { formKey, checkboxGroupKey } from '../../utils/shared/form-keys'
import type { CheckboxSize, CheckboxGroupContext } from '../see-checkbox/type'

defineOptions({ name: 'SeeCheckboxGroup' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值数组（v-model） */
    modelValue?: (string | number | boolean)[]
    /** 是否禁用整组 */
    isDisabled?: boolean
    /** 是否只读整组 */
    isReadonly?: boolean
    /** 最多可选数量 */
    max?: number
    /** 最少可选数量 */
    min?: number
    /** 尺寸 */
    size?: CheckboxSize
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
    modelValue: () => [],
    isDisabled: false,
    isReadonly: false,
    max: 0,
    min: 0,
    size: 'default',
    isBorder: false,
    isInline: false,
    checkedColor: '',
    name: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 值变化时触发 */
  (e: 'onChange', values: (string | number | boolean)[]): void
  /** v-model 更新 */
  (e: 'update:modelValue', values: (string | number | boolean)[]): void
}>()

/** ---------- inject ---------- */
const formContext = inject(formKey, null)

/** ---------- state ---------- */
/** 已注册的子 Checkbox label 列表 */
const registeredLabels: (string | number | boolean)[] = []

/** ---------- computed ---------- */
/** 实际禁用状态（考虑 Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.isDisabled || false
})

/** 实际只读状态（考虑 Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || formContext?.isReadonly || false
})

/** 实际尺寸（考虑 Form 联动） */
const mergedSize = computed(() => {
  return props.size || formContext?.size || 'default'
})

/** 分组样式类 */
const groupClasses = computed(() => {
  const classes: string[] = [`see-checkbox-group--${mergedSize.value}`]
  if (props.isInline) classes.push('is-inline')
  if (mergedDisabled.value) classes.push('is-disabled')
  return classes.join(' ')
})

/** ---------- methods ---------- */
/**
 * @title 注册子 Checkbox
 * @description 记录已注册的子 Checkbox label
 */
const register = (label: string | number | boolean) => {
  if (!registeredLabels.includes(label)) {
    registeredLabels.push(label)
  }
}

/**
 * @title 注销子 Checkbox
 * @description 移除已注销的子 Checkbox label
 */
const unregister = (label: string | number | boolean) => {
  const index = registeredLabels.indexOf(label)
  if (index > -1) {
    registeredLabels.splice(index, 1)
  }
}

/**
 * @title 切换选中状态
 * @description 处理子 Checkbox 的选中状态切换
 */
const toggle = (label: string | number | boolean) => {
  if (mergedDisabled.value || mergedReadonly.value) return

  const currentValues = [...props.modelValue]
  const index = currentValues.indexOf(label)

  if (index > -1) {
    // 当前已选中，需要取消
    // 检查最少选择限制
    if (props.min > 0 && currentValues.length <= props.min) {
      return
    }
    currentValues.splice(index, 1)
  } else {
    // 当前未选中，需要选中
    // 检查最多选择限制
    if (props.max > 0 && currentValues.length >= props.max) {
      return
    }
    currentValues.push(label)
  }

  emit('update:modelValue', currentValues)
  emit('onChange', currentValues)
}

/** ---------- provide ---------- */
const groupContext: CheckboxGroupContext = reactive({
  modelValue: toRef(props, 'modelValue'),
  isDisabled: mergedDisabled,
  isReadonly: mergedReadonly,
  max: toRef(props, 'max'),
  min: toRef(props, 'min'),
  size: mergedSize,
  isBorder: toRef(props, 'isBorder'),
  checkedColor: toRef(props, 'checkedColor'),
  register,
  unregister,
  toggle
})

provide(checkboxGroupKey, groupContext)

/** ---------- expose ---------- */
defineExpose({
  /** 获取所有已注册的 label */
  getRegisteredLabels: () => [...registeredLabels],
  /** 获取当前选中的值 */
  getCheckedValues: () => [...props.modelValue],
  /** 全选 */
  checkAll: () => {
    if (mergedDisabled.value || mergedReadonly.value) return
    if (props.max > 0 && registeredLabels.length > props.max) return
    emit('update:modelValue', [...registeredLabels])
    emit('onChange', [...registeredLabels])
  },
  /** 取消全选 */
  uncheckAll: () => {
    if (mergedDisabled.value || mergedReadonly.value) return
    if (props.min > 0) return
    emit('update:modelValue', [])
    emit('onChange', [])
  },
  /** 是否全选 */
  isAllChecked: () => {
    return registeredLabels.length > 0 && registeredLabels.every((label) => props.modelValue.includes(label))
  },
  /** 是否半选 */
  isIndeterminate: () => {
    const checkedCount = props.modelValue.length
    return checkedCount > 0 && checkedCount < registeredLabels.length
  }
})
</script>

<style lang="scss" scoped>
.see-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  /* ---------- 尺寸 ---------- */
  &--small {
    gap: 12rpx;
  }

  &--default {
    gap: 16rpx;
  }

  &--large {
    gap: 20rpx;
  }

  /* ---------- 行内排列 ---------- */
  &.is-inline {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24rpx;

    &.see-checkbox-group--small {
      gap: 16rpx;
    }

    &.see-checkbox-group--large {
      gap: 32rpx;
    }
  }

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
