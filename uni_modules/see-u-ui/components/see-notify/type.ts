/**
 * Notify 类型
 */
export type NotifyType = 'success' | 'error' | 'warning' | 'info'

/**
 * SeeNotify 组件属性
 */
export interface SeeNotifyProps {
  /**
   * 是否显示
   * @default false
   */
  show?: boolean
  /**
   * 通知文字
   * @default ''
   */
  message?: string
  /**
   * 通知类型
   * @default 'info'
   */
  type?: NotifyType
  /**
   * 显示时长(ms)
   * @default 3000
   */
  duration?: number
  /**
   * 自定义图标
   * @default ''
   */
  icon?: string
  /**
   * 自定义文字色
   * @default ''
   */
  color?: string
  /**
   * 自定义背景色
   * @default ''
   */
  background?: string
  /**
   * 是否可手动关闭
   * @default false
   */
  isClosable?: boolean
  /**
   * z-index
   * @default 2000
   */
  zIndex?: number
  /**
   * 是否适配安全区
   * @default true
   */
  isSafeArea?: boolean
}

/**
 * SeeNotify 组件事件
 */
export interface SeeNotifyEmits {
  /** 点击通知时触发 */
  onClick: () => void
  /** 关闭时触发 */
  onClose: () => void
  /** v-model 更新 */
  'update:show': (value: boolean) => void
}

/**
 * Notify 命令式选项
 */
export interface NotifyOptions {
  /** 通知文字 */
  message?: string
  /** 通知类型 */
  type?: NotifyType
  /** 显示时长 */
  duration?: number
  /** 自定义图标 */
  icon?: string
  /** 自定义文字色 */
  color?: string
  /** 自定义背景色 */
  background?: string
  /** 是否可手动关闭 */
  isClosable?: boolean
  /** 点击回调 */
  onClick?: () => void
  /** 关闭回调 */
  onClose?: () => void
}
