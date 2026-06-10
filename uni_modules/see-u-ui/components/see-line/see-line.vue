<template>
  <view
    :class="[
      'see-line',
      `see-line--${props.direction}`,
      {
        'see-line--dashed': props.isDashed
      }
    ]"
    :style="lineStyle"
  />
</template>

<script lang="ts" setup>
/**
 * SeeLine 线条
 * @description 水平或垂直方向的分割线，支持实线、虚线、自定义颜色和粗细。
 * @tutorial https://www.seeuui.cn/components/line/
 * @property {'horizontal'|'vertical'} direction 方向
 * @property {String} color 颜色
 * @property {String} size 粗细
 * @property {String} margin 外边距
 * @property {Boolean} isDashed 是否虚线
 * @property {String} length 长度
 */
import { computed } from 'vue'
import type { SeeLineProps } from './type'

defineOptions({ name: 'SeeLine' })

const props = withDefaults(defineProps<SeeLineProps>(), {
  direction: 'horizontal',
  color: 'var(--see-border-color)',
  size: '1px',
  margin: '0',
  isDashed: false,
  length: '100%'
})

const lineStyle = computed(() => {
  const baseStyle = {
    '--line-color': props.color,
    color: props.color,
    margin: props.margin
  }
  if (props.direction === 'vertical') {
    return {
      ...baseStyle,
      width: props.size,
      height: props.length,
      backgroundColor: props.isDashed ? 'transparent' : props.color
    }
  }
  return {
    ...baseStyle,
    width: props.length,
    height: props.size,
    backgroundColor: props.isDashed ? 'transparent' : props.color
  }
})
</script>

<style lang="scss" scoped>
.see-line {
  box-sizing: border-box;
  display: block;

  &--dashed {
    background-image: repeating-linear-gradient(to right, currentColor 0, currentColor 8px, transparent 8px, transparent 16px);
  }

  &--vertical {
    &.see-line--dashed {
      background-image: repeating-linear-gradient(to bottom, currentColor 0, currentColor 8px, transparent 8px, transparent 16px);
    }
  }
}
</style>
