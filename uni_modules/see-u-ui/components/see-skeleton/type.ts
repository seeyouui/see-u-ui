/**
 * SeeSkeleton 组件属性
 */
export interface SeeSkeletonProps {
  /**
   * 是否显示骨架屏（加载中）
   * @default true
   */
  loading?: boolean
  /**
   * 骨架屏行数
   * @default 3
   */
  rows?: number
  /**
   * 每行的宽度（单行统一宽度，或数组每行不同宽度）
   */
  rowWidth?: string | string[]
  /**
   * 行高
   * @default '32rpx'
   */
  rowHeight?: string
  /**
   * 行间距
   * @default '20rpx'
   */
  rowGap?: string
  /**
   * 是否显示头像占位
   * @default false
   */
  avatar?: boolean
  /**
   * 头像大小
   * @default '80rpx'
   */
  avatarSize?: string
  /**
   * 头像形状
   * @default 'circle'
   */
  avatarShape?: 'circle' | 'square'
  /**
   * 是否显示标题占位
   * @default false
   */
  title?: boolean
  /**
   * 是否启用骨架动画
   * @default true
   */
  isAnimate?: boolean
  /**
   * 骨架背景色
   * @default 'var(--see-info)'
   */
  skeletonBgColor?: string
  /**
   * 动画高亮色
   * @default 'var(--see-bg-color)'
   */
  highlightColor?: string
}
