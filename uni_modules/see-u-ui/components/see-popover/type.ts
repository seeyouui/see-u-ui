/**
 * Popover 位置
 */
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

/**
 * Popover 触发方式
 */
export type PopoverTrigger = 'click' | 'hover' | 'manual'

/**
 * SeePopover 组件属性
 */
export interface SeePopoverProps {
  /**
   * 是否显示（v-model）
   * @default false
   */
  show?: boolean
  /**
   * 弹出位置
   * @default 'bottom'
   */
  position?: PopoverPosition
  /**
   * 触发方式
   * @default 'click'
   */
  trigger?: PopoverTrigger
  /**
   * 标题
   * @default ''
   */
  title?: string
  /**
   * 弹出宽度
   * @default 'auto'
   */
  width?: string
  /**
   * 最大宽度
   * @default '500rpx'
   */
  maxWidth?: string
  /**
   * 偏移距离(rpx)
   * @default 12
   */
  offset?: number
  /**
   * z-index
   * @default 2000
   */
  zIndex?: number
  /**
   * 是否显示箭头
   * @default true
   */
  isShowArrow?: boolean
  /**
   * 是否显示关闭按钮
   * @default false
   */
  isShowCloseBtn?: boolean
  /**
   * 点击外部是否关闭
   * @default true
   */
  isCloseOnClickOutside?: boolean
  /**
   * 点击内容是否关闭
   * @default false
   */
  isCloseOnClickContent?: boolean
  /**
   * 是否禁用
   * @default false
   */
  isDisabled?: boolean
  /**
   * 是否启用动画
   * @default true
   */
  isAnimated?: boolean
  /**
   * 动画时长(ms)
   * @default 250
   */
  duration?: number
}

/**
 * SeePopover 组件事件
 */
export interface SeePopoverEmits {
  /** 显示时触发 */
  onOpen: () => void
  /** 隐藏时触发 */
  onClose: () => void
  /** v-model 更新 */
  'update:show': (value: boolean) => void
}
