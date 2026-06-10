<template>
  <view
    :class="[
      'see-grid',
      {
        'see-grid--border': props.border,
        'see-grid--square': props.isSquare
      }
    ]"
    :style="gridStyle"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeGrid 宫格布局
 * @description 宫格布局容器，搭配 see-grid-item 使用，支持自定义列数、间距、边框等。
 * @tutorial https://www.seeuui.cn/components/grid/
 * @property {Number} columns 列数
 * @property {Number|String} gap 间距
 * @property {Boolean} border 是否显示边框
 * @property {String} borderColor 边框颜色
 * @property {Boolean} isSquare 是否正方形
 * @property {Boolean} isClickable 是否开启点击反馈
 */
import { computed, provide } from 'vue'
import type { SeeGridProps } from './type'
import { gridColumnsKey, gridIsSquareKey, gridIsClickableKey, gridBorderKey, gridBorderColorKey } from './type'

defineOptions({ name: 'SeeGrid' })

const props = withDefaults(defineProps<SeeGridProps>(), {
  columns: 4,
  gap: 0,
  border: false,
  borderColor: 'var(--see-border-color)',
  isSquare: false,
  isClickable: false
})

// 通过 provide 向子组件传递配置（使用类型安全的 InjectionKey）
provide(
  gridColumnsKey,
  computed(() => props.columns)
)
provide(
  gridIsSquareKey,
  computed(() => props.isSquare)
)
provide(
  gridIsClickableKey,
  computed(() => props.isClickable)
)
provide(
  gridBorderKey,
  computed(() => props.border)
)
provide(
  gridBorderColorKey,
  computed(() => props.borderColor)
)

const gridStyle = computed(() => ({
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: typeof props.gap === 'number' ? `${props.gap}rpx` : props.gap || undefined,
  borderTop: props.border ? `1px solid ${props.borderColor}` : undefined,
  borderLeft: props.border ? `1px solid ${props.borderColor}` : undefined
}))
</script>

<style lang="scss" scoped>
.see-grid {
  box-sizing: border-box;
  width: 100%;
}
</style>
