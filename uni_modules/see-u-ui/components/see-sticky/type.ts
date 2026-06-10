/**
 * SeeSticky 组件属性
 */
export interface SeeStickyProps {
  /**
   * 吸顶时距离顶部的距离（单位 px）
   * @default 0
   */
  offsetTop?: number
  /**
   * z-index
   * @default 99
   */
  zIndex?: number
  /**
   * 是否开启吸顶
   * @default true
   */
  isEnabled?: boolean
  /**
   * 容器选择器（指定容器边界）
   */
  container?: string
}

/**
 * SeeSticky 组件事件
 */
export interface SeeStickyEmits {
  (e: 'onScroll', data: { isFixed: boolean; scrollTop: number }): void
}
