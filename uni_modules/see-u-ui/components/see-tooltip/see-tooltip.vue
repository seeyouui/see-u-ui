<template>
  <view
    ref="triggerRef"
    class="see-tooltip"
    @click="handleTriggerClick"
    @longpress="handleLongPress"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 触发器插槽 -->
    <slot />

    <!-- 提示内容 -->
    <view v-show="isVisible" ref="popoverRef" class="see-tooltip__content" :class="contentClasses" :style="contentStyle">
      <!-- 箭头 -->
      <view v-if="isShowArrow" class="see-tooltip__arrow" :class="arrowClasses" :style="arrowStyle" />
      <!-- 内容 -->
      <view class="see-tooltip__inner">
        <slot name="content">
          <text class="see-tooltip__text">{{ content }}</text>
        </slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeTooltip 长按提示
 * @description 长按或悬停时显示的文字提示气泡
 * @tutorial https://www.seeuui.cn/components/tooltip/
 * @property {String} content 提示文字
 * @property {String} position 提示位置
 * @property {String} trigger 触发方式
 * @property {Boolean} show 手动控制显示
 * @property {Number} delay 延迟显示时间
 * @property {Number} hideDelay 延迟隐藏时间
 * @property {String} maxWidth 最大宽度
 * @property {String} effect 显示效果
 * @property {Number} offset 偏移距离
 * @property {Number} zIndex z-index
 * @property {Boolean} isDisabled 是否禁用
 * @property {Boolean} isShowArrow 是否显示箭头
 * @property {Boolean} isAnimated 是否启用动画
 * @property {Number} duration 动画时长
 * @event {Function} onOpen 显示时触发
 * @event {Function} onClose 隐藏时触发
 */
import { ref, computed, watch, onUnmounted, nextTick, getCurrentInstance, type CSSProperties } from 'vue'
import type { SeeTooltipProps, SeeTooltipEmits, TooltipPosition } from './type'

defineOptions({ name: 'SeeTooltip' })

const instance = getCurrentInstance()

const props = withDefaults(defineProps<SeeTooltipProps>(), {
  content: '',
  position: 'top',
  trigger: 'longpress',
  show: false,
  delay: 200,
  hideDelay: 200,
  maxWidth: '400rpx',
  effect: 'dark',
  offset: 8,
  zIndex: 2000,
  isDisabled: false,
  isShowArrow: true,
  isAnimated: true,
  duration: 200
})

const emit = defineEmits<SeeTooltipEmits>()

// ==================== 状态管理 ====================

const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const isVisible = ref(props.trigger === 'manual' ? props.show : false)
const computedPosition = ref<TooltipPosition>(props.position)
const tooltipTop = ref<number | null>(null)
const tooltipLeft = ref<number | null>(null)

let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

// ==================== 计算属性 ====================

const contentClasses = computed(() => [
  `see-tooltip__content--${computedPosition.value}`,
  `see-tooltip__content--${props.effect}`,
  {
    'see-tooltip__content--animated': props.isAnimated
  }
])

const contentStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    maxWidth: props.maxWidth,
    zIndex: props.zIndex,
    position: 'fixed'
  }
  if (tooltipTop.value !== null) {
    style.top = `${tooltipTop.value}px`
  }
  if (tooltipLeft.value !== null) {
    style.left = `${tooltipLeft.value}px`
  }
  return style
})

const arrowClasses = computed(() => [`see-tooltip__arrow--${computedPosition.value}`, `see-tooltip__arrow--${props.effect}`])

const arrowStyle = computed<CSSProperties>(() => ({}))

// ==================== 定时器管理 ====================

const clearTimers = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

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
      .select('.see-tooltip')
      .boundingClientRect()
      .select('.see-tooltip__content')
      .boundingClientRect()
      .exec((rects) => {
        const triggerRect = rects?.[0]
        const popoverRect = rects?.[1]
        if (!triggerRect) return
        const systemInfo = uni.getSystemInfoSync()
        const offsetPx = (props.offset / 750) * systemInfo.windowWidth
        const screenWidth = systemInfo.windowWidth
        const screenHeight = systemInfo.windowHeight
        const popoverW = popoverRect?.width || 200
        const popoverH = popoverRect?.height || 60

        let top = 0
        let left = 0

        switch (props.position) {
          case 'top':
            top = triggerRect.top - popoverH - offsetPx
            left = triggerRect.left + triggerRect.width / 2 - popoverW / 2
            break
          case 'top-left':
            top = triggerRect.top - popoverH - offsetPx
            left = triggerRect.left
            break
          case 'top-right':
            top = triggerRect.top - popoverH - offsetPx
            left = triggerRect.right - popoverW
            break
          case 'bottom':
            top = triggerRect.bottom + offsetPx
            left = triggerRect.left + triggerRect.width / 2 - popoverW / 2
            break
          case 'bottom-left':
            top = triggerRect.bottom + offsetPx
            left = triggerRect.left
            break
          case 'bottom-right':
            top = triggerRect.bottom + offsetPx
            left = triggerRect.right - popoverW
            break
          case 'left':
            top = triggerRect.top + triggerRect.height / 2 - popoverH / 2
            left = triggerRect.left - popoverW - offsetPx
            break
          case 'left-top':
            top = triggerRect.top
            left = triggerRect.left - popoverW - offsetPx
            break
          case 'left-bottom':
            top = triggerRect.bottom - popoverH
            left = triggerRect.left - popoverW - offsetPx
            break
          case 'right':
            top = triggerRect.top + triggerRect.height / 2 - popoverH / 2
            left = triggerRect.right + offsetPx
            break
          case 'right-top':
            top = triggerRect.top
            left = triggerRect.right + offsetPx
            break
          case 'right-bottom':
            top = triggerRect.bottom - popoverH
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
        if (top + popoverH > screenHeight - padding) {
          top = screenHeight - popoverH - padding
        }
        if (left + popoverW > screenWidth - padding) {
          left = screenWidth - popoverW - padding
        }

        computedPosition.value = props.position

        // 通过响应式状态更新位置
        tooltipTop.value = top
        tooltipLeft.value = left
      })
  })
  // #endif
}

// ==================== 显示/隐藏 ====================

const show = () => {
  if (props.isDisabled) return
  clearTimers()
  showTimer = setTimeout(() => {
    isVisible.value = true
    emit('onOpen')
    emit('update:show', true)
    updatePosition()
  }, props.delay)
}

const hide = () => {
  clearTimers()
  hideTimer = setTimeout(() => {
    isVisible.value = false
    emit('onClose')
    emit('update:show', false)
  }, props.hideDelay)
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

const handleLongPress = () => {
  if (props.trigger === 'longpress') {
    show()
  }
}

const handleTouchStart = () => {
  // 长按触发在 longpress 事件中处理
}

const handleTouchEnd = () => {
  if (props.trigger === 'longpress' && isVisible.value) {
    hide()
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

onUnmounted(() => {
  clearTimers()
})

// ==================== Expose ====================

defineExpose({
  show,
  hide,
  updatePosition
})
</script>

<style lang="scss" scoped>
.see-tooltip {
  display: inline-block;
  position: relative;

  &__content {
    position: fixed;
    z-index: 2000;
    pointer-events: auto;

    &--animated {
      animation: see-tooltip-fade 200ms ease;
    }

    &--dark {
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 8rpx;
      padding: 12rpx 20rpx;
    }

    &--light {
      background-color: var(--see-bg-color);
      border: 1px solid var(--see-border-four-color);
      border-radius: 8rpx;
      padding: 12rpx 20rpx;
      box-shadow: var(--see-shadow-medium);
    }
  }

  &__inner {
    position: relative;
    z-index: 1;
  }

  &__text {
    font-size: 24rpx;
    line-height: 1.4;
    word-break: break-all;

    .see-tooltip__content--dark & {
      color: #ffffff;
    }

    .see-tooltip__content--light & {
      color: var(--see-main-color);
    }
  }

  &__arrow {
    position: absolute;
    width: 10rpx;
    height: 10rpx;
    transform: rotate(45deg);

    &--dark {
      background-color: rgba(0, 0, 0, 0.8);
    }

    &--light {
      background-color: var(--see-bg-color);
      border: 1px solid var(--see-border-four-color);
    }

    // 箭头位置
    &--top {
      bottom: -5rpx;
      left: 50%;
      margin-left: -5rpx;
    }

    &--top-left {
      bottom: -5rpx;
      left: 20rpx;
    }

    &--top-right {
      bottom: -5rpx;
      right: 20rpx;
    }

    &--bottom {
      top: -5rpx;
      left: 50%;
      margin-left: -5rpx;
    }

    &--bottom-left {
      top: -5rpx;
      left: 20rpx;
    }

    &--bottom-right {
      top: -5rpx;
      right: 20rpx;
    }

    &--left {
      right: -5rpx;
      top: 50%;
      margin-top: -5rpx;
    }

    &--left-top {
      right: -5rpx;
      top: 20rpx;
    }

    &--left-bottom {
      right: -5rpx;
      bottom: 20rpx;
    }

    &--right {
      left: -5rpx;
      top: 50%;
      margin-top: -5rpx;
    }

    &--right-top {
      left: -5rpx;
      top: 20rpx;
    }

    &--right-bottom {
      left: -5rpx;
      bottom: 20rpx;
    }
  }
}

@keyframes see-tooltip-fade {
  from {
    opacity: 0;
    transform: translateY(4rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
