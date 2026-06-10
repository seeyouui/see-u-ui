/**
 * SeeScrollList 组件属性
 */
export interface SeeScrollListProps {
  /**
   * 数据列表
   */
  list?: unknown[]
  /**
   * 是否允许横向滚动
   * @default true
   */
  scrollX?: boolean
  /**
   * 是否允许纵向滚动
   * @default false
   */
  scrollY?: boolean
  /**
   * 是否显示滚动条
   * @default false
   */
  showScrollbar?: boolean
  /**
   * 是否启用滚动动画
   * @default true
   */
  isAnimated?: boolean
  /**
   * 左侧间距
   * @default '30rpx'
   */
  paddingLeft?: string
  /**
   * 列表项间距
   * @default '20rpx'
   */
  itemGap?: string
  /**
   * 触发加载更多的距离阈值（px）
   * @default 50
   */
  loadMoreThreshold?: number
}

/**
 * ScrollView 滚动事件
 */
export interface ScrollViewScrollEvent {
  detail: {
    scrollLeft: number
    scrollTop: number
    scrollHeight: number
    scrollWidth: number
    deltaX: number
    deltaY: number
  }
}

/**
 * SeeScrollList 组件事件
 */
export interface SeeScrollListEmits {
  (e: 'onScroll', event: ScrollViewScrollEvent): void
  (e: 'onScrollToLower'): void
  (e: 'onScrollToUpper'): void
}
