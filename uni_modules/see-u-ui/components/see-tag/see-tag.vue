<template>
  <view class="see-tag" :class="tagClasses" :style="tagStyle" @click="handleClick">
    <text class="see-tag__content">
      <slot></slot>
    </text>
    <view v-if="closable" class="see-tag__close" @click.stop="handleClose">
      <text class="see-tag__close-icon">×</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Tag 标签
 * @description 标签组件，用于标记和分类。支持多种主题类型、效果样式、可关闭等特性。
 * @tutorial https://www.seeuui.cn/components/tag/
 * @property {'default'|'primary'|'success'|'warning'|'danger'|'info'}  type        标签类型（默认 'default'）
 * @property {'small'|'default'|'large'}                                size        标签大小（默认 'default'）
 * @property {'dark'|'light'|'plain'}                                   effect      显示效果（默认 'light'）
 * @property {Boolean}                                                  closable    是否可关闭（默认 false）
 * @property {Boolean}                                                  round       是否圆角（默认 false）
 * @property {String}                                                   color       自定义颜色（覆盖type）
 * @property {String}                                                   bgColor     自定义背景颜色
 * @property {String}                                                   textColor   自定义文字颜色
 * @property {String}                                                   borderColor 自定义边框颜色
 * @property {Boolean}                                                  disabled    是否禁用（默认 false）
 * @property {Boolean}                                                  mark        是否标记样式（默认 false）
 * @property {Boolean}                                                  hit         是否显示边框（默认 false）
 */
import { computed } from 'vue'

defineOptions({ name: 'SeeTag' })

interface TagProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'default' | 'large'
  effect?: 'dark' | 'light' | 'plain'
  closable?: boolean
  round?: boolean
  color?: string
  bgColor?: string
  textColor?: string
  borderColor?: string
  disabled?: boolean
  mark?: boolean
  hit?: boolean
}

const props = withDefaults(defineProps<TagProps>(), {
  type: 'default',
  size: 'default',
  effect: 'light',
  closable: false,
  round: false,
  color: '',
  bgColor: '',
  textColor: '',
  borderColor: '',
  disabled: false,
  mark: false,
  hit: false
})

const emit = defineEmits<{
  (e: 'onClick', event: Event): void
  (e: 'onClose', event: Event): void
}>()

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h
  const r = parseInt(full.substring(0, 2), 16)
  const g = parseInt(full.substring(2, 4), 16)
  const b = parseInt(full.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return hex
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const EMPTY_STYLE: Record<string, string> = {}

const tagClasses = computed(() => {
  const classes: string[] = [`see-tag--${props.type}`]
  if (props.size !== 'default') classes.push(`see-tag--${props.size}`)
  classes.push(`see-tag--${props.effect}`)
  if (props.round) classes.push('is-round')
  if (props.mark) classes.push('is-mark')
  if (props.hit) classes.push('is-hit')
  if (props.closable) classes.push('is-closable')
  if (props.disabled) classes.push('is-disabled')
  if (props.color || props.bgColor) classes.push('is-custom')
  return classes.join(' ')
})

const tagStyle = computed(() => {
  if (!props.color && !props.bgColor && !props.textColor && !props.borderColor) return EMPTY_STYLE

  const style: Record<string, string> = {}

  if (props.bgColor) {
    style.backgroundColor = props.bgColor
  } else if (props.color) {
    if (props.effect === 'dark') {
      style.backgroundColor = props.color
    } else if (props.effect === 'light') {
      style.backgroundColor = hexToRgba(props.color, 0.1)
    }
  }

  if (props.textColor) {
    style.color = props.textColor
  } else if (props.color) {
    if (props.effect === 'dark') {
      style.color = '#ffffff'
    } else if (props.effect === 'light' || props.effect === 'plain') {
      style.color = props.color
    }
  }

  if (props.borderColor) {
    style.borderColor = props.borderColor
  } else if (props.color && (props.hit || props.effect === 'plain')) {
    style.borderColor = props.color
  }

  return style
})

const handleClick = (event: Event) => {
  if (props.disabled) return
  emit('onClick', event)
}

const handleClose = (event: Event) => {
  if (props.disabled) return
  emit('onClose', event)
}

defineExpose({
  getType: () => props.type,
  isDisabled: () => props.disabled
})
</script>

<style lang="scss" scoped>
.see-tag {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
  line-height: 1;
  height: 56rpx;
  padding: 0 16rpx;
  font-size: 24rpx;
  border-radius: 8rpx;
  position: relative;

  &--small {
    height: 44rpx;
    padding: 0 12rpx;
    font-size: 20rpx;
    border-radius: 6rpx;
    .see-tag__close-icon { font-size: 20rpx; margin-left: 4rpx; }
  }

  &--large {
    height: 68rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    border-radius: 10rpx;
    .see-tag__close-icon { font-size: 28rpx; margin-left: 8rpx; }
  }

  .see-tag__close-icon { font-size: 24rpx; margin-left: 6rpx; }

  &.is-round { border-radius: 999rpx; }

  &.is-mark { border-radius: 0 8rpx 8rpx 0; }

  &.is-disabled { opacity: 0.5; pointer-events: none; }

  &__content {
    display: inline-flex;
    align-items: center;
    line-height: 1;
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 4rpx;
    border-radius: 50%;
    min-width: 32rpx;
    min-height: 32rpx;
  }

  &__close-icon {
    line-height: 1;
    font-weight: bold;
  }

  /* ========== DARK EFFECT ========== */
  &--dark.see-tag--default {
    background-color: var(--see-info);
    color: var(--see-info-text);
    border-color: var(--see-info);
    .see-tag__close-icon { color: var(--see-info-text); }
    &.is-hit { border-color: var(--see-info-border); }
  }
  &--dark.see-tag--primary {
    background-color: var(--see-primary);
    color: var(--see-text);
    border-color: var(--see-primary);
    .see-tag__close-icon { color: var(--see-text); }
  }
  &--dark.see-tag--success {
    background-color: var(--see-success);
    color: var(--see-text);
    border-color: var(--see-success);
    .see-tag__close-icon { color: var(--see-text); }
  }
  &--dark.see-tag--warning {
    background-color: var(--see-warning);
    color: var(--see-text);
    border-color: var(--see-warning);
    .see-tag__close-icon { color: var(--see-text); }
  }
  &--dark.see-tag--danger {
    background-color: var(--see-error);
    color: var(--see-text);
    border-color: var(--see-error);
    .see-tag__close-icon { color: var(--see-text); }
  }
  &--dark.see-tag--info {
    background-color: var(--see-info-dark);
    color: var(--see-text);
    border-color: var(--see-info-dark);
    .see-tag__close-icon { color: var(--see-text); }
  }

  /* ========== LIGHT EFFECT ========== */
  &--light.see-tag--default {
    background-color: var(--see-info-light);
    color: var(--see-info-text);
    border-color: transparent;
    .see-tag__close-icon { color: var(--see-info-text); }
    &.is-hit { border-color: var(--see-border-four-color); }
  }
  &--light.see-tag--primary {
    background-color: var(--see-primary-light);
    color: var(--see-primary);
    border-color: transparent;
    .see-tag__close-icon { color: var(--see-primary); }
    &.is-hit { border-color: var(--see-primary-disabled); }
  }
  &--light.see-tag--success {
    background-color: var(--see-success-light);
    color: var(--see-success);
    border-color: transparent;
    .see-tag__close-icon { color: var(--see-success); }
    &.is-hit { border-color: var(--see-success-disabled); }
  }
  &--light.see-tag--warning {
    background-color: var(--see-warning-light);
    color: var(--see-warning);
    border-color: transparent;
    .see-tag__close-icon { color: var(--see-warning); }
    &.is-hit { border-color: var(--see-warning-disabled); }
  }
  &--light.see-tag--danger {
    background-color: var(--see-error-light);
    color: var(--see-error);
    border-color: transparent;
    .see-tag__close-icon { color: var(--see-error); }
    &.is-hit { border-color: var(--see-error-disabled); }
  }
  &--light.see-tag--info {
    background-color: var(--see-info-light);
    color: var(--see-info-dark);
    border-color: transparent;
    .see-tag__close-icon { color: var(--see-info-dark); }
    &.is-hit { border-color: var(--see-info-border); }
  }

  /* ========== PLAIN EFFECT ========== */
  &--plain.see-tag--default {
    background-color: transparent;
    color: var(--see-info-text);
    border-color: var(--see-border-four-color);
    .see-tag__close-icon { color: var(--see-info-text); }
  }
  &--plain.see-tag--primary {
    background-color: transparent;
    color: var(--see-primary);
    border-color: var(--see-primary);
    .see-tag__close-icon { color: var(--see-primary); }
  }
  &--plain.see-tag--success {
    background-color: transparent;
    color: var(--see-success);
    border-color: var(--see-success);
    .see-tag__close-icon { color: var(--see-success); }
  }
  &--plain.see-tag--warning {
    background-color: transparent;
    color: var(--see-warning);
    border-color: var(--see-warning);
    .see-tag__close-icon { color: var(--see-warning); }
  }
  &--plain.see-tag--danger {
    background-color: transparent;
    color: var(--see-error);
    border-color: var(--see-error);
    .see-tag__close-icon { color: var(--see-error); }
  }
  &--plain.see-tag--info {
    background-color: transparent;
    color: var(--see-info-dark);
    border-color: var(--see-info-border);
    .see-tag__close-icon { color: var(--see-info-dark); }
  }

  /* ========== CUSTOM COLOR ========== */
  &.is-custom {
    background-color: transparent;
    color: inherit;
    border-color: transparent;
  }
}
</style>
