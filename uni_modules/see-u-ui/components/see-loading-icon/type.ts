/**
 * 加载动画类型
 */
export type LoadingIconType = 'spinner' | 'circular' | 'dots' | 'pulse'

/**
 * SeeLoadingIcon 组件属性
 */
export interface SeeLoadingIconProps {
  /**
   * 动画类型
   * @default 'spinner'
   */
  type?: LoadingIconType
  /**
   * 尺寸
   * @default '60rpx'
   */
  size?: string
  /**
   * 颜色
   * @default 'var(--see-primary)'
   */
  color?: string
  /**
   * 动画速度（秒）
   * @default 0.8
   */
  speed?: number
}
