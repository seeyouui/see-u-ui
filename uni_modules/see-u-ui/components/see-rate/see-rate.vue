<template>
  <view class="see-rate" :class="{ 'is-disabled': mergedDisabled, 'is-readonly': mergedReadonly }" :style="rateStyle">
    <view v-for="index in count" :key="index" class="see-rate__item" :style="itemStyle">
      <!-- 左半星（半星模式） -->
      <view v-if="allowHalf" class="see-rate__half see-rate__half--left" @click="onTapHalf(index, 'left')"></view>
      <!-- 右半星 / 整星 -->
      <view class="see-rate__half see-rate__half--right" @click="onTapHalf(index, 'right')"></view>
      <!-- 背景图标（未选中） -->
      <text class="see-rate__icon see-rate__icon--void" :style="{ fontSize: size + 'px', color: voidColor || 'var(--see-border-three-color)' }">
        {{ voidIcon }}
      </text>
      <!-- 前景图标（选中）- 通过 clip 控制显示比例 -->
      <text class="see-rate__icon see-rate__icon--active" :style="getActiveIconStyle(index)">{{ icon }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Rate 评分
 * @description 评分组件，用于对事物进行评级操作。支持半星、自定义图标、清除等特性。
 * @tutorial https://www.seeuui.cn/components/rate/
 *
 * @property {Number}   modelValue   绑定值（默认 0）
 * @property {Number}   count        星星总数（默认 5）
 * @property {Number}   size         星星大小，单位 px（默认 24）
 * @property {Boolean}  isDisabled   是否禁用（默认 false）
 * @property {Boolean}  isReadonly   是否只读（默认 false）
 * @property {Boolean}  allowHalf    是否允许半星（默认 false）
 * @property {Boolean}  isClearable  是否允许再次点击清除（默认 false）
 * @property {String}   color        选中颜色（默认使用主题主色）
 * @property {String}   voidColor    未选中颜色
 * @property {String}   icon         选中图标（默认 ★）
 * @property {String}   voidIcon     未选中图标（默认 ☆）
 * @property {Number}   gap          星星间距，单位 px（默认 4）
 * @property {String}   name         表单字段名
 */
import { computed, inject } from 'vue'
import type { RateProps, FormContext } from './type'

defineOptions({
  name: 'SeeRate'
})

/** ---------- props ---------- */
const props = withDefaults(defineProps<RateProps>(), {
  modelValue: 0,
  count: 5,
  size: 24,
  isDisabled: false,
  isReadonly: false,
  allowHalf: false,
  isClearable: false,
  color: '',
  voidColor: '',
  icon: '★',
  voidIcon: '☆',
  gap: 4,
  name: ''
})

/** ---------- emits ---------- */
const emit = defineEmits<{
  (e: 'onChange', value: number): void
  (e: 'update:modelValue', value: number): void
}>()

/** ---------- inject ---------- */
const formContext = inject<FormContext | null>('FormContext', null)

/** ---------- computed ---------- */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.isDisabled || false
})

const mergedReadonly = computed(() => {
  return props.isReadonly || formContext?.isReadonly || false
})

const activeColor = computed(() => {
  return props.color || 'var(--see-primary)'
})

const rateStyle = computed(() => ({
  '--rate-gap': props.gap + 'px'
}))

const itemStyle = computed(() => ({
  width: props.size + 'px',
  height: props.size + 'px'
}))

/**
 * @title 获取选中图标样式
 * @description 根据当前星星索引计算前景图标的裁剪比例，实现半星效果
 */
const getActiveIconStyle = (index: number) => {
  const diff = props.modelValue - (index - 1)

  let clipPercent: number
  if (diff >= 1) {
    clipPercent = 100
  } else if (diff > 0) {
    clipPercent = props.allowHalf ? 50 : 100
  } else {
    clipPercent = 0
  }

  return {
    fontSize: props.size + 'px',
    color: activeColor.value,
    clipPath: `inset(0 ${100 - clipPercent}% 0 0)`
  }
}

/** ---------- methods ---------- */
/**
 * @title 点击星星
 * @description 处理星星点击事件，支持整星、半星和清除逻辑
 */
const onTapHalf = (index: number, side: 'left' | 'right') => {
  if (mergedDisabled.value || mergedReadonly.value) return

  let newValue: number

  if (props.allowHalf) {
    // 半星模式：左侧点击 = 0.5，右侧点击 = 1
    newValue = side === 'left' ? index - 0.5 : index
  } else {
    newValue = index
  }

  // 再次点击同一值时清除（如果允许清除）
  if (props.isClearable && newValue === props.modelValue) {
    newValue = 0
  }

  emit('update:modelValue', newValue)
  emit('onChange', newValue)
}
</script>

<style lang="scss" scoped>
.see-rate {
  display: inline-flex;
  align-items: center;
  gap: var(--rate-gap);

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &.is-readonly {
    pointer-events: none;
  }

  &__item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__half {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;

    &--left {
      left: 0;
      width: 50%;
    }

    &--right {
      right: 0;
      width: 100%;
    }
  }

  &__icon {
    line-height: 1;
    transition:
      color 0.15s ease,
      clip-path 0.15s ease;

    &--void {
      position: absolute;
      top: 0;
      left: 0;
    }

    &--active {
      position: relative;
    }
  }
}
</style>
