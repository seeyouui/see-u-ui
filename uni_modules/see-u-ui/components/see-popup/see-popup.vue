<template>
  <!-- #ifdef H5 -->
  <Teleport to="body">
    <view v-show="visible" class="see-popup" :class="popupClasses" :style="popupStyle" @click="handleOverlayClick">
      <view class="see-popup__overlay" :class="{ 'see-popup__overlay--active': isShow }" :style="overlayStyle" />
      <view class="see-popup__container" :class="containerClasses" :style="containerStyle" @click.stop>
        <!-- 标题栏 -->
        <view v-if="isShowHeader || title || $slots.header" class="see-popup__header">
          <slot name="header">
            <text class="see-popup__title">{{ title }}</text>
          </slot>
        </view>

        <!-- 关闭按钮 -->
        <view v-if="isShowCloseBtn" class="see-popup__close" :class="`see-popup__close--${closeBtnPosition}`" @click="handleClose">
          <slot name="close-btn">
            <text class="see-popup__close-icon">×</text>
          </slot>
        </view>

        <!-- 内容区域 -->
        <view class="see-popup__content">
          <slot />
        </view>
      </view>
    </view>
  </Teleport>
  <!-- #endif -->

  <!-- #ifndef H5 -->
  <view v-show="visible" class="see-popup" :class="popupClasses" :style="popupStyle" @click="handleOverlayClick">
    <view class="see-popup__overlay" :class="{ 'see-popup__overlay--active': isShow }" :style="overlayStyle" />
    <view class="see-popup__container" :class="containerClasses" :style="containerStyle" @click.stop>
      <!-- 标题栏 -->
      <view v-if="isShowHeader || title || $slots.header" class="see-popup__header">
        <slot name="header">
          <text class="see-popup__title">{{ title }}</text>
        </slot>
      </view>

      <!-- 关闭按钮 -->
      <view v-if="isShowCloseBtn" class="see-popup__close" :class="`see-popup__close--${closeBtnPosition}`" @click="handleClose">
        <slot name="close-btn">
          <text class="see-popup__close-icon">×</text>
        </slot>
      </view>

      <!-- 内容区域 -->
      <view class="see-popup__content">
        <slot />
      </view>
    </view>
  </view>
  <!-- #endif -->
</template>

<script lang="ts" setup>
/**
 * SeePopup 弹出层
 * @description 作为所有弹出类组件的底层容器，提供统一的弹出/关闭动画、遮罩管理、层级管理
 * @tutorial https://www.seeuui.cn/components/popup/
 * @property {Boolean} show 是否显示（v-model）
 * @property {String} position 弹出位置
 * @property {Number} zIndex z-index
 * @property {Number} duration 动画时长(ms)
 * @property {Boolean} isOverlay 是否显示遮罩
 * @property {String} overlayBackground 遮罩背景色
 * @property {Number} overlayOpacity 遮罩透明度
 * @property {Boolean} isCloseOnClickOverlay 点击遮罩是否关闭
 * @property {Boolean} isLockScroll 是否锁定背景滚动
 * @property {Boolean} isShowCloseBtn 是否显示关闭按钮
 * @property {String} closeBtnPosition 关闭按钮位置
 * @property {Boolean} isRound 是否圆角
 * @property {String} borderRadius 自定义圆角值
 * @property {Boolean} isSafeArea 是否适配安全区
 * @property {Boolean} isShowHeader 是否显示标题栏
 * @property {String} title 标题文字
 * @property {String} transitionName 过渡动画名称
 * @property {Boolean} isCloseOnPressBack 是否响应返回键
 * @property {Function} beforeClose 关闭前钩子
 * @event {Function} onOpen 弹出层打开时触发
 * @event {Function} onOpened 弹出层打开动画结束时触发
 * @event {Function} onClose 弹出层关闭时触发
 * @event {Function} onClosed 弹出层关闭动画结束时触发
 * @event {Function} onClickOverlay 点击遮罩时触发
 */
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import type { SeePopupProps, SeePopupEmits } from './type'

defineOptions({ name: 'SeePopup' })

// ==================== 全局滚动锁定（共享计数器） ====================

let globalLockCount = 0
let globalSavedScrollTop = 0

const globalLockScroll = () => {
  if (globalLockCount === 0) {
    globalSavedScrollTop = document.documentElement.scrollTop || document.body.scrollTop
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${globalSavedScrollTop}px`
    document.body.style.width = '100%'
  }
  globalLockCount++
}

const globalUnlockScroll = () => {
  globalLockCount--
  if (globalLockCount <= 0) {
    globalLockCount = 0
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.documentElement.scrollTop = globalSavedScrollTop
    document.body.scrollTop = globalSavedScrollTop
  }
}

const props = withDefaults(defineProps<SeePopupProps>(), {
  show: false,
  position: 'bottom',
  zIndex: 1000,
  duration: 300,
  isOverlay: true,
  overlayBackground: 'var(--see-overlay-bg)',
  overlayOpacity: 1,
  isCloseOnClickOverlay: true,
  isLockScroll: true,
  isShowCloseBtn: false,
  closeBtnPosition: 'top-right',
  isRound: true,
  borderRadius: '32rpx 32rpx 0 0',
  isSafeArea: true,
  isShowHeader: false,
  title: '',
  transitionName: 'see-popup',
  isCloseOnPressBack: true,
  beforeClose: null
})

const emit = defineEmits<SeePopupEmits>()

// ==================== 状态管理 ====================

/** 内部显示状态（控制 DOM 可见性） */
const visible = ref(false)
/** 是否正在显示（用于动画 class） */
const isShow = ref(false)
/** 是否已解锁滚动（防止双重解锁） */
let hasUnlocked = false
/** 关闭序列号，用于防止旧 close timer 在新 open 之后错误 unlock */
let closeSequence = 0

let animationTimer: ReturnType<typeof setTimeout> | null = null

// ==================== 层级管理 ====================

let currentZIndex = props.zIndex

const getNextZIndex = () => {
  currentZIndex += 1
  return currentZIndex
}

// ==================== 滚动锁定 ====================

const lockScroll = () => {
  if (!props.isLockScroll) return
  globalLockScroll()
}

const unlockScroll = () => {
  if (!props.isLockScroll) return
  globalUnlockScroll()
}

// ==================== 计算属性 ====================

/** 弹出层样式类 */
const popupClasses = computed(() => [
  `see-popup--${props.position}`,
  {
    'see-popup--round': props.isRound && (props.position === 'top' || props.position === 'bottom'),
    'see-popup--safe-area': props.isSafeArea && props.position === 'bottom'
  }
])

/** 弹出层样式 */
const popupStyle = computed(() => ({
  zIndex: currentZIndex,
  display: visible.value ? undefined : 'none'
}))

/** 遮罩层样式 */
const overlayStyle = computed(() => ({
  backgroundColor: props.overlayBackground,
  opacity: isShow.value ? props.overlayOpacity : 0
}))

/** 内容容器类 */
const containerClasses = computed(() => [
  `see-popup__container--${props.position}`,
  {
    'see-popup__container--round': props.isRound && (props.position === 'top' || props.position === 'bottom'),
    'see-popup__container--safe-area': props.isSafeArea && props.position === 'bottom',
    'see-popup__container--show': isShow.value
  }
])

/** 内容容器样式 */
const containerStyle = computed(() => {
  const style: Record<string, string> = {}

  // 自定义圆角
  if (props.isRound) {
    if (props.position === 'bottom') {
      style.borderRadius = '32rpx 32rpx 0 0'
    } else if (props.position === 'top') {
      style.borderRadius = '0 0 32rpx 32rpx'
    }
  } else if (props.borderRadius) {
    style.borderRadius = props.borderRadius
  }

  return style
})

// ==================== 动画控制 ====================

const cleanupTimer = () => {
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
}

const open = () => {
  cleanupTimer()
  // 递增序列号使旧 close timer 失效
  closeSequence++
  // If already visible, unlock the previous lock first to prevent count leak
  if (visible.value && !hasUnlocked) {
    hasUnlocked = true
    unlockScroll()
  }
  hasUnlocked = false
  currentZIndex = getNextZIndex()
  visible.value = true
  lockScroll()
  emit('onOpen')
  emit('update:show', true)

  // 使用双层 requestAnimationFrame 确保浏览器先渲染隐藏状态，再触发动画
  // 第一帧：DOM 已更新，元素处于隐藏位置（translateY(100%) 等）
  // 第二帧：浏览器已绘制隐藏状态，现在添加 show 类触发过渡动画
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isShow.value = true
    })
  })

  animationTimer = setTimeout(() => {
    emit('onOpened')
  }, props.duration)
}

const close = () => {
  cleanupTimer()
  isShow.value = false
  emit('onClose')

  // 记录本次关闭的序列号
  const thisClose = ++closeSequence

  // 等待动画结束后隐藏 DOM
  animationTimer = setTimeout(() => {
    animationTimer = null
    visible.value = false
    // 仅当没有新的 open/close 发生时才 unlock（防止旧 timer 干扰新 lock）
    if (!hasUnlocked && closeSequence === thisClose) {
      hasUnlocked = true
      unlockScroll()
    }
    emit('onClosed')
    emit('update:show', false)
  }, props.duration)
}

// ==================== 事件处理 ====================

const handleOverlayClick = () => {
  emit('onClickOverlay')
  if (props.isCloseOnClickOverlay) {
    // 同步执行关闭，不使用 async
    if (props.beforeClose) {
      const result = props.beforeClose()
      if (result instanceof Promise) {
        result.then((canClose) => {
          if (canClose !== false) close()
        })
      } else if (result !== false) {
        close()
      }
    } else {
      close()
    }
  }
}

const handleClose = () => {
  close()
}

// ==================== 返回键处理 ====================

// #ifdef H5
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isCloseOnPressBack && visible.value) {
    close()
  }
}
// #endif

// ==================== 生命周期 ====================

watch(
  () => props.show,
  (val) => {
    if (val) {
      open()
    } else if (visible.value) {
      close()
    }
  }
)

onMounted(() => {
  // #ifdef H5
  if (props.isCloseOnPressBack) {
    document.addEventListener('keydown', handleKeydown)
  }
  // #endif

  // 初始状态为显示时
  if (props.show) {
    open()
  }
})

onUnmounted(() => {
  cleanupTimer()
  if (!hasUnlocked) {
    hasUnlocked = true
    unlockScroll()
  }

  // #ifdef H5
  document.removeEventListener('keydown', handleKeydown)
  // #endif
})

// ==================== Expose ====================

defineExpose({
  open,
  close,
  toggle: () => {
    if (visible.value) {
      close()
    } else {
      open()
    }
  }
})
</script>

<style lang="scss" scoped>
.see-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: auto;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 300ms ease;

    &--active {
      opacity: 1;
    }
  }

  &__container {
    position: absolute;
    background-color: var(--see-bg-color);
    transition:
      transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
      opacity 300ms ease;

    &--top {
      top: 0;
      left: 0;
      right: 0;
      transform: translateY(-100%);

      &.see-popup__container--show {
        transform: translateY(0);
      }
    }

    &--bottom {
      bottom: 0;
      left: 0;
      right: 0;
      transform: translateY(100%);

      &.see-popup__container--show {
        transform: translateY(0);
      }
    }

    &--left {
      top: 0;
      left: 0;
      bottom: 0;
      transform: translateX(-100%);

      &.see-popup__container--show {
        transform: translateX(0);
      }
    }

    &--right {
      top: 0;
      right: 0;
      bottom: 0;
      transform: translateX(100%);

      &.see-popup__container--show {
        transform: translateX(0);
      }
    }

    &--center {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      opacity: 0;

      &.see-popup__container--show {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }

    &--round {
      &.see-popup__container--bottom {
        border-radius: 32rpx 32rpx 0 0;
      }

      &.see-popup__container--top {
        border-radius: 0 0 32rpx 32rpx;
      }
    }

    &--safe-area {
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    padding: 0 30rpx;
    border-bottom: 1px solid var(--see-border-four-color);
  }

  &__title {
    font-size: 32rpx;
    font-weight: bold;
    color: var(--see-main-color);
  }

  &__close {
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64rpx;
    height: 64rpx;

    &--top-right {
      top: 16rpx;
      right: 16rpx;
    }

    &--top-left {
      top: 16rpx;
      left: 16rpx;
    }
  }

  &__close-icon {
    font-size: 40rpx;
    color: var(--see-tips-color);
    line-height: 1;
  }

  &__content {
    position: relative;
  }
}
</style>
