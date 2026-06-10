import type { LoadingIconType } from '../see-loading-icon/type'

/**
 * SeeLoadingPage 组件属性
 */
export interface SeeLoadingPageProps {
  /**
   * 是否正在加载
   * @default true
   */
  loading?: boolean
  /**
   * 加载提示文字
   * @default '加载中...'
   */
  message?: string
  /**
   * 加载图标类型
   * @default 'spinner'
   */
  iconType?: LoadingIconType
  /**
   * 加载图标大小
   * @default '80rpx'
   */
  iconSize?: string
  /**
   * 是否全屏显示
   * @default false
   */
  isFullscreen?: boolean
  /**
   * 背景色
   */
  background?: string
  /**
   * z-index
   * @default 999
   */
  zIndex?: number
}
