/**
 * SeeSkeletonGlobal 组件属性
 */
export interface SeeSkeletonGlobalProps {
  /**
   * 骨架屏行数
   * @default 5
   */
  rows?: number
  /**
   * 是否启用骨架动画
   * @default true
   */
  animate?: boolean
  /**
   * 骨架背景色
   * @default 'var(--see-skeleton-bg, #f0f0f0)'
   */
  bgColor?: string
  /**
   * 高亮色
   * @default 'var(--see-skeleton-highlight, #e0e0e0)'
   */
  highlightColor?: string
}
