/**
 * SeeCard 组件属性
 */
export interface SeeCardProps {
  /**
   * 卡片标题
   */
  title?: string
  /**
   * 副标题
   */
  subTitle?: string
  /**
   * 阴影大小
   * @default 'always'
   */
  shadow?: 'never' | 'always' | 'hover'
  /**
   * 卡片内边距
   * @default '30rpx'
   */
  padding?: string
  /**
   * 圆角大小
   * @default '16rpx'
   */
  radius?: string
  /**
   * 卡片外边距
   * @default '30rpx'
   */
  margin?: string
  /**
   * 是否显示边框
   * @default true
   */
  border?: boolean
  /**
   * 卡片宽度
   * @default '100%'
   */
  width?: string
}

/**
 * SeeCard 组件事件
 */
export interface SeeCardEmits {
  (e: 'onClick'): void
  (e: 'onHeaderClick'): void
}
