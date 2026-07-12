import { ref, onUnmounted, type Ref } from 'vue'

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'
export type GestureDirection = 'horizontal' | 'vertical' | 'both'

export interface UseGestureOptions {
  /** 滑动方向，默认 'both' */
  direction?: GestureDirection
  /** 滑动阈值(px)，超过此值才算滑动，默认 10 */
  threshold?: number
  /** 长按延迟(ms)，默认 350 */
  longPressDelay?: number
  /** 滑动回调 */
  onSwipe?: (direction: SwipeDirection, distance: number) => void
  /** 滑动开始回调 */
  onSwipeStart?: () => void
  /** 滑动结束回调 */
  onSwipeEnd?: (direction: SwipeDirection, distance: number) => void
  /** 长按回调 */
  onLongPress?: () => void
  /** 长按结束回调 */
  onLongPressEnd?: () => void
}

interface TouchPoint {
  x: number
  y: number
  time: number
}

/**
 * 手势操作 Hook
 * @description 封装 touch 事件，支持滑动和长按检测
 * @param elementRef 目标元素的 ref
 * @param options 配置选项
 * @returns 返回手势状态和事件处理器
 */
export function useGesture(elementRef: Ref<HTMLElement | null>, options: UseGestureOptions = {}) {
  const { direction = 'both', threshold = 10, longPressDelay = 350, onSwipe, onSwipeStart, onSwipeEnd, onLongPress, onLongPressEnd } = options

  /** 是否正在滑动 */
  const isSwiping = ref(false)
  /** 滑动距离 */
  const swipeDistance = ref(0)
  /** 是否正在长按 */
  const isLongPressing = ref(false)

  let startPoint: TouchPoint | null = null
  let longPressTimer: ReturnType<typeof setTimeout> | null = null
  let isGestureActive = false

  const cleanup = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
  }

  /**
   * 计算滑动方向
   */
  const getSwipeDirection = (deltaX: number, deltaY: number): SwipeDirection => {
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left'
    } else {
      return deltaY > 0 ? 'down' : 'up'
    }
  }

  /**
   * 检查滑动方向是否符合配置
   */
  const isDirectionValid = (swipeDir: SwipeDirection): boolean => {
    if (direction === 'both') return true
    if (direction === 'horizontal') return swipeDir === 'left' || swipeDir === 'right'
    if (direction === 'vertical') return swipeDir === 'up' || swipeDir === 'down'
    return true
  }

  /**
   * touchstart 处理器
   */
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    startPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
    isGestureActive = false
    isSwiping.value = false
    swipeDistance.value = 0

    // 开始长按计时
    cleanup()
    longPressTimer = setTimeout(() => {
      if (startPoint && !isGestureActive) {
        isLongPressing.value = true
        onLongPress?.()
      }
    }, longPressDelay)
  }

  /**
   * touchmove 处理器
   */
  const handleTouchMove = (e: TouchEvent) => {
    if (!startPoint) return

    const touch = e.touches[0]
    if (!touch) return
    const deltaX = touch.clientX - startPoint.x
    const deltaY = touch.clientY - startPoint.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // 如果移动超过阈值，取消长按
    if (absX > threshold || absY > threshold) {
      cleanup()
      if (isLongPressing.value) {
        isLongPressing.value = false
        onLongPressEnd?.()
      }
    }

    // 检查是否符合滑动方向
    const swipeDir = getSwipeDirection(deltaX, deltaY)
    if (!isDirectionValid(swipeDir)) return

    // 超过阈值开始滑动
    if (absX > threshold || absY > threshold) {
      if (!isGestureActive) {
        isGestureActive = true
        isSwiping.value = true
        onSwipeStart?.()
      }

      swipeDistance.value = direction === 'horizontal' ? absX : direction === 'vertical' ? absY : Math.max(absX, absY)
    }
  }

  /**
   * touchend 处理器
   */
  const handleTouchEnd = (e: TouchEvent) => {
    if (!startPoint) return

    cleanup()

    // 结束长按
    if (isLongPressing.value) {
      isLongPressing.value = false
      onLongPressEnd?.()
    }

    // 结束滑动
    if (isGestureActive) {
      const touch = e.changedTouches[0]
      if (touch) {
        const deltaX = touch.clientX - startPoint.x
        const deltaY = touch.clientY - startPoint.y
        const swipeDir = getSwipeDirection(deltaX, deltaY)
        const distance =
          direction === 'horizontal' ? Math.abs(deltaX) : direction === 'vertical' ? Math.abs(deltaY) : Math.max(Math.abs(deltaX), Math.abs(deltaY))

        if (distance > threshold) {
          onSwipe?.(swipeDir, distance)
          onSwipeEnd?.(swipeDir, distance)
        }
      }

      isSwiping.value = false
      swipeDistance.value = 0
      isGestureActive = false
    }

    startPoint = null
  }

  /**
   * 重置手势状态
   */
  const reset = () => {
    cleanup()
    isSwiping.value = false
    swipeDistance.value = 0
    isLongPressing.value = false
    isGestureActive = false
    startPoint = null
  }

  // 记录已绑定事件的元素（防止 ref 变化后无法解绑）
  let boundElement: HTMLElement | null = null

  // 绑定事件到目标元素
  // 说明：本 Hook 基于 DOM addEventListener，仅 H5 端有效。
  // 非 H5 端（小程序/App）elementRef 并非 HTMLElement，绑定会静默失效，
  // 故用条件编译包裹，非 H5 端安全跳过（不崩溃）。
  const bindEvents = () => {
    // #ifdef H5
    const el = elementRef.value
    if (!el) return

    // 先解绑旧元素
    unbindEvents()

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    boundElement = el
    // #endif
  }

  // 解绑事件
  const unbindEvents = () => {
    // #ifdef H5
    const el = boundElement
    if (!el) return

    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchmove', handleTouchMove)
    el.removeEventListener('touchend', handleTouchEnd)
    el.removeEventListener('touchcancel', handleTouchEnd)
    boundElement = null
    // #endif
  }

  // 组件销毁时清理
  onUnmounted(() => {
    unbindEvents()
    reset()
  })

  return {
    isSwiping,
    swipeDistance,
    isLongPressing,
    bindEvents,
    unbindEvents,
    reset
  }
}
