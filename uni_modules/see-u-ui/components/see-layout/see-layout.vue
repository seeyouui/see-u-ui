<template>
  <view class="see-layout" :style="layoutStyle">
    <slot />
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeLayout 布局
 * @description 基于 Flexbox 的 24 列栅格布局容器，通过搭配 see-layout-item 子组件实现页面布局。
 * @tutorial https://www.seeuui.cn/components/layout/
 * @property {String} direction Flex 方向
 * @property {String} wrap 换行
 * @property {String} justify 主轴对齐
 * @property {String} align 交叉轴对齐
 * @property {Number|String} gap 栅格间距
 */
import { computed } from 'vue'
import type { SeeLayoutProps } from './type'

defineOptions({ name: 'SeeLayout' })

const props = withDefaults(defineProps<SeeLayoutProps>(), {
  direction: 'row',
  wrap: 'wrap',
  justify: 'flex-start',
  align: 'flex-start',
  gap: 0
})

const layoutStyle = computed(() => ({
  display: 'flex',
  flexDirection: props.direction,
  flexWrap: props.wrap,
  justifyContent: props.justify,
  alignItems: props.align,
  gap: typeof props.gap === 'number' ? `${props.gap}rpx` : props.gap
}))
</script>

<style lang="scss" scoped>
.see-layout {
  box-sizing: border-box;
  width: 100%;
}
</style>
