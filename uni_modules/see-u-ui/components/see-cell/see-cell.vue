<template>
  <view
    :class="[
      'see-cell',
      {
        'see-cell--link': props.isLink || props.to,
        'see-cell--required': props.isRequired,
        'see-cell--border': props.border,
        'see-cell--center': props.isCenter
      }
    ]"
    :style="cellStyle"
    :hover-class="clickEffectClass"
    @click="handleClick"
  >
    <!-- 必填星号 -->
    <text v-if="props.isRequired" class="see-cell__required">*</text>

    <!-- 图标插槽/属性 -->
    <view v-if="props.icon || $slots.icon" class="see-cell__icon">
      <slot name="icon">
        <text class="see-cell__icon-text" :style="{ fontSize: props.iconSize }">{{ props.icon }}</text>
      </slot>
    </view>

    <!-- 标题区域 -->
    <view class="see-cell__title" :style="titleStyle">
      <slot name="title">
        <text class="see-cell__title-text">{{ props.title }}</text>
      </slot>
      <text v-if="props.label" class="see-cell__label">{{ props.label }}</text>
    </view>

    <!-- 值区域 -->
    <view v-if="props.value || $slots.value" class="see-cell__value">
      <slot name="value">
        <text class="see-cell__value-text">{{ props.value }}</text>
      </slot>
    </view>

    <!-- 右侧插槽 -->
    <view v-if="$slots.right" class="see-cell__right">
      <slot name="right" />
    </view>

    <!-- 箭头 -->
    <view v-if="props.isLink || props.to" class="see-cell__arrow">
      <text class="see-cell__arrow-icon">›</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeCell 单元格
 * @description 列表项组件，支持图标、标题、描述、右侧内容、箭头跳转等功能。
 * @tutorial https://www.seeuui.cn/components/cell/
 * @property {String} title 标题
 * @property {String} value 值/右侧文字
 * @property {String} label 描述/副标题
 * @property {String} icon 图标名称
 * @property {String} iconSize 图标大小
 * @property {Boolean} isLink 是否显示箭头
 * @property {String} to 跳转URL
 * @property {Boolean} isRequired 是否必填
 * @property {Boolean} border 是否显示下边框
 * @property {String} height 单元格高度
 * @property {String} clickEffect 点击反馈
 * @property {String} titleWidth 标题宽度
 * @property {Boolean} isCenter 是否居中
 * @event {Function} onClick 点击时触发
 */
import { computed } from 'vue'
import type { SeeCellProps, SeeCellEmits } from './type'

defineOptions({ name: 'SeeCell' })

const props = withDefaults(defineProps<SeeCellProps>(), {
  iconSize: '40rpx',
  isLink: false,
  isRequired: false,
  border: true,
  clickEffect: 'background',
  isCenter: false,
  titleWidth: 'auto'
})

const emit = defineEmits<SeeCellEmits>()

const cellStyle = computed(() => ({
  minHeight: props.height || undefined,
  height: props.height || undefined
}))

const titleStyle = computed(() => ({
  width: props.titleWidth !== 'auto' ? props.titleWidth : undefined,
  minWidth: props.titleWidth !== 'auto' ? props.titleWidth : undefined
}))

const clickEffectClass = computed(() => {
  if (props.clickEffect === 'none') return ''
  if (props.clickEffect === 'background') return 'see-cell--hover-bg'
  return 'see-cell--hover-opacity'
})

const handleClick = () => {
  emit('onClick')
  if (props.to) {
    try {
      uni.navigateTo({ url: props.to })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('SeeCell: 页面跳转失败', message)
    }
  }
}
</script>

<style lang="scss" scoped>
.see-cell {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  background-color: var(--see-bg-color);
  position: relative;
  min-height: 96rpx;
  box-sizing: border-box;

  &--border {
    border-bottom: 1px solid var(--see-border-color);
  }

  &--center {
    justify-content: center;
  }

  &--hover-bg {
    background-color: var(--see-info);
  }

  &--hover-opacity {
    opacity: 0.7;
  }

  &__required {
    color: var(--see-error);
    margin-right: 6rpx;
    font-size: 28rpx;
  }

  &__icon {
    margin-right: 20rpx;
    flex-shrink: 0;
    &-text {
      font-size: 40rpx;
    }
  }

  &__title {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4rpx;
    min-width: 0;
    &-text {
      font-size: 28rpx;
      color: var(--see-main-color);
    }
  }

  &__label {
    font-size: 24rpx;
    color: var(--see-tips-color);
  }

  &__value {
    margin-left: auto;
    padding-left: 20rpx;
    flex-shrink: 0;
    &-text {
      font-size: 26rpx;
      color: var(--see-tips-color);
    }
  }

  &__right {
    margin-left: auto;
    padding-left: 20rpx;
  }

  &__arrow {
    margin-left: 10rpx;
    flex-shrink: 0;
    &-icon {
      font-size: 32rpx;
      color: var(--see-tips-color);
    }
  }
}
</style>
