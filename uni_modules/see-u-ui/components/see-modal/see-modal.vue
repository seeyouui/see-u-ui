<template>
  <see-popup
    :show="show"
    position="center"
    :z-index="zIndex"
    :duration="duration"
    :is-close-on-click-overlay="isCloseOnClickOverlay"
    :is-lock-scroll="isLockScroll"
    :is-overlay="true"
    @on-open="handleOpen"
    @on-opened="handleOpened"
    @on-close="handleClose"
    @on-closed="handleClosed"
    @on-click-overlay="handleClickOverlay"
    @update:show="handleUpdateShow"
  >
    <view class="see-modal" :style="modalStyle">
      <!-- 标题栏 -->
      <view v-if="isShowHeader && (title || $slots.header)" class="see-modal__header">
        <slot name="header">
          <text class="see-modal__title">{{ title }}</text>
        </slot>
      </view>

      <!-- 内容区域 -->
      <view class="see-modal__body" :class="{ 'see-modal__body--no-header': !isShowHeader || !title }">
        <slot>
          <text v-if="content" class="see-modal__content">{{ content }}</text>
        </slot>
      </view>

      <!-- 底部按钮区 -->
      <view v-if="isShowFooter" class="see-modal__footer">
        <slot name="footer">
          <view class="see-modal__buttons">
            <view v-if="isShowCancelBtn" class="see-modal__btn see-modal__btn--cancel" @click="handleCancel">
              <text class="see-modal__btn-text see-modal__btn-text--cancel">{{ cancelText }}</text>
            </view>
            <view
              class="see-modal__btn see-modal__btn--confirm"
              :class="{
                [`see-modal__btn--${confirmType}`]: true,
                'see-modal__btn--loading': isConfirmLoading,
                'see-modal__btn--disabled': isConfirmDisabled
              }"
              @click="handleConfirm"
            >
              <view v-if="isConfirmLoading" class="see-modal__loading">
                <view class="see-modal__loading-ring" />
              </view>
              <text class="see-modal__btn-text see-modal__btn-text--confirm">{{ confirmText }}</text>
            </view>
          </view>
        </slot>
      </view>
    </view>
  </see-popup>
</template>

<script lang="ts" setup>
/**
 * SeeModal 模态框
 * @description 基于 Popup(center) 的标准模态对话框，支持标题、内容、操作按钮
 * @tutorial https://www.seeuui.cn/components/modal/
 * @property {Boolean} show 是否显示（v-model）
 * @property {String} title 标题
 * @property {String} content 内容文字
 * @property {Boolean} isShowHeader 是否显示标题栏
 * @property {Boolean} isShowFooter 是否显示底部按钮区
 * @property {String} confirmText 确认按钮文字
 * @property {String} cancelText 取消按钮文字
 * @property {Boolean} isShowCancelBtn 是否显示取消按钮
 * @property {String} confirmType 确认按钮类型
 * @property {Boolean} isConfirmLoading 确认按钮是否加载中
 * @property {Boolean} isConfirmDisabled 确认按钮是否禁用
 * @property {String} width 模态框宽度
 * @property {Number} zIndex z-index
 * @property {Number} duration 动画时长
 * @property {Boolean} isCloseOnClickOverlay 点击遮罩是否关闭
 * @property {Boolean} isLockScroll 是否锁定背景滚动
 * @property {Function} beforeClose 关闭前钩子
 * @event {Function} onConfirm 点击确认按钮
 * @event {Function} onCancel 点击取消按钮
 * @event {Function} onOpen 打开时触发
 * @event {Function} onOpened 打开动画结束
 * @event {Function} onClose 关闭时触发
 * @event {Function} onClosed 关闭动画结束
 */
import { computed } from 'vue'
import type { SeeModalProps, SeeModalEmits } from './type'
import { SeePopup } from '../see-popup'

defineOptions({ name: 'SeeModal' })

const props = withDefaults(defineProps<SeeModalProps>(), {
  show: false,
  title: '',
  content: '',
  isShowHeader: true,
  isShowFooter: true,
  confirmText: '确认',
  cancelText: '取消',
  isShowCancelBtn: true,
  confirmType: 'primary',
  isConfirmLoading: false,
  isConfirmDisabled: false,
  width: '600rpx',
  zIndex: 1001,
  duration: 300,
  isCloseOnClickOverlay: false,
  isLockScroll: true,
  beforeClose: null
})

const emit = defineEmits<SeeModalEmits>()

// ==================== 计算属性 ====================

const modalStyle = computed(() => ({
  width: props.width
}))

// ==================== 事件处理 ====================

const handleOpen = () => {
  emit('onOpen')
}

const handleOpened = () => {
  emit('onOpened')
}

const handleClose = () => {
  emit('onClose')
}

const handleClosed = () => {
  emit('onClosed')
}

const handleClickOverlay = () => {
  // Modal 默认不允许点击遮罩关闭
}

const handleUpdateShow = (value: boolean) => {
  emit('update:show', value)
}

const handleConfirm = async () => {
  if (props.isConfirmLoading || props.isConfirmDisabled) return
  if (props.beforeClose) {
    const canClose = await props.beforeClose('confirm')
    if (canClose === false) return
  }
  emit('onConfirm')
  emit('update:show', false)
}

const handleCancel = async () => {
  if (props.beforeClose) {
    const canClose = await props.beforeClose('cancel')
    if (canClose === false) return
  }
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
.see-modal {
  background-color: var(--see-bg-color);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: var(--see-shadow-large);

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32rpx 32rpx 0;
  }

  &__title {
    font-size: 32rpx;
    font-weight: bold;
    color: var(--see-main-color);
    text-align: center;
  }

  &__body {
    padding: 32rpx;
    max-height: 60vh;
    overflow-y: auto;

    &--no-header {
      padding-top: 48rpx;
    }
  }

  &__content {
    font-size: 28rpx;
    color: var(--see-content-color);
    line-height: 1.6;
    text-align: center;
  }

  &__footer {
    border-top: 1px solid var(--see-border-four-color);
  }

  &__buttons {
    display: flex;
    height: 88rpx;
  }

  &__btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &--cancel {
      border-right: 1px solid var(--see-border-four-color);
    }

    &--confirm {
      &.see-modal__btn--loading,
      &.see-modal__btn--disabled {
        opacity: 0.6;
        pointer-events: none;
      }
    }

    &--primary {
      .see-modal__btn-text--confirm {
        color: var(--see-primary);
      }
    }

    &--danger {
      .see-modal__btn-text--confirm {
        color: var(--see-error);
      }
    }

    &--warning {
      .see-modal__btn-text--confirm {
        color: var(--see-warning);
      }
    }
  }

  &__btn-text {
    font-size: 30rpx;

    &--cancel {
      color: var(--see-content-color);
    }

    &--confirm {
      font-weight: 500;
    }
  }

  &__loading {
    margin-right: 8rpx;
  }

  &__loading-ring {
    width: 32rpx;
    height: 32rpx;
    border: 3rpx solid var(--see-border-color);
    border-top-color: var(--see-primary);
    border-radius: 50%;
    animation: see-modal-spin 0.8s linear infinite;
  }
}

@keyframes see-modal-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
