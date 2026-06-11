/**
 * Tooltip 位置
 */
export type TooltipPosition =
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

/**
 * Tooltip 触发方式
 */
export type TooltipTrigger = 'hover' | 'click' | 'longpress' | 'manual'

/**
 * Tooltip 显示效果
 */
export type TooltipEffect = 'dark' | 'light'

/**
 * SeeTooltip 组件属性
 */
export interface SeeTooltipProps {
  /**
   * 提示文字
   * @default ''
   */
  content?: string
  /**
   * 提示位置
   * @default 'top'
   */
  position?: TooltipPosition
  /**
   * 触发方式
   * @default 'longpress'
   */
  trigger?: TooltipTrigger
  /**
   * 手动控制显示（trigger='manual' 时）
   * @default false
   */
  show?: boolean
  /**
   * 延迟显示时间(ms)
   * @default 200
   */
  delay?: number
  /**
   * 延迟隐藏时间(ms)
   * @default 200
   */
  hideDelay?: number
  /**
   * 最大宽度
   * @default '400rpx'
   */
  maxWidth?: string
  /**
   * 显示效果
   * @default 'dark'
   */
  effect?: TooltipEffect
  /**
   * 偏移距离(rpx)
   * @default 8
   */
  offset?: number
  /**
   * z-index
   * @default 2000
   */
  zIndex?: number
  /**
   * 是否禁用
   * @default false
   */
  isDisabled?: boolean
  /**
   * 是否显示箭头
   * @default true
   */
  isShowArrow?: boolean
  /**
   * 是否启用动画
   * @default true
   */
  isAnimated?: boolean
  /**
   * 动画时长(ms)
   * @default 200
   */
  duration?: number
}

/**
 * SeeTooltip 组件事件
 */
export interface SeeTooltipEmits {
  /** 显示时触发 */
  onOpen: () => void
  /** 隐藏时触发 */
  onClose: () => void
  /** v-model 更新（manual 模式） */
  'update:show': (value: boolean) => void
}
