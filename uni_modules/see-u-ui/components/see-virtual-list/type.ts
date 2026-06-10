/**
 * SeeVirtualList 虚拟列表组件类型
 */

export interface SeeVirtualListProps<T = unknown> {
  /** 数据列表 */
  list?: T[]
  /** 列表项高度（px），固定高度模式必填 */
  itemHeight: number
  /** 可视区域高度（px 或 CSS 值），默认 '100%' */
  height?: number | string
  /** 唯一标识字段名 */
  keyField?: string
  /** 上下缓冲项目数，默认 5 */
  buffer?: number
  /** 初始滚动偏移量（px） */
  scrollTop?: number
  /** 跳转到指定索引 */
  scrollIntoIndex?: number
  /** 是否横向滚动 */
  horizontal?: boolean
  /** 列表项间距（px） */
  itemGap?: number
  /** 预估列表项高度（px），动态高度模式使用 */
  estimatedItemHeight?: number
  /** 是否启用动态高度，默认 false */
  dynamic?: boolean
  /** 触发加载更多的距离阈值（px） */
  lowerThreshold?: number
  /** 触发加载更少的距离阈值（px） */
  upperThreshold?: number
  /** 是否显示滚动条 */
  showScrollbar?: boolean
}

/** 列表项插槽暴露数据 */
export interface SeeVirtualListItemScope<T = unknown> {
  item: T
  index: number
  activeIndex: number
}

/** 范围变更事件数据 */
export interface SeeVirtualListRangeChange {
  start: number
  end: number
  visibleStart: number
  visibleEnd: number
}

/** 滚动事件数据 */
export interface SeeVirtualListScrollEvent {
  scrollLeft: number
  scrollTop: number
  deltaX: number
  deltaY: number
}
