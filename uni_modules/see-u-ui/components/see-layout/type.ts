/**
 * SeeLayout 组件属性
 */
export interface SeeLayoutProps {
  /**
   * Flex 方向
   * @default 'row'
   */
  direction?: 'row' | 'column'
  /**
   * Flex 换行
   * @default 'wrap'
   */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  /**
   * 主轴对齐
   * @default 'flex-start'
   */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  /**
   * 交叉轴对齐
   * @default 'flex-start'
   */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  /**
   * 栅格间距
   * @default 0
   */
  gap?: number | string
}

/**
 * SeeLayoutItem 组件属性
 */
export interface SeeLayoutItemProps {
  /**
   * 占据的列数（0-24，0 表示不固定宽度由内容撑开）
   * @default 24
   */
  span?: number
  /**
   * 左侧偏移列数
   * @default 0
   */
  offset?: number
  /**
   * 自定义 flex 比例
   */
  flex?: number
}
