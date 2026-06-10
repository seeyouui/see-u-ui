/**
 * 瀑布流项数据
 */
export interface WaterfallItem {
  /** 唯一标识 */
  id?: string | number
  /** 图片 URL */
  image?: string
  /** 标题 */
  title?: string
  /** 高度（用于预分配空间） */
  height?: number
  /** 自定义数据 */
  [key: string]: unknown
}

/**
 * SeeWaterfall 组件属性
 */
export interface SeeWaterfallProps {
  /**
   * 瀑布流数据
   */
  list?: WaterfallItem[]
  /**
   * 列数
   * @default 2
   */
  columns?: number
  /**
   * 列间距
   * @default '16rpx'
   */
  gap?: string
  /**
   * 是否显示加载更多
   * @default false
   */
  hasMore?: boolean
}

/**
 * SeeWaterfall 组件事件
 */
export interface SeeWaterfallEmits {
  (e: 'onLoadMore'): void
  (e: 'onClick', item: WaterfallItem, index: number): void
}
