/**
 * SeeNavbarMini 迷你导航栏 Props
 */
export interface SeeNavbarMiniProps {
  /** 导航栏标题 */
  title?: string
  /** 是否显示返回按钮 */
  isShowBack?: boolean
  /** 自定义高度 */
  height?: string
  /** 自定义背景色 */
  bgColor?: string
}

/**
 * SeeNavbarMini 事件
 */
export interface SeeNavbarMiniEmits {
  /** 返回按钮点击 */
  (e: 'onBack'): void
}
