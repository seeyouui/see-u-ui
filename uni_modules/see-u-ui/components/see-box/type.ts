/**
 * SeeBox 组件属性
 */
export interface SeeBoxProps {
  /**
   * 内边距，支持 CSS padding 值
   * @default '0'
   */
  padding?: string
  /**
   * 外边距，支持 CSS margin 值
   * @default '0'
   */
  margin?: string
  /**
   * 背景色，支持 CSS 颜色值
   */
  bgColor?: string
  /**
   * 宽度，支持 CSS 宽度值
   * @default '100%'
   */
  width?: string
  /**
   * 高度，支持 CSS 高度值
   */
  height?: string
  /**
   * 圆角大小
   * @default '0'
   */
  radius?: string
  /**
   * 阴影大小：small / medium / large
   */
  shadow?: 'small' | 'medium' | 'large'
  /**
   * 边框宽度
   * @default '0'
   */
  border?: string
  /**
   * 边框颜色
   */
  borderColor?: string
  /**
   * Flex 方向
   */
  direction?: 'row' | 'column'
  /**
   * Flex 换行
   */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  /**
   * Flex justify-content
   */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  /**
   * Flex align-items
   */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  /**
   * Flex 子项间距
   */
  gap?: string
}
