/**
 * Toast 类型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'default'

/**
 * Toast 显示位置
 */
export type ToastPosition = 'center' | 'top' | 'bottom'

/**
 * SeeToast 组件属性
 */
export interface SeeToastProps {
  /**
   * 是否显示（v-model）
   * @default false
   */
  show?: boolean
  /**
   * 提示文字
   * @default ''
   */
  message?: string
  /**
   * 提示类型
   * @default 'default'
   */
  type?: ToastType
  /**
   * 自定义图标名称
   * @default ''
   */
  icon?: string
  /**
   * 显示时长(ms)，0 表示不自动关闭
   * @default 2000
   */
  duration?: number
  /**
   * 显示位置
   * @default 'center'
   */
  position?: ToastPosition
  /**
   * 是否显示遮罩
   * @default false
   */
  isOverlay?: boolean
  /**
   * z-index
   * @default 2000
   */
  zIndex?: number
  /**
   * 点击遮罩是否关闭
   * @default false
   */
  isCloseOnClickOverlay?: boolean
}

/**
 * SeeToast 组件事件
 */
export interface SeeToastEmits {
  /** Toast 关闭时触发 */
  onClose: () => void
  /** v-model 更新 */
  'update:show': (value: boolean) => void
}

/**
 * Toast 命令式选项
 */
export interface ToastOptions {
  /** 提示文字 */
  message?: string
  /** 提示类型 */
  type?: ToastType
  /** 自定义图标 */
  icon?: string
  /** 显示时长(ms) */
  duration?: number
  /** 显示位置 */
  position?: ToastPosition
  /** 是否显示遮罩 */
  isOverlay?: boolean
  /** 关闭回调 */
  onClose?: () => void
}
