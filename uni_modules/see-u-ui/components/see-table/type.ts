/**
 * SeeTable 表格组件类型
 */

/** 表格列配置 */
export interface SeeTableColumn<T = unknown> {
  /** 列唯一标识 */
  key: string
  /** 列标题 */
  title: string
  /** 数据字段名，默认等于 key */
  dataIndex?: string
  /** 列宽度（px 或 rpx 字符串，或数字自动转 px） */
  width?: string | number
  /** 最小列宽度 */
  minWidth?: string | number
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 固定列方向（Phase 5） */
  fixed?: 'left' | 'right'
  /** 是否可排序（Phase 4） */
  sortable?: boolean | 'custom'
  /** 文本溢出时是否省略 */
  ellipsis?: boolean
  /** 列类型：normal 普通 | selection 多选 | index 序号 | expand 展开 */
  type?: 'normal' | 'selection' | 'index' | 'expand'
  /** 子列（分组表头，Phase 4） */
  children?: SeeTableColumn<T>[]
  /** 自定义单元格格式化 */
  formatter?: (row: T, column: SeeTableColumn<T>, rowIndex: number) => string | number
}

/** 分页配置 */
export interface SeeTablePagination {
  /** 当前页码 */
  current?: number
  /** 每页条数 */
  pageSize?: number
  /** 总条数 */
  total?: number
  /** 是否显示总条数 */
  showTotal?: boolean
  /** 是否使用简单分页 */
  simple?: boolean
}

/** 表格 Props */
export interface SeeTableProps<T = unknown> {
  /** 表格数据 */
  data?: T[]
  /** 列配置 */
  columns?: SeeTableColumn<T>[]
  /** 行唯一标识字段名或函数 */
  rowKey?: string | ((row: T, index: number) => string | number)

  /** 是否加载中 */
  loading?: boolean
  /** 是否加载出错 */
  error?: boolean
  /** 空状态文字 */
  emptyText?: string

  /** 是否显示边框 */
  border?: boolean
  /** 是否显示斑马纹 */
  stripe?: boolean
  /** 表格尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 表格固定高度（启用纵向滚动） */
  height?: string | number
  /** 表格最大高度（启用纵向滚动） */
  maxHeight?: string | number

  /** 是否显示表头 */
  showHeader?: boolean
  /** 吸顶表头（Phase 4） */
  stickyHeader?: boolean

  /** 是否可选择行（Phase 4） */
  selectable?: boolean
  /** 选中行的 key 列表（Phase 4） */
  selectedKeys?: Array<string | number>
  /** 默认选中行的 key 列表（Phase 4） */
  defaultSelectedKeys?: Array<string | number>

  /** 是否可排序（Phase 4） */
  sortable?: boolean
  /** 排序字段（Phase 4） */
  sortKey?: string
  /** 排序方向（Phase 4） */
  sortOrder?: 'asc' | 'desc' | ''

  /** 是否可展开行（Phase 4） */
  expandable?: boolean
  /** 展开行的 key 列表（Phase 4） */
  expandedKeys?: Array<string | number>

  /** 是否为树形数据（Phase 4） */
  tree?: boolean
  /** 子节点字段名（Phase 4） */
  childrenField?: string
  /** 树形缩进量（Phase 4） */
  indent?: number
  /** 是否默认展开所有（Phase 4） */
  defaultExpandAll?: boolean

  /** 分页配置（Phase 4） */
  pagination?: false | SeeTablePagination

  /** 是否开启虚拟行（Phase 5） */
  virtual?: boolean
  /** 是否开启虚拟列（Phase 5） */
  virtualX?: boolean
  /** 行高，虚拟滚动时必填（Phase 5） */
  rowHeight?: number
  /** 预估行高，动态高度虚拟滚动使用（Phase 5） */
  estimatedRowHeight?: number
  /** 虚拟滚动缓冲行数（Phase 5） */
  buffer?: number
}

/** 单元格插槽作用域 */
export interface SeeTableCellScope<T = unknown> {
  row: T
  column: SeeTableColumn<T>
  rowIndex: number
  value: unknown
}

/** 表头插槽作用域 */
export interface SeeTableHeaderScope<T = unknown> {
  column: SeeTableColumn<T>
  columnIndex: number
}

/** 排序变更事件数据（Phase 4） */
export interface SeeTableSortChange<T = unknown> {
  key: string
  order: 'asc' | 'desc' | ''
  column: SeeTableColumn<T>
}

/** 范围变更事件数据（Phase 5） */
export interface SeeTableRangeChange {
  rowStart: number
  rowEnd: number
  colStart: number
  colEnd: number
}

/** 分页变更事件数据（Phase 4） */
export interface SeeTablePageChange {
  current: number
  pageSize: number
}
