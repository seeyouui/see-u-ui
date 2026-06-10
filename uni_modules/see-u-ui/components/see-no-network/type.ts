/**
 * SeeNoNetwork 组件属性
 */
export interface SeeNoNetworkProps {
  /**
   * 是否显示（v-model，如果提供则手动控制）
   * @default false
   */
  show?: boolean
  /**
   * 提示文案
   * @default '网络异常，请检查网络连接'
   */
  text?: string
  /**
   * 重试按钮文案
   * @default '重新连接'
   */
  retryText?: string
  /**
   * 是否全屏显示
   * @default false
   */
  isFullscreen?: boolean
  /**
   * 图标名称
   */
  icon?: string
  /**
   * 是否自动监听网络状态
   * @default true
   */
  autoCheck?: boolean
  /**
   * 重试间隔（毫秒），0 表示不自动重试
   * @default 0
   */
  retryInterval?: number
}

/**
 * SeeNoNetwork 组件事件
 */
export interface SeeNoNetworkEmits {
  onRetry: () => void
  onNetworkChange: (online: boolean) => void
  'update:show': (value: boolean) => void
}
