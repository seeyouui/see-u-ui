<template>
  <view
    :class="[
      'see-card',
      `see-card--shadow-${props.shadow}`,
      {
        'see-card--border': props.border
      }
    ]"
    :style="cardStyle"
    @tap="emit('onClick')"
  >
    <!-- 头部 -->
    <view v-if="props.title || $slots.header" class="see-card__header" @tap.stop="emit('onHeaderClick')">
      <slot name="header">
        <view class="see-card__header-content">
          <text class="see-card__title">{{ props.title }}</text>
          <text v-if="props.subTitle" class="see-card__sub-title">{{ props.subTitle }}</text>
        </view>
      </slot>
    </view>

    <!-- 主体 -->
    <view class="see-card__body">
      <slot />
    </view>

    <!-- 底部 -->
    <view v-if="$slots.footer" class="see-card__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeCard 卡片
 * @description 卡片容器组件，提供标题、副标题、阴影、圆角等功能。
 * @tutorial https://www.seeuui.cn/components/card/
 * @property {String} title 卡片标题
 * @property {String} subTitle 副标题
 * @property {'never'|'always'|'hover'} shadow 阴影
 * @property {String} padding 内边距
 * @property {String} radius 圆角
 * @property {String} margin 外边距
 * @property {Boolean} border 是否显示边框
 * @property {String} width 宽度
 * @event {Function} onClick 点击卡片时触发
 * @event {Function} onHeaderClick 点击头部时触发
 */
import { computed } from 'vue'
import type { SeeCardProps, SeeCardEmits } from './type'

defineOptions({ name: 'SeeCard' })

const props = withDefaults(defineProps<SeeCardProps>(), {
  padding: '30rpx',
  shadow: 'always',
  radius: '16rpx',
  margin: '0',
  border: true,
  width: '100%'
})

const emit = defineEmits<SeeCardEmits>()

const cardStyle = computed(() => ({
  padding: props.padding,
  borderRadius: props.radius,
  margin: props.margin,
  width: props.width,
  backgroundColor: 'var(--see-bg-color)',
  boxShadow: props.shadow === 'always' ? 'var(--see-card-shadow)' : 'none',
  borderWidth: props.border ? '1px' : '0',
  borderStyle: props.border ? 'solid' : undefined,
  borderColor: props.border ? 'var(--see-border-color)' : undefined
}))
</script>

<style lang="scss" scoped>
.see-card {
  box-sizing: border-box;
  overflow: hidden;

  &--shadow-hover:active {
    box-shadow: var(--see-card-shadow-hover);
  }

  &__header {
    padding-bottom: 20rpx;
    &-content {
      display: flex;
      flex-direction: column;
      gap: 4rpx;
    }
  }

  &__title {
    font-size: 30rpx;
    font-weight: 600;
    color: var(--see-main-color);
  }

  &__sub-title {
    font-size: 24rpx;
    color: var(--see-tips-color);
  }

  &__body {
    // 默认主体区域
  }

  &__footer {
    border-top: 1px solid var(--see-border-color);
    margin-top: 20rpx;
    padding-top: 20rpx;
  }
}
</style>
