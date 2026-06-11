/**
 * SwipeAction 操作按钮样式
 */
export type SwipeActionStyle = 'default' | 'danger' | 'success' | 'warning'

/**
 * SwipeAction 操作按钮
 */
export interface SwipeActionItem {
  /** 按钮文字 */
  text: string
  /** 按钮样式 */
  style?: SwipeActionStyle
  /** 背景色 */
  background?: string
  /** 文字颜色 */
  color?: string
  /** 按钮宽度 */
  width?: number
  /** 图标 */
  icon?: string
  /** 是否禁用 */
  isDisabled?: boolean
}

/**
 * SeeSwipeAction 组件属性
 */
export interface SeeSwipeActionProps {
  /**
   * 左侧操作按钮
   * @default []
   */
  leftActions?: SwipeActionItem[]
  /**
   * 右侧操作按钮
   * @default []
   */
  rightActions?: SwipeActionItem[]
  /**
   * 是否禁用滑动
   * @default false
   */
  isDisabled?: boolean
  /**
   * 滑动阈值（占按钮宽度的比例）
   * @default 0.3
   */
  threshold?: number
  /**
   * 滑动宽度（0=自动计算按钮总宽）
   * @default 0
   */
  swipeWidth?: number
  /**
   * 点击操作按钮后是否自动关闭
   * @default true
   */
  isCloseOnClick?: boolean
  /**
   * 触摸其他区域是否关闭
   * @default true
   */
  isCloseOnTouchOutside?: boolean
  /**
   * 标识符（用于 group 互斥）
   * @default ''
   */
  name?: string | number
  /**
   * 是否启用回弹动画
   * @default true
   */
  isAnimated?: boolean
}

/**
 * SeeSwipeAction 组件事件
 */
export interface SeeSwipeActionEmits {
  /** 点击操作按钮 */
  onClick: (action: SwipeActionItem, index: number, side: 'left' | 'right') => void
  /** 滑动打开时触发 */
  onOpen: (side: 'left' | 'right') => void
  /** 关闭时触发 */
  onClose: () => void
}
