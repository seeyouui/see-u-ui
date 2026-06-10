<template>
  <view class="see-skeleton" :style="rootStyle">
    <!-- 骨架占位 -->
    <view v-if="props.loading" class="see-skeleton__placeholder">
      <!-- 头像 -->
      <view
        v-if="props.avatar"
        :class="[
          'see-skeleton__avatar',
          `see-skeleton__avatar--${props.avatarShape}`,
          {
            'see-skeleton--animate': props.isAnimate
          }
        ]"
        :style="avatarStyle"
      />

      <!-- 文本行 -->
      <view class="see-skeleton__rows">
        <view
          v-for="(row, index) in rowList"
          :key="index"
          :class="[
            'see-skeleton__row',
            {
              'see-skeleton__row--title': props.title && index === 0,
              'see-skeleton--animate': props.isAnimate
            }
          ]"
          :style="getRowStyle(index)"
        />
      </view>
    </view>

    <!-- 实际内容 -->
    <view v-else class="see-skeleton__content">
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeSkeleton 骨架屏
 * @description 在页面加载数据时显示骨架占位，提升用户体验。
 * @tutorial https://www.seeuui.cn/components/skeleton/
 * @property {Boolean} loading 是否显示骨架屏
 * @property {Number} rows 骨架行数
 * @property {String|String[]} rowWidth 行宽度
 * @property {String} rowHeight 行高
 * @property {String} rowGap 行间距
 * @property {Boolean} avatar 是否显示头像
 * @property {String} avatarSize 头像大小
 * @property {'circle'|'square'} avatarShape 头像形状
 * @property {Boolean} title 是否显示标题
 * @property {Boolean} isAnimate 是否启用动画
 * @property {String} skeletonBgColor 骨架背景色
 * @property {String} highlightColor 高亮色
 */
import { computed } from 'vue'
import type { SeeSkeletonProps } from './type'

defineOptions({ name: 'SeeSkeleton' })

const props = withDefaults(defineProps<SeeSkeletonProps>(), {
  loading: true,
  rows: 3,
  rowHeight: '32rpx',
  rowGap: '20rpx',
  avatar: false,
  avatarSize: '80rpx',
  avatarShape: 'circle',
  title: false,
  isAnimate: true,
  skeletonBgColor: 'var(--see-info)',
  highlightColor: 'var(--see-bg-color)'
})

const rootStyle = computed(() => ({
  '--skeleton-bg': props.skeletonBgColor,
  '--skeleton-highlight': props.highlightColor
}))

const rowList = computed(() => {
  return Array.from({ length: props.rows }, (_, i) => i)
})

const avatarStyle = computed(() => ({
  width: props.avatarSize,
  height: props.avatarSize,
  marginRight: '24rpx',
  flexShrink: 0,
  backgroundColor: props.skeletonBgColor
}))

const getRowStyle = (index: number) => {
  let width: string
  if (Array.isArray(props.rowWidth)) {
    width = props.rowWidth.length > 0 ? props.rowWidth[index % props.rowWidth.length] : '100%'
  } else if (props.rowWidth) {
    width = props.rowWidth
  } else {
    width = index === props.rows - 1 ? '60%' : '100%'
  }

  // title 行使用特殊高度和间距
  const isTitleRow = props.title && index === 0
  const height = isTitleRow ? '40rpx' : props.rowHeight
  const marginBottom = isTitleRow ? '24rpx' : index < props.rows - 1 ? props.rowGap : 0

  return {
    width,
    height,
    marginBottom
  }
}
</script>

<style lang="scss" scoped>
.see-skeleton {
  width: 100%;

  &__placeholder {
    display: flex;
    align-items: flex-start;
    padding: 24rpx 0;
  }

  &__rows {
    flex: 1;
    min-width: 0;
  }

  &__row {
    background-color: var(--skeleton-bg, var(--see-info));
    border-radius: 8rpx;
    position: relative;
    overflow: hidden;
  }

  &__avatar {
    background-color: var(--skeleton-bg, var(--see-info));
    position: relative;
    overflow: hidden;

    &--circle {
      border-radius: 50%;
    }

    &--square {
      border-radius: 12rpx;
    }
  }

  &--animate {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--skeleton-highlight, var(--see-bg-color)) 50%, transparent);
      animation: see-skeleton-shimmer 1.5s ease-in-out infinite;
    }
  }
}

@keyframes see-skeleton-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}
</style>
