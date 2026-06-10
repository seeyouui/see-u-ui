/**
 * SeeList 列表组件类型
 */

export interface SeeListProps<T = unknown> {
  /** 数据列表 */
  list?: T[]
  /** 唯一标识字段名 */
  keyField?: string
  /** 是否加载中 */
  loading?: boolean
  /** 是否全部加载完成 */
  finished?: boolean
  /** 是否加载出错 */
  error?: boolean
  /** 空状态文字 */
  emptyText?: string
  /** 错误状态文字 */
  errorText?: string
  /** 加载中文字 */
  loadingText?: string
  /** 加载完成文字 */
  finishedText?: string
  /** 是否立即检查加载更多（当内容不足一屏时自动触发 loadMore） */
  immediateCheck?: boolean
  /** 触发加载更多的距离阈值（px） */
  offset?: number
  /** 列表方向 */
  direction?: 'vertical' | 'horizontal'
  /** 是否显示边框 */
  border?: boolean
  /** 是否显示分割线 */
  divided?: boolean
  /** 列表项间距 */
  itemGap?: string
  /** 内边距 */
  padding?: string
  /** 分组字段名或函数 */
  groupBy?: string | ((item: T, index: number) => string)
}

/** 列表项插槽暴露数据 */
export interface SeeListItemScope<T = unknown> {
  item: T
  index: number
  group?: string
}

/** 分组插槽暴露数据 */
export interface SeeListGroupScope {
  group: string
  count: number
}
