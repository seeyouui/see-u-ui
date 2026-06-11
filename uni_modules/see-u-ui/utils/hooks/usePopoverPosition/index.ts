import { ref, computed, watch, type Ref, type CSSProperties, type MaybeRef } from 'vue'

export type PopoverPosition =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom'

export interface Rect {
  top: number
  left: number
  width: number
  height: number
  bottom: number
  right: number
}

export interface UsePopoverPositionOptions {
  /** 触发器元素的 ref */
  triggerRef: Ref<HTMLElement | null>
  /** 弹出层元素的 ref */
  popoverRef: Ref<HTMLElement | null>
  /** 弹出位置 */
  position: MaybeRef<PopoverPosition>
  /** 偏移距离(rpx)，默认 12 */
  offset?: MaybeRef<number>
  /** 箭头尺寸(rpx)，默认 10 */
  arrowSize?: MaybeRef<number>
}

/** 屏幕边距 */
const SCREEN_PADDING = 16

/**
 * rpx 转 px
 */
function rpxToPx(rpx: number): number {
  let screenWidth = 375
  // #ifdef H5
  screenWidth = window.innerWidth || 375
  // #endif
  // #ifndef H5
  const systemInfo = uni.getSystemInfoSync()
  screenWidth = systemInfo.windowWidth
  // #endif
  return (rpx / 750) * screenWidth
}

/**
 * 获取元素相对于视口的位置
 */
function getElementRect(el: HTMLElement): Rect {
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right
  }
}

/**
 * 气泡定位计算 Hook
 * @description 支持 12 个方向定位，自动边界检测和方向翻转
 * @param options 配置选项
 * @returns 返回计算后的位置、样式和更新方法
 */
export function usePopoverPosition(options: UsePopoverPositionOptions) {
  const { triggerRef, popoverRef, position, offset = 12, arrowSize = 10 } = options

  /** 实际计算后的位置（可能因边界翻转） */
  const computedPosition = ref<PopoverPosition>(typeof position === 'string' ? position : position.value)

  /** 触发器元素位置 */
  const triggerRect = ref<Rect>({ top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 })

  /** 弹出层元素位置 */
  const popoverRect = ref<Rect>({ top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 })

  /**
   * 更新元素位置信息
   */
  const updateRects = () => {
    const trigger = triggerRef.value
    const popover = popoverRef.value

    if (trigger) {
      triggerRect.value = getElementRect(trigger)
    }
    if (popover) {
      popoverRect.value = getElementRect(popover)
    }
  }

  /**
   * 检查位置是否超出屏幕边界
   */
  const isOutOfBounds = (top: number, left: number, width: number, height: number): boolean => {
    let screenWidth = 375
    let screenHeight = 667
    // #ifdef H5
    screenWidth = window.innerWidth
    screenHeight = window.innerHeight
    // #endif
    // #ifndef H5
    const systemInfo = uni.getSystemInfoSync()
    screenWidth = systemInfo.windowWidth
    screenHeight = systemInfo.windowHeight
    // #endif

    return (
      top < SCREEN_PADDING || left < SCREEN_PADDING || top + height > screenHeight - SCREEN_PADDING || left + width > screenWidth - SCREEN_PADDING
    )
  }

  /**
   * 根据位置计算弹出层坐标
   */
  const calculatePosition = (
    pos: PopoverPosition,
    trigger: Rect,
    popoverW: number,
    popoverH: number,
    offsetPx: number
  ): { top: number; left: number } => {
    let top = 0
    let left = 0

    switch (pos) {
      case 'top':
        top = trigger.top - popoverH - offsetPx
        left = trigger.left + trigger.width / 2 - popoverW / 2
        break
      case 'top-left':
        top = trigger.top - popoverH - offsetPx
        left = trigger.left
        break
      case 'top-right':
        top = trigger.top - popoverH - offsetPx
        left = trigger.right - popoverW
        break
      case 'bottom':
        top = trigger.bottom + offsetPx
        left = trigger.left + trigger.width / 2 - popoverW / 2
        break
      case 'bottom-left':
        top = trigger.bottom + offsetPx
        left = trigger.left
        break
      case 'bottom-right':
        top = trigger.bottom + offsetPx
        left = trigger.right - popoverW
        break
      case 'left':
        top = trigger.top + trigger.height / 2 - popoverH / 2
        left = trigger.left - popoverW - offsetPx
        break
      case 'left-top':
        top = trigger.top
        left = trigger.left - popoverW - offsetPx
        break
      case 'left-bottom':
        top = trigger.bottom - popoverH
        left = trigger.left - popoverW - offsetPx
        break
      case 'right':
        top = trigger.top + trigger.height / 2 - popoverH / 2
        left = trigger.right + offsetPx
        break
      case 'right-top':
        top = trigger.top
        left = trigger.right + offsetPx
        break
      case 'right-bottom':
        top = trigger.bottom - popoverH
        left = trigger.right + offsetPx
        break
    }

    return { top, left }
  }

  /**
   * 获取翻转后的位置
   */
  const getFlippedPosition = (pos: PopoverPosition): PopoverPosition => {
    const flipMap: Record<PopoverPosition, PopoverPosition> = {
      top: 'bottom',
      'top-left': 'bottom-left',
      'top-right': 'bottom-right',
      bottom: 'top',
      'bottom-left': 'top-left',
      'bottom-right': 'top-right',
      left: 'right',
      'left-top': 'right-top',
      'left-bottom': 'right-bottom',
      right: 'left',
      'right-top': 'left-top',
      'right-bottom': 'left-bottom'
    }
    return flipMap[pos] || pos
  }

  /**
   * 计算箭头位置
   */
  const calculateArrowStyle = (pos: PopoverPosition, trigger: Rect, popoverW: number, popoverH: number): CSSProperties => {
    const arrowSizePx = rpxToPx(typeof arrowSize === 'number' ? arrowSize : arrowSize.value)
    const style: CSSProperties = {
      position: 'absolute',
      width: `${arrowSizePx}px`,
      height: `${arrowSizePx}px`,
      transform: 'rotate(45deg)'
    }

    switch (pos) {
      case 'top':
      case 'top-left':
      case 'top-right':
        style.bottom = `-${arrowSizePx / 2}px`
        if (pos === 'top') style.left = `${popoverW / 2 - arrowSizePx / 2}px`
        else if (pos === 'top-left') style.left = `${trigger.width / 2 - arrowSizePx / 2}px`
        else style.right = `${trigger.width / 2 - arrowSizePx / 2}px`
        break
      case 'bottom':
      case 'bottom-left':
      case 'bottom-right':
        style.top = `-${arrowSizePx / 2}px`
        if (pos === 'bottom') style.left = `${popoverW / 2 - arrowSizePx / 2}px`
        else if (pos === 'bottom-left') style.left = `${trigger.width / 2 - arrowSizePx / 2}px`
        else style.right = `${trigger.width / 2 - arrowSizePx / 2}px`
        break
      case 'left':
      case 'left-top':
      case 'left-bottom':
        style.right = `-${arrowSizePx / 2}px`
        if (pos === 'left') style.top = `${popoverH / 2 - arrowSizePx / 2}px`
        else if (pos === 'left-top') style.top = `${trigger.height / 2 - arrowSizePx / 2}px`
        else style.bottom = `${trigger.height / 2 - arrowSizePx / 2}px`
        break
      case 'right':
      case 'right-top':
      case 'right-bottom':
        style.left = `-${arrowSizePx / 2}px`
        if (pos === 'right') style.top = `${popoverH / 2 - arrowSizePx / 2}px`
        else if (pos === 'right-top') style.top = `${trigger.height / 2 - arrowSizePx / 2}px`
        else style.bottom = `${trigger.height / 2 - arrowSizePx / 2}px`
        break
    }

    return style
  }

  /**
   * 更新弹出层位置
   */
  const updatePosition = () => {
    updateRects()

    const trigger = triggerRect.value
    const popover = popoverRef.value
    if (!popover) return

    const popoverW = popover.offsetWidth
    const popoverH = popover.offsetHeight
    const offsetPx = rpxToPx(typeof offset === 'number' ? offset : offset.value)

    let pos = typeof position === 'string' ? position : position.value

    // 计算位置
    let coords = calculatePosition(pos, trigger, popoverW, popoverH, offsetPx)

    // 边界检测 + 自动翻转
    if (isOutOfBounds(coords.top, coords.left, popoverW, popoverH)) {
      const flippedPos = getFlippedPosition(pos)
      const flippedCoords = calculatePosition(flippedPos, trigger, popoverW, popoverH, offsetPx)

      if (!isOutOfBounds(flippedCoords.top, flippedCoords.left, popoverW, popoverH)) {
        pos = flippedPos
        coords = flippedCoords
      }
    }

    computedPosition.value = pos

    // 应用位置
    popover.style.top = `${coords.top}px`
    popover.style.left = `${coords.left}px`
  }

  /**
   * 弹出层样式
   */
  const popoverStyle = computed<CSSProperties>(() => ({
    position: 'fixed',
    zIndex: 2000
  }))

  /**
   * 箭头样式
   */
  const arrowStyle = computed<CSSProperties>(() => {
    const trigger = triggerRect.value
    const popover = popoverRef.value
    if (!popover) return {}
    return calculateArrowStyle(computedPosition.value, trigger, popover.offsetWidth, popover.offsetHeight)
  })

  // 监听位置变化
  watch(
    () => (typeof position === 'string' ? position : position.value),
    (newPos) => {
      computedPosition.value = newPos
    }
  )

  return {
    computedPosition,
    popoverStyle,
    arrowStyle,
    updatePosition,
    triggerRect
  }
}
