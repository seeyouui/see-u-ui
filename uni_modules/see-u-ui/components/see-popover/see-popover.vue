<template>
  <view ref="triggerRef" class="see-popover" @click="handleTriggerClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- 触发器插槽 -->
    <slot />

    <!-- 小程序点击外部关闭的透明遮罩 -->
    <!-- #ifndef H5 -->
    <view v-if="isVisible && isCloseOnClickOutside" class="see-popover__mask" @click="handleClose" />
    <!-- #endif -->

    <!-- 弹出内容 -->
    <view
      v-show="isVisible"
      ref="popoverRef"
      class="see-popover__content"
      :class="contentClasses"
      :style="contentStyle"
      @click.stop="handleContentClick"
    >
      <!-- 箭头 -->
      <view v-if="isShowArrow" class="see-popover__arrow" :class="arrowClasses" />

      <!-- 关闭按钮 -->
      <view v-if="isShowCloseBtn" class="see-popover__close" @click="handleClose">
        <text class="see-popover__close-icon">×</text>
      </view>

      <!-- 标题 -->
      <view v-if="title || $slots.title" class="see-popover__header">
        <slot name="title">
          <text class="see-popover__title">{{ title }}</text>
        </slot>
      </view>

      <!-- 内容 -->
      <view class="see-popover__body">
        <slot name="content" />
      </view>

      <!-- 底部 -->
      <view v-if="$slots.footer" class="see-popover__footer">
        <slot name="footer" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeePopover 气泡提示
 * @description 点击或悬停时显示的富内容气泡卡片
 * @tutorial https://www.seeuui.cn/components/popover/
 * @property {Boolean} show 是否显示（v-model）
 * @property {String} position 弹出位置
 * @property {String} trigger 触发方式
 * @property {String} title 标题
 * @property {String} width 弹出宽度
 * @property {String} maxWidth 最大宽度
 * @property {Number} offset 偏移距离
 * @property {Number} zIndex z-index
 * @property {Boolean} isShowArrow 是否显示箭头
 * @property {Boolean} isShowCloseBtn 是否显示关闭按钮
 * @property {Boolean} isCloseOnClickOutside 点击外部是否关闭
 * @property {Boolean} isCloseOnClickContent 点击内容是否关闭
 * @property {Boolean} isDisabled 是否禁用
 * @property {Boolean} isAnimated 是否启用动画
 * @property {Number} duration 动画时长
 * @event {Function} onOpen 显示时触发
 * @event {Function} onClose 隐藏时触发
 */
import { ref, computed, watch, onMounted, onUnmounted, nextTick, getCurrentInstance, type CSSProperties } from 'vue'
import type { SeePopoverProps, SeePopoverEmits, PopoverPosition } from './type'

defineOptions({ name: 'SeePopover' })

const instance = getCurrentInstance()

const props = withDefaults(defineProps<SeePopoverProps>(), {
  show: false,
  position: 'bottom',
  trigger: 'click',
  title: '',
  width: 'auto',
  maxWidth: '500rpx',
  offset: 12,
  zIndex: 2000,
  isShowArrow: true,
  isShowCloseBtn: false,
  isCloseOnClickOutside: true,
  isCloseOnClickContent: false,
  isDisabled: false,
  isAnimated: true,
  duration: 250
})

const emit = defineEmits<SeePopoverEmits>()

// ==================== 状态管理 ====================

const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const isVisible = ref(props.trigger === 'manual' ? props.show : false)
const computedPosition = ref<PopoverPosition>(props.position)
const popoverTop = ref<number | null>(null)
const popoverLeft = ref<number | null>(null)

// ==================== 计算属性 ====================

const contentClasses = computed(() => [
  `see-popover__content--${computedPosition.value}`,
  {
    'see-popover__content--animated': props.isAnimated
  }
])

const contentStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    width: props.width,
    maxWidth: props.maxWidth,
    zIndex: props.zIndex,
    position: 'fixed'
  }
  if (popoverTop.value !== null) {
    style.top = `${popoverTop.value}px`
  }
  if (popoverLeft.value !== null) {
    style.left = `${popoverLeft.value}px`
  }
  return style
})

const arrowClasses = computed(() => [`see-popover__arrow--${computedPosition.value}`])

// ==================== 位置计算 ====================

const updatePosition = () => {
  // #ifdef H5
  nextTick(() => {
    const trigger = triggerRef.value
    const popover = popoverRef.value
    if (!trigger || !popover) return

    const triggerRect = trigger.getBoundingClientRect()
    const popoverRect = popover.getBoundingClientRect()
    const offsetPx = (props.offset / 750) * window.innerWidth

    let top = 0
    let left = 0

    switch (props.position) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offsetPx
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
        break
      case 'top-left':
        top = triggerRect.top - popoverRect.height - offsetPx
        left = triggerRect.left
        break
      case 'top-right':
        top = triggerRect.top - popoverRect.height - offsetPx
        left = triggerRect.right - popoverRect.width
        break
      case 'bottom':
        top = triggerRect.bottom + offsetPx
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
        break
      case 'bottom-left':
        top = triggerRect.bottom + offsetPx
        left = triggerRect.left
        break
      case 'bottom-right':
        top = triggerRect.bottom + offsetPx
        left = triggerRect.right - popoverRect.width
        break
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2
        left = triggerRect.left - popoverRect.width - offsetPx
        break
      case 'left-top':
        top = triggerRect.top
        left = triggerRect.left - popoverRect.width - offsetPx
        break
      case 'left-bottom':
        top = triggerRect.bottom - popoverRect.height
        left = triggerRect.left - popoverRect.width - offsetPx
        break
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2
        left = triggerRect.right + offsetPx
        break
      case 'right-top':
        top = triggerRect.top
        left = triggerRect.right + offsetPx
        break
      case 'right-bottom':
        top = triggerRect.bottom - popoverRect.height
        left = triggerRect.right + offsetPx
        break
    }

    // 边界检测
    const padding = 16
    if (top < padding) top = padding
    if (left < padding) left = padding
    if (top + popoverRect.height > window.innerHeight - padding) {
      top = window.innerHeight - popoverRect.height - padding
    }
    if (left + popoverRect.width > window.innerWidth - padding) {
      left = window.innerWidth - popoverRect.width - padding
    }

    popover.style.top = `${top}px`
    popover.style.left = `${left}px`

    computedPosition.value = props.position
  })
  // #endif

  // #ifndef H5
  // 小程序/App 使用 uni.createSelectorQuery 获取位置
  nextTick(() => {
    const query = uni.createSelectorQuery().in(instance!.proxy)
    query
      .select('.see-popover')
      .boundingClientRect()
      .select('.see-popover__content')
      .boundingClientRect()
      .exec((rects) => {
        const triggerRect = rects?.[0]
        const contentRect = rects?.[1]
        if (!triggerRect) return
        const systemInfo = uni.getSystemInfoSync()
        const offsetPx = (props.offset / 750) * systemInfo.windowWidth
        const screenWidth = systemInfo.windowWidth
        const screenHeight = systemInfo.windowHeight
        const contentW = contentRect?.width || 300
        const contentH = contentRect?.height || 200

        let top = 0
        let left = 0

        switch (props.position) {
          case 'top':
            top = triggerRect.top - contentH - offsetPx
            left = triggerRect.left + triggerRect.width / 2 - contentW / 2
            break
          case 'top-left':
            top = triggerRect.top - contentH - offsetPx
            left = triggerRect.left
            break
          case 'top-right':
            top = triggerRect.top - contentH - offsetPx
            left = triggerRect.right - contentW
            break
          case 'bottom':
            top = triggerRect.bottom + offsetPx
            left = triggerRect.left + triggerRect.width / 2 - contentW / 2
            break
          case 'bottom-left':
            top = triggerRect.bottom + offsetPx
            left = triggerRect.left
            break
          case 'bottom-right':
            top = triggerRect.bottom + offsetPx
            left = triggerRect.right - contentW
            break
          case 'left':
            top = triggerRect.top + triggerRect.height / 2 - contentH / 2
            left = triggerRect.left - contentW - offsetPx
            break
          case 'left-top':
            top = triggerRect.top
            left = triggerRect.left - contentW - offsetPx
            break
          case 'left-bottom':
            top = triggerRect.bottom - contentH
            left = triggerRect.left - contentW - offsetPx
            break
          case 'right':
            top = triggerRect.top + triggerRect.height / 2 - contentH / 2
            left = triggerRect.right + offsetPx
            break
          case 'right-top':
            top = triggerRect.top
            left = triggerRect.right + offsetPx
            break
          case 'right-bottom':
            top = triggerRect.bottom - contentH
            left = triggerRect.right + offsetPx
            break
          default:
            top = triggerRect.bottom + offsetPx
            left = triggerRect.left
        }

        // 边界检测
        const padding = 16
        if (top < padding) top = padding
        if (left < padding) left = padding
        if (top + contentH > screenHeight - padding) {
          top = screenHeight - contentH - padding
        }
        if (left + contentW > screenWidth - padding) {
          left = screenWidth - contentW - padding
        }

        computedPosition.value = props.position
        popoverTop.value = top
        popoverLeft.value = left
      })
  })
  // #endif
}

// ==================== 显示/隐藏 ====================

const show = () => {
  if (props.isDisabled) return
  isVisible.value = true
  emit('onOpen')
  emit('update:show', true)
  updatePosition()
}

const hide = () => {
  isVisible.value = false
  emit('onClose')
  emit('update:show', false)
}

// ==================== 事件处理 ====================

const handleTriggerClick = () => {
  if (props.trigger === 'click') {
    if (isVisible.value) {
      hide()
    } else {
      show()
    }
  }
}

const handleMouseEnter = () => {
  // #ifdef H5
  if (props.trigger === 'hover') {
    show()
  }
  // #endif
}

const handleMouseLeave = () => {
  // #ifdef H5
  if (props.trigger === 'hover') {
    hide()
  }
  // #endif
}

const handleContentClick = () => {
  if (props.isCloseOnClickContent) {
    hide()
  }
}

const handleClose = () => {
  hide()
}

// 点击外部关闭
const handleClickOutside = (e: Event) => {
  if (!props.isCloseOnClickOutside) return
  const trigger = triggerRef.value
  const popover = popoverRef.value
  if (!trigger || !popover) return
  if (!trigger.contains(e.target as Node) && !popover.contains(e.target as Node)) {
    hide()
  }
}

// ==================== 监听 ====================

watch(
  () => props.show,
  (val) => {
    if (props.trigger === 'manual') {
      if (val) {
        show()
      } else {
        hide()
      }
    }
  }
)

// ==================== 生命周期 ====================

onMounted(() => {
  // #ifdef H5
  document.addEventListener('click', handleClickOutside)
  // #endif
})

onUnmounted(() => {
  // #ifdef H5
  document.removeEventListener('click', handleClickOutside)
  // #endif
})

// ==================== Expose ====================

defineExpose({
  show,
  hide,
  updatePosition
})
</script>

<style lang="scss" scoped>
.see-popover {
  display: inline-block;
  position: relative;

  &__mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1999;
    background-color: transparent;
  }

  &__content {
    position: fixed;
    z-index: 2000;
    background-color: var(--see-bg-color);
    border: 1px solid var(--see-border-four-color);
    border-radius: 12rpx;
    box-shadow: var(--see-shadow-large);
    overflow: hidden;

    &--animated {
      animation: see-popover-fade 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &__arrow {
    position: absolute;
    width: 12rpx;
    height: 12rpx;
    background-color: var(--see-bg-color);
    border: 1px solid var(--see-border-four-color);
    transform: rotate(45deg);

    &--top {
      bottom: -7rpx;
      left: 50%;
      margin-left: -6rpx;
      border-top: none;
      border-left: none;
    }

    &--top-left {
      bottom: -7rpx;
      left: 24rpx;
      border-top: none;
      border-left: none;
    }

    &--top-right {
      bottom: -7rpx;
      right: 24rpx;
      border-top: none;
      border-left: none;
    }

    &--bottom {
      top: -7rpx;
      left: 50%;
      margin-left: -6rpx;
      border-bottom: none;
      border-right: none;
    }

    &--bottom-left {
      top: -7rpx;
      left: 24rpx;
      border-bottom: none;
      border-right: none;
    }

    &--bottom-right {
      top: -7rpx;
      right: 24rpx;
      border-bottom: none;
      border-right: none;
    }

    &--left {
      right: -7rpx;
      top: 50%;
      margin-top: -6rpx;
      border-bottom: none;
      border-left: none;
    }

    &--left-top {
      right: -7rpx;
      top: 24rpx;
      border-bottom: none;
      border-left: none;
    }

    &--left-bottom {
      right: -7rpx;
      bottom: 24rpx;
      border-bottom: none;
      border-left: none;
    }

    &--right {
      left: -7rpx;
      top: 50%;
      margin-top: -6rpx;
      border-top: none;
      border-right: none;
    }

    &--right-top {
      left: -7rpx;
      top: 24rpx;
      border-top: none;
      border-right: none;
    }

    &--right-bottom {
      left: -7rpx;
      bottom: 24rpx;
      border-top: none;
      border-right: none;
    }
  }

  &__close {
    position: absolute;
    top: 12rpx;
    right: 12rpx;
    z-index: 1;
    padding: 4rpx;
  }

  &__close-icon {
    font-size: 28rpx;
    color: var(--see-tips-color);
    line-height: 1;
  }

  &__header {
    padding: 20rpx 24rpx 0;
  }

  &__title {
    font-size: 28rpx;
    font-weight: bold;
    color: var(--see-main-color);
  }

  &__body {
    padding: 24rpx;
  }

  &__footer {
    padding: 0 24rpx 20rpx;
    border-top: 1px solid var(--see-border-four-color);
    padding-top: 16rpx;
  }
}

@keyframes see-popover-fade {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
