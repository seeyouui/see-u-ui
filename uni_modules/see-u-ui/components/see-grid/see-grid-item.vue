<template>
  <view
    :class="[
      'see-grid-item',
      {
        'see-grid-item--clickable': gridClickable,
        'see-grid-item--border': gridBorder
      }
    ]"
    :style="itemStyle"
    @click="handleClick"
  >
    <slot name="icon">
      <text v-if="props.icon" class="see-grid-item__icon" :style="{ fontSize: props.iconSize }">{{ props.icon }}</text>
    </slot>
    <slot name="text">
      <text v-if="props.text" class="see-grid-item__text">{{ props.text }}</text>
    </slot>
    <slot />
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeGridItem 宫格项
 * @description 宫格布局的子项，需放在 see-grid 内部使用。
 * @property {String} text 文本
 * @property {String} icon 图标
 * @property {String} iconSize 图标大小
 * @property {String} to 跳转路径
 * @property {Number} index 索引
 * @event {Function} onClick 点击时触发
 */
import { computed, inject } from 'vue'
import type { SeeGridItemProps, SeeGridItemEmits } from './type'
import { gridColumnsKey, gridIsSquareKey, gridIsClickableKey, gridBorderKey, gridBorderColorKey } from './type'

defineOptions({ name: 'SeeGridItem' })

const props = withDefaults(defineProps<SeeGridItemProps>(), {
  iconSize: '48rpx',
  index: 0
})

const emit = defineEmits<SeeGridItemEmits>()

// 从父组件注入配置（使用类型安全的 InjectionKey）
const gridColumns = inject(
  gridColumnsKey,
  computed(() => 4)
)
const gridIsSquare = inject(
  gridIsSquareKey,
  computed(() => false)
)
const gridIsClickable = inject(
  gridIsClickableKey,
  computed(() => false)
)
const gridBorder = inject(
  gridBorderKey,
  computed(() => false)
)
const gridBorderColor = inject(
  gridBorderColorKey,
  computed(() => 'var(--see-border-color)')
)

const columns = computed(() => gridColumns.value ?? 4)
const isSquare = computed(() => gridIsSquare.value ?? false)
const gridClickable = computed(() => gridIsClickable.value ?? false)

const itemStyle = computed(() => ({
  width: `${100 / columns.value}%`,
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  padding: '24rpx 0',
  boxSizing: 'border-box' as const,
  borderBottom: gridBorder.value ? `1px solid ${gridBorderColor.value}` : undefined,
  borderRight: gridBorder.value ? `1px solid ${gridBorderColor.value}` : undefined,
  ...(isSquare.value ? { aspectRatio: '1' } : {})
}))

const handleClick = () => {
  emit('onClick', props.index)
  if (props.to) {
    uni.navigateTo({ url: props.to })
  }
}
</script>

<style lang="scss" scoped>
.see-grid-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24rpx 0;

  &--clickable:active {
    opacity: 0.7;
    background-color: var(--see-info);
  }

  &__icon {
    margin-bottom: 8rpx;
  }

  &__text {
    font-size: 24rpx;
    color: var(--see-main-color);
    text-align: center;
  }
}
</style>
