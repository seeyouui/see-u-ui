<template>
  <view class="see-box" :style="boxStyle">
    <slot />
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeBox 盒子
 * @description 基础的布局容器组件，提供内边距、外边距、背景色等样式属性的快捷配置，支持 Flex 布局。
 * @tutorial https://www.seeuui.cn/components/box/
 * @property {String} padding 内边距
 * @property {String} margin 外边距
 * @property {String} bgColor 背景色
 * @property {String} width 宽度
 * @property {String} height 高度
 * @property {String} radius 圆角
 * @property {'small'|'medium'|'large'} shadow 阴影
 * @property {String} border 边框宽度
 * @property {String} borderColor 边框颜色
 * @property {'row'|'column'} direction Flex方向
 * @property {'nowrap'|'wrap'|'wrap-reverse'} wrap 换行
 * @property {String} justify 主轴对齐
 * @property {String} align 交叉轴对齐
 * @property {String} gap 间距
 */
import { computed } from 'vue'
import type { SeeBoxProps } from './type'

defineOptions({ name: 'SeeBox' })

const props = withDefaults(defineProps<SeeBoxProps>(), {
  padding: '0',
  margin: '0',
  width: '100%',
  radius: '0',
  border: '0',
  borderColor: 'var(--see-border-color)',
  direction: 'row',
  wrap: 'nowrap',
  justify: 'flex-start',
  align: 'stretch',
  gap: '0'
})

const shadowStyle = computed(() => {
  const shadows: Record<NonNullable<SeeBoxProps['shadow']>, string> = {
    small: 'var(--see-shadow-small)',
    medium: 'var(--see-shadow-medium)',
    large: 'var(--see-shadow-large)'
  }
  return props.shadow ? shadows[props.shadow] : 'none'
})

const boxStyle = computed(() => ({
  padding: props.padding,
  margin: props.margin,
  background: props.bgColor,
  width: props.width,
  height: props.height || undefined,
  borderRadius: props.radius,
  boxShadow: shadowStyle.value,
  borderWidth: props.border,
  borderStyle: props.border !== '0' ? 'solid' : undefined,
  borderColor: props.border !== '0' ? props.borderColor : undefined,
  display: 'flex',
  flexDirection: props.direction,
  flexWrap: props.wrap,
  justifyContent: props.justify,
  alignItems: props.align,
  gap: props.gap
}))
</script>

<style lang="scss" scoped>
.see-box {
  box-sizing: border-box;
}
</style>
