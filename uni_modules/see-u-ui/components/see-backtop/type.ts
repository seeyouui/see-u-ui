/**
 * SeeBackTop Props
 */
export interface SeeBackTopProps {
  /** 显示阈值（px），滚动超过此值显示按钮 */
  visibilityHeight?: number
  /** 距离右边的距离（px） */
  right?: number
  /** 距离底部的距离（px） */
  bottom?: number
  /** 层级 */
  zIndex?: number
  /** 滚动动画时长（ms） */
  duration?: number
  /** 指定滚动容器选择器 */
  target?: string
  /** 是否使用自定义插槽 */
  isCustom?: boolean
}

/**
 * SeeBackTop 事件
 */
export interface SeeBackTopEmits {
  /** 点击事件 */
  (e: 'onClick'): void
}
