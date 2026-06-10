<template>
  <view class="see-layout-item" :style="itemStyle">
    <slot />
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeLayoutItem 布局项
 * @description 24 列栅格系统中的列，必须放在 see-layout 内使用。
 * @property {Number} span 占据列数
 * @property {Number} offset 偏移列数
 * @property {Number} flex 自定义 flex
 */
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type { SeeLayoutItemProps } from './type'

defineOptions({ name: 'SeeLayoutItem' })

const props = withDefaults(defineProps<SeeLayoutItemProps>(), {
  span: 24,
  offset: 0
})

const itemStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    boxSizing: 'border-box'
  }
  if (props.flex) {
    style.flex = `${props.flex}`
  } else if (props.span === 0) {
    style.width = 'auto'
  } else {
    style.width = `${(props.span / 24) * 100}%`
  }
  if (props.offset > 0) {
    style.marginLeft = `${(props.offset / 24) * 100}%`
  }
  return style
})
</script>

<style lang="scss" scoped>
.see-layout-item {
  box-sizing: border-box;
}
</style>
