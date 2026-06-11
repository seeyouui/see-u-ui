/**
 * 索引列表项
 */
export interface IndexListItem {
  [key: string]: any
  /** 索引值（如 A, B, C） */
  index: string
  /** 显示名称 */
  name: string
  /** 拼音（可选，用于拼音索引） */
  pinyin?: string
  /** 首字母（可选） */
  firstLetter?: string
}

/**
 * SeeIndexList Props
 */
export interface SeeIndexListProps {
  /** 数据列表 */
  data?: IndexListItem[]
  /** 自定义索引列表 */
  indexList?: string[]
  /** 索引字段名 */
  indexKey?: string
  /** 是否启用拼音索引 */
  isPinyin?: boolean
  /** 是否显示搜索框 */
  isShowSearch?: boolean
  /** 分组标题是否吸顶 */
  isStickyHeader?: boolean
  /** 列表高度 */
  height?: string | number
  /** 是否启用虚拟滚动 */
  isVirtual?: boolean
}

/**
 * SeeIndexList 事件
 */
export interface SeeIndexListEmits {
  /** 选中项 */
  (e: 'onSelect', item: IndexListItem): void
  /** 索引变更 */
  (e: 'onIndexChange', index: string): void
}
