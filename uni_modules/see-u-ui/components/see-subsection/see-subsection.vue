<template>
  <view class="see-subsection" :class="subsectionClass">
    <!-- 滑块（pill 模式） -->
    <view v-if="type === 'pill'" class="see-subsection__slider" :style="sliderStyle" />

    <!-- 选项列表 -->
    <view
      v-for="(option, index) in options"
      :key="option.value"
      class="see-subsection__item"
      :class="{
        'see-subsection__item--active': modelValue === option.value,
        'see-subsection__item--disabled': isDisabled || option.isDisabled
      }"
      :style="getItemStyle(option, index)"
      @tap="handleClick(option)"
    >
      <text class="see-subsection__text" :style="getTextStyle(option)">
        {{ option.label }}
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { SubsectionOption, SeeSubsectionProps, SeeSubsectionEmits } from './type'

defineOptions({ name: 'SeeSubsection' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeSubsectionProps>(), {
  modelValue: '',
  options: () => [],
  type: 'default',
  size: 'default',
  activeColor: '',
  isDisabled: false,
  isFullWidth: false
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeSubsectionEmits>()

/** ---------- computed ---------- */
const subsectionClass = computed(() => ({
  [`see-subsection--${props.type}`]: true,
  [`see-subsection--${props.size}`]: true,
  'see-subsection--full': props.isFullWidth
}))

const activeIndex = computed(() => {
  return props.options.findIndex((o) => o.value === props.modelValue)
})

const sliderStyle = computed(() => {
  if (props.type !== 'pill') return {}
  const index = activeIndex.value
  if (index === -1) return { display: 'none' }
  // pill 模式下 .see-subsection 有 4rpx padding，滑块自身 left:4rpx + right 留 4rpx，
  // 因此滑块可活动的范围是 "100% - 8rpx"，等分 N 份；
  // 用 calc 表达式既保证宽度准确，又让 translateX 始终落在内容区内。
  const n = props.options.length
  const widthExpr = `calc((100% - 8rpx) / ${n})`
  const offsetExpr = `calc((100% - 8rpx) / ${n} * ${index})`
  return {
    width: widthExpr,
    transform: `translateX(${offsetExpr})`
  }
})

/** ---------- methods ---------- */
const getItemStyle = (option: SubsectionOption, _index: number) => {
  const style: Record<string, string> = {}
  if (props.isFullWidth) {
    style.flex = '1'
  }
  // button 模式下激活项背景色
  if (props.type === 'button' && props.modelValue === option.value && props.activeColor) {
    style.background = props.activeColor
  }
  return style
}

const getTextStyle = (option: SubsectionOption) => {
  const style: Record<string, string> = {}
  // default 模式下激活项文字颜色（pill 模式由 CSS 控制，避免与滑块色冲突）
  if (props.type === 'default' && props.modelValue === option.value && props.activeColor) {
    style.color = props.activeColor
  }
  // button 模式下激活项文字颜色
  if (props.type === 'button' && props.modelValue === option.value) {
    style.color = '#ffffff'
  }
  return style
}

const handleClick = (option: SubsectionOption) => {
  if (props.isDisabled || option.isDisabled) return
  if (option.value !== props.modelValue) {
    emit('update:modelValue', option.value)
    emit('onChange', option.value, option)
  }
}
</script>

<style lang="scss" scoped>
.see-subsection {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--see-subsection-bg, var(--see-border-four-color));
  border-radius: 8rpx;
  overflow: hidden;

  &--full {
    width: 100%;
  }

  &--small {
    height: 48rpx;

    .see-subsection__text {
      font-size: 24rpx;
    }
  }

  &--default {
    height: var(--see-subsection-height, 56rpx);

    .see-subsection__text {
      font-size: 28rpx;
    }
  }

  &--large {
    height: 72rpx;

    .see-subsection__text {
      font-size: 30rpx;
    }
  }

  // default 模式
  &--default &__item {
    position: relative;
    z-index: 1;
  }

  &--default &__item--active {
    .see-subsection__text {
      color: var(--see-subsection-active-color, #ffffff);
    }
  }

  &--default &__item--active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16rpx;
    right: 16rpx;
    height: 4rpx;
    background: var(--see-subsection-active-bg, var(--see-primary));
    border-radius: 2rpx;
  }

  // button 模式
  &--button {
    background: var(--see-subsection-bg, var(--see-border-four-color));
    padding: 4rpx;
  }

  &--button &__item {
    border-radius: 6rpx;
  }

  &--button &__item--active {
    background: var(--see-subsection-active-bg, var(--see-primary));

    .see-subsection__text {
      color: var(--see-subsection-active-color, #ffffff);
    }
  }

  // pill 模式
  &--pill {
    background: var(--see-subsection-bg, var(--see-border-four-color));
    padding: 4rpx;
  }

  &--pill &__item {
    border-radius: 8rpx;
  }

  &--pill &__item--active {
    .see-subsection__text {
      color: var(--see-subsection-active-color, #ffffff);
    }
  }

  &__slider {
    position: absolute;
    top: 4rpx;
    bottom: 4rpx;
    left: 4rpx;
    background: var(--see-subsection-active-bg, var(--see-primary));
    border-radius: 6rpx;
    transition: transform 0.3s ease;
    z-index: 0;
  }

  &__item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16rpx;
    box-sizing: border-box;
    position: relative;
    z-index: 1;

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__text {
    font-size: 28rpx;
    color: var(--see-subsection-inactive-color, var(--see-main-color));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
