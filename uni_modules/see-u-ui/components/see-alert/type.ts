/**
 * Alert 类型
 */
export type AlertType = 'success' | 'error' | 'warning' | 'info'

/**
 * Alert 显示效果
 */
export type AlertEffect = 'light' | 'dark' | 'border'

/**
 * SeeAlert 组件属性
 */
export interface SeeAlertProps {
  /**
   * 提示类型
   * @default 'info'
   */
  type?: AlertType
  /**
   * 标题
   * @default ''
   */
  title?: string
  /**
   * 内容文字
   * @default ''
   */
  content?: string
  /**
   * 显示效果
   * @default 'light'
   */
  effect?: AlertEffect
  /**
   * 是否可关闭
   * @default false
   */
  isClosable?: boolean
  /**
   * 是否显示图标
   * @default true
   */
  isShowIcon?: boolean
  /**
   * 自定义图标（覆盖类型图标）
   * @default ''
   */
  icon?: string
  /**
   * 是否可折叠（长内容时）
   * @default false
   */
  isCollapsible?: boolean
  /**
   * 默认是否折叠
   * @default false
   */
  isCollapsed?: boolean
  /**
   * 操作文字
   * @default ''
   */
  actionText?: string
  /**
   * 文字是否居中
   * @default false
   */
  isCenter?: boolean
  /**
   * 是否显示（v-model）
   * @default true
   */
  isShow?: boolean
  /**
   * 是否启用动画
   * @default true
   */
  isAnimated?: boolean
}

/**
 * SeeAlert 组件事件
 */
export interface SeeAlertEmits {
  /** 关闭时触发 */
  onClose: (event: Event) => void
  /** 点击操作文字时触发 */
  onAction: (event: Event) => void
  /** v-model 更新 */
  'update:isShow': (value: boolean) => void
  /** 折叠状态更新 */
  'update:isCollapsed': (value: boolean) => void
}
