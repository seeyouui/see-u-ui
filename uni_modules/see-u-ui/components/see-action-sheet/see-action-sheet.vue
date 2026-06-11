<template>
  <see-popup
    :show="show"
    position="bottom"
    :z-index="zIndex"
    :duration="duration"
    :is-close-on-click-overlay="isCloseOnClickOverlay"
    :is-round="isRound"
    :is-safe-area="isSafeArea"
    :before-close="beforeClose"
    :is-overlay="true"
    @on-open="handleOpen"
    @on-close="handleClose"
    @update:show="handleUpdateShow"
  >
    <view class="see-action-sheet">
      <!-- 标题区域 -->
      <view v-if="title || description || $slots.header" class="see-action-sheet__header">
        <slot name="header">
          <text v-if="title" class="see-action-sheet__title">{{ title }}</text>
          <text v-if="description" class="see-action-sheet__description">{{ description }}</text>
        </slot>
      </view>

      <!-- 选项列表 -->
      <view class="see-action-sheet__content">
        <slot>
          <view
            v-for="(action, index) in actions"
            :key="index"
            class="see-action-sheet__item"
            :class="{
              'see-action-sheet__item--disabled': action.isDisabled,
              'see-action-sheet__item--loading': action.loading
            }"
            @click="handleSelect(action, index)"
          >
            <!-- 自定义选项插槽 -->
            <slot name="action" :action="action" :index="index">
              <!-- 图标 -->
              <view v-if="action.icon" class="see-action-sheet__item-icon">
                <text class="see-action-sheet__item-icon-text">{{ action.icon }}</text>
              </view>

              <!-- 文字内容 -->
              <view class="see-action-sheet__item-content">
                <text class="see-action-sheet__item-name" :style="{ color: action.color }">{{ action.name }}</text>
                <text v-if="action.description" class="see-action-sheet__item-desc">{{ action.description }}</text>
              </view>

              <!-- 加载状态 -->
              <view v-if="action.loading" class="see-action-sheet__item-loading">
                <view class="see-action-sheet__loading-ring" />
              </view>
            </slot>
          </view>
        </slot>
      </view>

      <!-- 间隔 -->
      <view v-if="isShowCancelBtn" class="see-action-sheet__gap" />

      <!-- 取消按钮 -->
      <view v-if="isShowCancelBtn" class="see-action-sheet__cancel" @click="handleCancel">
        <text class="see-action-sheet__cancel-text">{{ cancelText }}</text>
      </view>
    </view>
  </see-popup>
</template>

<script lang="ts" setup>
/**
 * SeeActionSheet 操作菜单
 * @description 从底部弹出的操作选项菜单
 * @tutorial https://www.seeuui.cn/components/action-sheet/
 * @property {Boolean} show 是否显示（v-model）
 * @property {String} title 标题
 * @property {String} description 描述文字
 * @property {Array} actions 选项列表
 * @property {String} cancelText 取消按钮文字
 * @property {Boolean} isShowCancelBtn 是否显示取消按钮
 * @property {Number} zIndex z-index
 * @property {Number} duration 动画时长
 * @property {Boolean} isCloseOnClickOverlay 点击遮罩是否关闭
 * @property {Boolean} isRound 是否圆角
 * @property {Boolean} isSafeArea 是否适配安全区
 * @property {Function} beforeClose 关闭前钩子
 * @event {Function} onSelect 选择选项时触发
 * @event {Function} onCancel 点击取消时触发
 * @event {Function} onOpen 打开时触发
 * @event {Function} onClose 关闭时触发
 */
import type { SeeActionSheetProps, SeeActionSheetEmits, ActionSheetAction } from './type'
import { SeePopup } from '../see-popup'

defineOptions({ name: 'SeeActionSheet' })

withDefaults(defineProps<SeeActionSheetProps>(), {
  show: false,
  title: '',
  description: '',
  actions: () => [],
  cancelText: '取消',
  isShowCancelBtn: true,
  zIndex: 1001,
  duration: 300,
  isCloseOnClickOverlay: true,
  isRound: true,
  isSafeArea: true,
  beforeClose: null
})

const emit = defineEmits<SeeActionSheetEmits>()

// ==================== 事件处理 ====================

const handleOpen = () => {
  emit('onOpen')
}

const handleClose = () => {
  emit('onClose')
}

const handleUpdateShow = (value: boolean) => {
  emit('update:show', value)
}

const handleSelect = (action: ActionSheetAction, index: number) => {
  if (action.isDisabled || action.loading) return
  emit('onSelect', action, index)
  emit('update:show', false)
}

const handleCancel = () => {
  emit('onCancel')
  emit('update:show', false)
}

// ==================== Expose ====================

defineExpose({
  open: () => emit('update:show', true),
  close: () => emit('update:show', false)
})
</script>

<style lang="scss" scoped>
.see-action-sheet {
  background-color: var(--see-bg-color);

  &__header {
    padding: 24rpx 32rpx;
    text-align: center;
    border-bottom: 1px solid var(--see-border-four-color);
  }

  &__title {
    font-size: 28rpx;
    font-weight: bold;
    color: var(--see-main-color);
  }

  &__description {
    font-size: 24rpx;
    color: var(--see-tips-color);
    margin-top: 8rpx;
  }

  &__content {
    max-height: 60vh;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96rpx;
    padding: 0 32rpx;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 32rpx;
      right: 32rpx;
      bottom: 0;
      height: 1px;
      background-color: var(--see-border-four-color);
    }

    &:last-child::after {
      display: none;
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &--loading {
      pointer-events: none;
    }
  }

  &__item-icon {
    margin-right: 16rpx;
  }

  &__item-icon-text {
    font-size: 36rpx;
  }

  &__item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__item-name {
    font-size: 30rpx;
    color: var(--see-main-color);
  }

  &__item-desc {
    font-size: 24rpx;
    color: var(--see-tips-color);
    margin-top: 4rpx;
  }

  &__item-loading {
    margin-left: 16rpx;
  }

  &__loading-ring {
    width: 36rpx;
    height: 36rpx;
    border: 3rpx solid var(--see-border-color);
    border-top-color: var(--see-primary);
    border-radius: 50%;
    animation: see-action-sheet-spin 0.8s linear infinite;
  }

  &__gap {
    height: 12rpx;
    background-color: var(--see-info);
  }

  &__cancel {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96rpx;
    background-color: var(--see-bg-color);
  }

  &__cancel-text {
    font-size: 30rpx;
    color: var(--see-main-color);
  }
}

@keyframes see-action-sheet-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
