<template>
  <view class="see-switch" :class="switchClasses" @click="handleClick">
    <!-- 文字描述 - 未选中 -->
    <text v-if="inactiveText && !isRightText" class="see-switch__text" :class="{ 'see-switch__text--active': !isActive }">
      {{ inactiveText }}
    </text>

    <!-- 开关主体 -->
    <view class="see-switch__core" :style="coreStyle">
      <!-- 自定义选中状态内容 -->
      <view v-if="isActive && $slots.active" class="see-switch__slot">
        <slot name="active"></slot>
      </view>
      <!-- 自定义未选中状态内容 -->
      <view v-if="!isActive && $slots.inactive" class="see-switch__slot">
        <slot name="inactive"></slot>
      </view>
      <!-- 圆点 -->
      <view class="see-switch__dot"></view>
    </view>

    <!-- 文字描述 - 选中 -->
    <text v-if="activeText && !isRightText" class="see-switch__text" :class="{ 'see-switch__text--active': isActive }">
      {{ activeText }}
    </text>

    <!-- 右侧文字描述（activeText/inactiveText 同时存在时显示在右侧） -->
    <text v-if="isRightText" class="see-switch__text see-switch__text--right">
      {{ isActive ? activeText : inactiveText }}
    </text>
  </view>
</template>

<script lang="ts" setup>
/**
 * Switch 开关选择器
 * @description 表示两种相互对立的状态间的切换，开/关，是/否
 * @tutorial https://www.seeuui.cn/components/switch/
 *
 * @property {Boolean | String | Number}  modelValue      绑定值（v-model）
 * @property {Boolean}                     isDisabled      是否禁用（默认 false）
 * @property {Boolean}                     isReadonly      是否只读（默认 false）
 * @property {'small' | 'default' | 'large'} size          尺寸（默认 'default'）
 * @property {String}                      activeColor     选中时背景色
 * @property {String}                      inactiveColor   未选中时背景色
 * @property {Boolean | String | Number}   activeValue     选中时的值（默认 true）
 * @property {Boolean | String | Number}   inactiveValue   未选中时的值（默认 false）
 * @property {String}                      activeText      选中时的文字描述
 * @property {String}                      inactiveText    未选中时的文字描述
 * @property {String}                      name            表单字段名
 */
import { computed, inject } from 'vue'
import { formKey } from '../../utils/shared/form-keys'
import type { SeeSwitchInstance } from './type'

defineOptions({ name: 'SeeSwitch' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值 */
    modelValue?: boolean | string | number
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 尺寸 */
    size?: 'small' | 'default' | 'large'
    /** 选中时背景色 */
    activeColor?: string
    /** 未选中时背景色 */
    inactiveColor?: string
    /** 选中时的值 */
    activeValue?: boolean | string | number
    /** 未选中时的值 */
    inactiveValue?: boolean | string | number
    /** 选中时的文字描述 */
    activeText?: string
    /** 未选中时的文字描述 */
    inactiveText?: string
    /** 表单字段名 */
    name?: string
  }>(),
  {
    modelValue: false,
    isDisabled: false,
    isReadonly: false,
    size: 'default',
    activeColor: '',
    inactiveColor: '',
    activeValue: true,
    inactiveValue: false,
    activeText: '',
    inactiveText: '',
    name: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 状态变化时触发 */
  (e: 'onChange', value: boolean | string | number): void
  /** 点击时触发 */
  (e: 'onClick'): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: boolean | string | number): void
}>()

/** ---------- inject ---------- */
const formContext = inject(formKey, null)

/** ---------- computed ---------- */
/** 当前是否处于激活状态 */
const isActive = computed(() => {
  return props.modelValue === props.activeValue
})

/** 实际禁用状态（考虑 Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.props?.isDisabled || false
})

/** 实际只读状态（考虑 Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || formContext?.props?.isReadonly || false
})

/** 实际尺寸（考虑 Form 联动） */
const mergedSize = computed(() => {
  return props.size || formContext?.props?.size || 'default'
})

/** 是否使用右侧文字布局 */
const isRightText = computed(() => {
  return props.activeText && props.inactiveText
})

/** 开关样式类 */
const switchClasses = computed(() => {
  const classes: string[] = [`see-switch--${mergedSize.value}`]
  if (isActive.value) classes.push('is-active')
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  return classes.join(' ')
})

/** 核心开关样式 */
const coreStyle = computed(() => {
  const style: Record<string, string> = {}

  if (isActive.value && props.activeColor) {
    style.backgroundColor = props.activeColor
  } else if (!isActive.value && props.inactiveColor) {
    style.backgroundColor = props.inactiveColor
  }

  return style
})

/** ---------- methods ---------- */
/**
 * @title 处理点击事件
 * @description 切换开关状态，触发相应事件
 */
const handleClick = () => {
  if (mergedDisabled.value || mergedReadonly.value) return

  emit('onClick')

  const newValue = isActive.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', newValue)
  emit('onChange', newValue)
}

/** ---------- expose ---------- */
defineExpose<SeeSwitchInstance>({
  /** 是否激活 */
  isActive: () => isActive.value,
  /** 是否禁用 */
  isDisabled: () => mergedDisabled.value
})
</script>

<style lang="scss" scoped>
.see-switch {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
  user-select: none;
  cursor: pointer;

  &--small {
    .see-switch__core {
      width: 72rpx;
      height: 40rpx;
      border-radius: 20rpx;
    }

    .see-switch__dot {
      width: 32rpx;
      height: 32rpx;
      border-radius: 16rpx;
    }

    .see-switch__text {
      font-size: 24rpx;
    }

    &.is-active .see-switch__dot {
      transform: translateX(32rpx);
    }
  }

  &--default {
    .see-switch__core {
      width: 96rpx;
      height: 52rpx;
      border-radius: 26rpx;
    }

    .see-switch__dot {
      width: 44rpx;
      height: 44rpx;
      border-radius: 22rpx;
    }

    .see-switch__text {
      font-size: 28rpx;
    }

    &.is-active .see-switch__dot {
      transform: translateX(44rpx);
    }
  }

  &--large {
    .see-switch__core {
      width: 120rpx;
      height: 64rpx;
      border-radius: 32rpx;
    }

    .see-switch__dot {
      width: 56rpx;
      height: 56rpx;
      border-radius: 28rpx;
    }

    .see-switch__text {
      font-size: 32rpx;
    }

    &.is-active .see-switch__dot {
      transform: translateX(56rpx);
    }
  }

  /* ---------- 核心开关 ---------- */
  &__core {
    position: relative;
    display: flex;
    align-items: center;
    background-color: var(--see-border-color);
    transition: background-color 0.3s ease;
    flex-shrink: 0;
  }

  /* ---------- 圆点 ---------- */
  &__dot {
    position: absolute;
    left: 4rpx;
    background-color: var(--see-surface-color);
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
  }

  /* ---------- 文字 ---------- */
  &__text {
    color: var(--see-content-color);
    white-space: nowrap;
    transition: color 0.3s ease;

    &--active {
      color: var(--see-main-color);
    }

    &--right {
      color: var(--see-content-color);
    }
  }

  /* ---------- 插槽 ---------- */
  &__slot {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  /* ---------- 激活状态 ---------- */
  &.is-active {
    .see-switch__core {
      background-color: var(--see-primary);
    }
  }

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;

    .see-switch__core {
      background-color: var(--see-border-color);
    }

    &.is-active .see-switch__core {
      background-color: var(--see-primary-disabled);
    }
  }

  /* ---------- 只读状态 ---------- */
  &.is-readonly {
    cursor: default;
    pointer-events: none;
  }
}
</style>
