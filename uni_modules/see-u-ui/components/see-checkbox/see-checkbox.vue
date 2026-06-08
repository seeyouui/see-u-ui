<template>
  <view class="see-checkbox" :class="checkboxClasses" @click="handleClick">
    <!-- 复选框图标 -->
    <view class="see-checkbox__icon" :style="iconStyle">
      <!-- 半选状态 -->
      <view v-if="isIndeterminate && !isChecked" class="see-checkbox__indeterminate">
        <view class="see-checkbox__indeterminate-line"></view>
      </view>
      <!-- 选中状态 -->
      <view v-else-if="isChecked" class="see-checkbox__checked">
        <view class="see-checkbox__check-mark"></view>
      </view>
    </view>

    <!-- 文字标签 -->
    <text v-if="$slots.default || label !== undefined" class="see-checkbox__label">
      <slot>{{ label }}</slot>
    </text>
  </view>
</template>

<script lang="ts" setup>
/**
 * Checkbox 复选框
 * @description 在一组备选项中进行多选
 * @tutorial https://www.seeuui.cn/components/checkbox/
 *
 * @property {Boolean}                     modelValue      绑定值（v-model）
 * @property {String | Number | Boolean}   label           选中状态的值（用于 CheckboxGroup）
 * @property {Boolean}                     isDisabled      是否禁用
 * @property {Boolean}                     isIndeterminate 半选状态（全选场景）
 * @property {'small' | 'default' | 'large'} size         尺寸
 * @property {Boolean}                     isBorder        是否显示边框
 * @property {String}                      checkedColor    选中时颜色
 * @property {String}                      name            表单字段名
 */
import { computed, inject, onBeforeUnmount, onMounted } from 'vue'
import { formKey, checkboxGroupKey } from '../../utils/shared/form-keys'
import type { CheckboxSize } from './type'

defineOptions({ name: 'SeeCheckbox' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值（v-model） */
    modelValue?: boolean
    /** 选中状态的值（用于 CheckboxGroup） */
    label?: string | number | boolean
    /** 是否禁用 */
    isDisabled?: boolean
    /** 半选状态（全选场景） */
    isIndeterminate?: boolean
    /** 尺寸 */
    size?: CheckboxSize
    /** 是否显示边框 */
    isBorder?: boolean
    /** 选中时颜色 */
    checkedColor?: string
    /** 表单字段名 */
    name?: string
  }>(),
  {
    modelValue: false,
    label: undefined,
    isDisabled: false,
    isIndeterminate: false,
    size: 'default',
    isBorder: false,
    checkedColor: '',
    name: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** v-model 更新 */
  (e: 'update:modelValue', value: boolean): void
  /** 状态变化时触发 */
  (e: 'onChange', value: boolean): void
}>()

/** ---------- inject ---------- */
const checkboxGroup = inject(checkboxGroupKey, null)
const formContext = inject(formKey, null)

/** ---------- computed ---------- */
/** 是否在 Group 中使用 */
const isInGroup = computed(() => !!checkboxGroup)

/** 当前是否选中 */
const isChecked = computed(() => {
  if (isInGroup.value && checkboxGroup && props.label !== undefined) {
    return checkboxGroup.modelValue.includes(props.label)
  }
  return props.modelValue
})

/** 实际禁用状态（考虑 Group 和 Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || checkboxGroup?.isDisabled || formContext?.props?.isDisabled || false
})

/** 实际只读状态（考虑 Group 和 Form 联动） */
const mergedReadonly = computed(() => {
  return checkboxGroup?.isReadonly || formContext?.props?.isReadonly || false
})

/** 实际尺寸（考虑 Group 和 Form 联动） */
const mergedSize = computed(() => {
  return props.size || checkboxGroup?.size || formContext?.props?.size || 'default'
})

/** 实际边框状态（考虑 Group 联动） */
const mergedBorder = computed(() => {
  return props.isBorder || checkboxGroup?.isBorder || false
})

/** 实际选中颜色（考虑 Group 联动） */
const mergedCheckedColor = computed(() => {
  return props.checkedColor || checkboxGroup?.checkedColor || ''
})

/** 是否可点击（考虑 Group 的 max 限制） */
const isClickable = computed(() => {
  if (mergedDisabled.value || mergedReadonly.value) return false

  if (isInGroup.value && checkboxGroup && props.label !== undefined) {
    // 如果当前未选中，且已达到最大数量，则不可点击
    if (!isChecked.value && checkboxGroup.max > 0) {
      return checkboxGroup.modelValue.length < checkboxGroup.max
    }
    // 如果当前已选中，且已达到最小数量，则不可取消
    if (isChecked.value && checkboxGroup.min > 0) {
      return checkboxGroup.modelValue.length > checkboxGroup.min
    }
  }

  return true
})

/** 复选框样式类 */
const checkboxClasses = computed(() => {
  const classes: string[] = [`see-checkbox--${mergedSize.value}`]
  if (isChecked.value) classes.push('is-checked')
  if (props.isIndeterminate && !isChecked.value) classes.push('is-indeterminate')
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (mergedBorder.value) classes.push('is-border')
  return classes.join(' ')
})

/** 图标样式 */
const iconStyle = computed(() => {
  const style: Record<string, string> = {}

  if (mergedCheckedColor.value) {
    if (isChecked.value) {
      style.backgroundColor = mergedCheckedColor.value
      style.borderColor = mergedCheckedColor.value
    } else if (props.isIndeterminate) {
      style.borderColor = mergedCheckedColor.value
    }
  }

  return style
})

/** ---------- methods ---------- */
/**
 * @title 处理点击事件
 * @description 切换复选框状态
 */
const handleClick = () => {
  if (!isClickable.value) return

  if (isInGroup.value && checkboxGroup && props.label !== undefined) {
    checkboxGroup.toggle(props.label)
  } else {
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('onChange', newValue)
  }
}

/** ---------- lifecycle ---------- */
onMounted(() => {
  if (isInGroup.value && checkboxGroup && props.label !== undefined) {
    checkboxGroup.register(props.label)
  }
})

onBeforeUnmount(() => {
  if (isInGroup.value && checkboxGroup && props.label !== undefined) {
    checkboxGroup.unregister(props.label)
  }
})

/** ---------- expose ---------- */
defineExpose({
  /** 是否选中 */
  isChecked: () => isChecked.value,
  /** 是否禁用 */
  isDisabled: () => mergedDisabled.value
})
</script>

<style lang="scss" scoped>
.see-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  /* ---------- 尺寸 ---------- */
  &--small {
    .see-checkbox__icon {
      width: 32rpx;
      height: 32rpx;
      border-radius: 6rpx;
    }

    .see-checkbox__indeterminate-line {
      width: 16rpx;
      height: 2rpx;
    }

    .see-checkbox__check-mark {
      width: 8rpx;
      height: 14rpx;
      border-width: 2rpx;
    }

    .see-checkbox__label {
      font-size: 24rpx;
    }
  }

  &--default {
    .see-checkbox__icon {
      width: 40rpx;
      height: 40rpx;
      border-radius: 8rpx;
    }

    .see-checkbox__indeterminate-line {
      width: 20rpx;
      height: 3rpx;
    }

    .see-checkbox__check-mark {
      width: 10rpx;
      height: 18rpx;
      border-width: 3rpx;
    }

    .see-checkbox__label {
      font-size: 28rpx;
    }
  }

  &--large {
    .see-checkbox__icon {
      width: 48rpx;
      height: 48rpx;
      border-radius: 10rpx;
    }

    .see-checkbox__indeterminate-line {
      width: 24rpx;
      height: 4rpx;
    }

    .see-checkbox__check-mark {
      width: 12rpx;
      height: 22rpx;
      border-width: 3rpx;
    }

    .see-checkbox__label {
      font-size: 32rpx;
    }
  }

  /* ---------- 图标 ---------- */
  &__icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--see-bg-color);
    border: 2rpx solid var(--see-border-color);
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  /* ---------- 半选状态 ---------- */
  &__indeterminate {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__indeterminate-line {
    background-color: var(--see-primary);
    border-radius: 2rpx;
  }

  /* ---------- 选中状态 ---------- */
  &__checked {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__check-mark {
    border-style: solid;
    border-color: var(--see-text);
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) translate(-10%, -10%);
  }

  /* ---------- 文字标签 ---------- */
  &__label {
    color: var(--see-main-color);
    line-height: 1.5;
  }

  /* ---------- 选中状态 ---------- */
  &.is-checked {
    .see-checkbox__icon {
      background-color: var(--see-primary);
      border-color: var(--see-primary);
    }
  }

  /* ---------- 半选状态 ---------- */
  &.is-indeterminate {
    .see-checkbox__icon {
      background-color: var(--see-bg-color);
      border-color: var(--see-primary);
    }
  }

  /* ---------- 边框状态 ---------- */
  &.is-border {
    padding: 12rpx 20rpx;
    border: 2rpx solid var(--see-border-four-color);
    border-radius: 8rpx;

    &.is-checked {
      border-color: var(--see-primary);
      background-color: var(--see-primary-light);
    }
  }

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;

    .see-checkbox__icon {
      background-color: var(--see-info-disabled);
      border-color: var(--see-border-three-color);
    }

    &.is-checked .see-checkbox__icon {
      background-color: var(--see-primary-disabled);
      border-color: var(--see-primary-disabled);
    }

    &.is-indeterminate .see-checkbox__icon {
      background-color: var(--see-bg-color);
      border-color: var(--see-border-three-color);
    }

    &.is-indeterminate .see-checkbox__indeterminate-line {
      background-color: var(--see-border-three-color);
    }
  }

  /* ---------- 只读状态 ---------- */
  &.is-readonly {
    cursor: default;
    pointer-events: none;
  }
}
</style>
