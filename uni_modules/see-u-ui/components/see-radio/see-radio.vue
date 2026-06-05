<template>
  <view class="see-radio" :class="radioClasses" :style="radioStyle" @click="handleClick">
    <!-- 单选框圆圈 -->
    <view class="see-radio__circle" :class="{ 'is-checked': isChecked }">
      <view v-if="isChecked" class="see-radio__inner" :style="innerStyle"></view>
    </view>
    <!-- 文字标签 -->
    <text class="see-radio__label">
      <slot>{{ label }}</slot>
    </text>
  </view>
</template>

<script lang="ts" setup>
/**
 * Radio 单选框
 * @description 在一组备选项中进行单选，必须配合 RadioGroup 使用
 * @tutorial https://www.seeuui.cn/components/radio/
 *
 * @property {String | Number | Boolean} label      选项值
 * @property {Boolean}                     isDisabled 是否禁用（默认 false）
 * @property {'small'|'default'|'large'}   size       尺寸（默认 'default'）
 * @property {Boolean}                     isBorder   是否显示边框（默认 false）
 * @property {String}                      checkedColor 选中时颜色
 * @property {String}                      name       表单字段名
 */
import { computed, inject, ref } from 'vue'
import { formKey, radioGroupKey } from '../../utils/shared/form-keys'
import type { RadioEmits, RadioGroupContext, FormContext } from './type'

defineOptions({ name: 'SeeRadio' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 选项值 */
    label?: string | number | boolean
    /** 是否禁用 */
    isDisabled?: boolean
    /** 尺寸 */
    size?: 'small' | 'default' | 'large'
    /** 是否显示边框 */
    isBorder?: boolean
    /** 选中时颜色 */
    checkedColor?: string
    /** 表单字段名 */
    name?: string
    /** v-model 绑定值（独立使用时） */
    modelValue?: string | number | boolean
  }>(),
  {
    label: '',
    isDisabled: false,
    size: 'default',
    isBorder: false,
    checkedColor: '',
    name: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<RadioEmits & {
  /** v-model 更新 */
  'update:modelValue': (value: string | number | boolean) => void
}>()

/** ---------- inject ---------- */
const radioGroup = inject(radioGroupKey, null)
const formContext = inject(formKey, null)

/** ---------- computed ---------- */
/** 本地选中状态（独立使用时） */
const localChecked = ref(false)

/** 当前是否选中 */
const isChecked = computed(() => {
  if (radioGroup) return radioGroup.modelValue === props.label
  return props.modelValue !== undefined ? props.modelValue === props.label : localChecked.value
})

/** 实际禁用状态（考虑 Group 和 Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || radioGroup?.isDisabled || formContext?.isDisabled || false
})

/** 实际只读状态（考虑 Group 和 Form 联动） */
const mergedReadonly = computed(() => {
  return radioGroup?.isReadonly || false
})

/** 实际尺寸（优先 Group > 本地 > Form > default） */
const mergedSize = computed(() => {
  return radioGroup?.size || props.size || formContext?.size || 'default'
})

/** 实际是否显示边框（优先 Group > 本地） */
const mergedBorder = computed(() => {
  if (radioGroup?.isBorder !== undefined) return radioGroup.isBorder
  return props.isBorder
})

/** 实际选中颜色（优先 Group > 本地） */
const mergedCheckedColor = computed(() => {
  return props.checkedColor || radioGroup?.checkedColor || ''
})

/** 样式类 */
const radioClasses = computed(() => {
  const classes: string[] = [`see-radio--${mergedSize.value}`]
  if (isChecked.value) classes.push('is-checked')
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (mergedBorder.value) classes.push('is-border')
  return classes.join(' ')
})

/** 整体样式 */
const radioStyle = computed(() => {
  const style: Record<string, string> = {}
  if (isChecked.value && mergedCheckedColor.value) {
    style['--radio-checked-color'] = mergedCheckedColor.value
  }
  return style
})

/** 内圆样式 */
const innerStyle = computed(() => {
  if (mergedCheckedColor.value) {
    return { backgroundColor: mergedCheckedColor.value }
  }
  return {}
})

/** ---------- methods ---------- */
/**
 * @title 处理点击事件
 * @description 切换选中状态，通知 Group 更新值
 */
const handleClick = () => {
  if (mergedDisabled.value || mergedReadonly.value) return

  if (radioGroup) {
    radioGroup.updateValue(props.label)
  } else {
    localChecked.value = true
    emit('update:modelValue', props.label)
  }
  emit('onChange', props.label)
}
</script>

<style lang="scss" scoped>
.see-radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s ease;

  /* ---------- 尺寸 ---------- */
  &--small {
    .see-radio__circle {
      width: 32rpx;
      height: 32rpx;
    }
    .see-radio__inner {
      width: 16rpx;
      height: 16rpx;
    }
    .see-radio__label {
      font-size: 24rpx;
      margin-left: 8rpx;
    }
  }

  &--default {
    .see-radio__circle {
      width: 40rpx;
      height: 40rpx;
    }
    .see-radio__inner {
      width: 20rpx;
      height: 20rpx;
    }
    .see-radio__label {
      font-size: 28rpx;
      margin-left: 12rpx;
    }
  }

  &--large {
    .see-radio__circle {
      width: 48rpx;
      height: 48rpx;
    }
    .see-radio__inner {
      width: 24rpx;
      height: 24rpx;
    }
    .see-radio__label {
      font-size: 32rpx;
      margin-left: 16rpx;
    }
  }

  /* ---------- 边框模式 ---------- */
  &.is-border {
    padding: 8rpx 24rpx;
    border: 2rpx solid var(--see-border-color);
    border-radius: 8rpx;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;

    &.is-checked {
      border-color: var(--radio-checked-color, var(--see-primary));
      background-color: var(--see-primary-light);
    }

    &.is-disabled {
      border-color: var(--see-border-color);
      background-color: var(--see-bg-disabled);
    }
  }

  /* ---------- 选圆圈 ---------- */
  &__circle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2rpx solid var(--see-border-color);
    border-radius: 50%;
    transition: border-color 0.2s ease;
    flex-shrink: 0;

    &.is-checked {
      border-color: var(--radio-checked-color, var(--see-primary));
    }
  }

  /* ---------- 内圆 ---------- */
  &__inner {
    border-radius: 50%;
    background-color: var(--radio-checked-color, var(--see-primary));
    transition: background-color 0.2s ease;
  }

  /* ---------- 文字 ---------- */
  &__label {
    color: var(--see-content-color);
    line-height: 1;
    white-space: nowrap;
  }

  /* ---------- 选中状态 ---------- */
  &.is-checked {
    .see-radio__label {
      color: var(--radio-checked-color, var(--see-primary));
    }
  }

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ---------- 只读状态 ---------- */
  &.is-readonly {
    cursor: default;
    pointer-events: none;
  }
}
</style>
