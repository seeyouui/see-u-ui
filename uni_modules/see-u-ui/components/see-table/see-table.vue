<script lang="ts" setup>
/**
 * SeeTable 表格
 * @description 重型数据表格，支持列配置、表头、横向滚动、状态展示、边框/斑马纹/尺寸、插槽、
 * 行/单元格点击、排序、选择、展开行、树形数据、分页联动、吸顶表头、
 * 固定列、虚拟行、虚拟列及高级组合。
 */
import { computed, toRef, getCurrentInstance } from 'vue'
import { useI18n } from '../../locale'
import type { SeeTableProps, SeeTableColumn } from './type'
import { useTableColumns } from './hooks/useTableColumns'
import { useTableSort } from './hooks/useTableSort'
import { useTableSelection } from './hooks/useTableSelection'
import { useTableExpand } from './hooks/useTableExpand'
import { useTableTree } from './hooks/useTableTree'
import { useTablePagination } from './hooks/useTablePagination'
import { useTableVirtual } from './hooks/useTableVirtual'

defineOptions({ name: 'SeeTable' })

const { t } = useI18n()

const props = withDefaults(defineProps<SeeTableProps>(), {
  data: () => [],
  columns: () => [],
  rowKey: '',
  loading: false,
  error: false,
  emptyText: '',
  border: false,
  stripe: false,
  size: 'medium',
  height: '',
  maxHeight: '',
  showHeader: true,
  stickyHeader: false,
  selectable: false,
  selectedKeys: () => [],
  defaultSelectedKeys: () => [],
  sortable: false,
  sortKey: '',
  sortOrder: '',
  expandable: false,
  expandedKeys: () => [],
  tree: false,
  childrenField: 'children',
  indent: 24,
  defaultExpandAll: false,
  pagination: false,
  virtual: false,
  virtualX: false,
  rowHeight: 0,
  estimatedRowHeight: 0,
  buffer: 5
})

const emit = defineEmits<{
  (e: 'onRowClick', row: unknown, rowIndex: number): void
  (e: 'onCellClick', row: unknown, column: SeeTableColumn, rowIndex: number): void
  (e: 'onSortChange', data: { key: string; order: string; column: SeeTableColumn }): void
  (e: 'onSelectionChange', selectedKeys: Array<string | number>, selectedRows: unknown[]): void
  (e: 'onExpandChange', expandedKeys: Array<string | number>, row: unknown): void
  (e: 'onPageChange', data: { current: number; pageSize: number }): void
  (e: 'onScroll', event: unknown): void
  (e: 'onRangeChange', data: { rowStart: number; rowEnd: number; colStart: number; colEnd: number }): void
}>()

// ========== 列处理 ==========
const columnsRef = toRef(props, 'columns')

/** 递归收集叶子列（用于查找特殊列） */
const flatLeafColumns = computed(() => {
  const result: SeeTableColumn[] = []
  const walk = (cols: SeeTableColumn[]) => {
    for (const col of cols) {
      if (col.children && col.children.length > 0) walk(col.children)
      else result.push(col)
    }
  }
  walk(props.columns)
  return result
})

const selectionColumn = computed(() => flatLeafColumns.value.find((col) => col.type === 'selection'))
const expandColumn = computed(() => flatLeafColumns.value.find((col) => col.type === 'expand'))
const indexColumn = computed(() => flatLeafColumns.value.find((col) => col.type === 'index'))

/** 是否有选择列（自动插入或显式定义） */
const hasSelection = computed(() => props.selectable || !!selectionColumn.value)

/** 是否有展开列（显式定义） */
const hasExpand = computed(() => !!expandColumn.value)

/** 额外左固定列宽度（自动插入的 selection/index 列） */
const extraLeftFixedWidths = computed(() => {
  const widths: number[] = []
  if (props.selectable && !selectionColumn.value) widths.push(50)
  if (indexColumn.value?.width) {
    widths.push(typeof indexColumn.value.width === 'number' ? indexColumn.value.width : parseInt(String(indexColumn.value.width), 10) || 0)
  }
  return widths
})

const { dataColumns, headerRows, getColumnStyle, getColumnClass } = useTableColumns({
  columns: columnsRef,
  extraLeftFixedWidths
})

// 排除特殊类型列（selection、index、expand）后的数据列
const normalDataColumns = computed(() => dataColumns.value.filter((col) => !col.type || col.type === 'normal'))

/** 获取第一数据列的 key（用于树形缩进） */
const firstDataColumnKey = computed(() => normalDataColumns.value[0]?.key ?? '')

// 完整的显示列（包含特殊列 + 普通列）
const displayColumns = computed(() => {
  const cols: SeeTableColumn[] = []
  if (props.selectable && !selectionColumn.value) {
    // 自动插入选择列
    cols.push({ key: '__selection__', title: '', type: 'selection', width: 50, align: 'center' })
  }
  if (expandColumn.value) cols.push(expandColumn.value)
  if (indexColumn.value) cols.push(indexColumn.value)
  cols.push(...normalDataColumns.value)
  return cols
})

// ========== 排序 ==========
const { sortedData, handleSort, getSortOrder } = useTableSort({
  data: toRef(props, 'data'),
  columns: columnsRef,
  sortable: toRef(props, 'sortable'),
  sortKey: toRef(props, 'sortKey'),
  sortOrder: toRef(props, 'sortOrder'),
  rowKey: toRef(props, 'rowKey'),
  onSortChange: (data) => emit('onSortChange', data)
})

// ========== 树形数据 ==========
const {
  flatRows,
  toggleExpand: toggleTreeExpand,
  isNodeExpanded
} = useTableTree({
  data: sortedData,
  childrenField: toRef(props, 'childrenField'),
  defaultExpandAll: toRef(props, 'defaultExpandAll'),
  rowKey: toRef(props, 'rowKey')
})

// ========== 分页 ==========
const {
  pagedData,
  showPagination,
  showTotal,
  simple: simplePagination,
  currentPage,
  pageSize,
  total,
  totalPages,
  changePage,
  prevPage,
  nextPage,
  hasPrev,
  hasNext
} = useTablePagination({
  data: computed(() => (props.tree ? flatRows.value.map((r) => r.row) : sortedData.value)),
  pagination: toRef(props, 'pagination'),
  onPageChange: (data) => emit('onPageChange', data)
})

// ========== 选择 ==========
const instance = getCurrentInstance()
const selectedKeysProvided = computed(() => !!(instance?.vnode.props && 'selectedKeys' in instance.vnode.props))
const expandedKeysProvided = computed(() => !!(instance?.vnode.props && 'expandedKeys' in instance.vnode.props))

const {
  isAllSelected,
  isIndeterminate,
  toggleRow: toggleSelectRow,
  toggleAll,
  isRowSelected
} = useTableSelection({
  data: computed(() => (props.tree ? flatRows.value.map((r) => r.row) : pagedData.value)),
  rowKey: toRef(props, 'rowKey'),
  selectedKeys: toRef(props, 'selectedKeys'),
  defaultSelectedKeys: toRef(props, 'defaultSelectedKeys'),
  selectedKeysProvided,
  onSelectionChange: (keys, rows) => emit('onSelectionChange', keys, rows)
})

// ========== 展开行 ==========
const { toggleExpand: toggleRowExpand, isRowExpanded } = useTableExpand({
  rowKey: toRef(props, 'rowKey'),
  expandedKeys: toRef(props, 'expandedKeys'),
  expandedKeysProvided,
  onExpandChange: (keys, row) => emit('onExpandChange', keys, row)
})

// ========== 虚拟滚动 ==========

/** 当前渲染的源数据（树形用 flatRows，普通用 pagedData） */
const renderSourceData = computed(() => {
  if (props.tree && !showPagination.value) return flatRows.value
  if (props.tree && showPagination.value) {
    // 树形+分页：对扁平化后的行做分页切片
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return flatRows.value.slice(start, end)
  }
  return pagedData.value
})

/** 可滚动列宽之和（不含 fixed 列） */
const scrollableColumnsWidth = computed(() => {
  let total = 0
  for (const col of normalDataColumns.value) {
    if (col.fixed !== 'left' && col.fixed !== 'right') {
      total += typeof col.width === 'number' ? col.width : parseInt(String(col.width), 10) || 0
    }
  }
  return total
})

const {
  rowStartIndex,
  rowEndIndex,
  translateY,
  totalHeight,
  colStartIndex,
  colEndIndex,
  spacerLeft,
  spacerRight,
  onScroll: handleVirtualScroll,
  setViewportSize
} = useTableVirtual({
  virtual: toRef(props, 'virtual'),
  virtualX: toRef(props, 'virtualX'),
  rowHeight: toRef(props, 'rowHeight'),
  estimatedRowHeight: toRef(props, 'estimatedRowHeight'),
  buffer: toRef(props, 'buffer'),
  totalRows: computed(() => renderSourceData.value.length),
  columns: computed(() => normalDataColumns.value),
  tableWidth: scrollableColumnsWidth
})

/** 虚拟行渲染数据 */
const virtualRows = computed(() => {
  if (!props.virtual) return renderSourceData.value
  return renderSourceData.value.slice(rowStartIndex.value, rowEndIndex.value)
})

/** 虚拟滚动实际使用的行高 */
const effectiveRowHeight = computed(() => {
  if (props.rowHeight > 0) return props.rowHeight
  if (props.estimatedRowHeight > 0) return props.estimatedRowHeight
  return 48
})

/** 虚拟列渲染数据 */
const virtualNormalColumns = computed(() => {
  if (!props.virtualX) return normalDataColumns.value
  return normalDataColumns.value.slice(colStartIndex.value, colEndIndex.value)
})

/** 虚拟列的 header 行（过滤出可见列） */
const virtualHeaderRows = computed(() => {
  if (!props.virtualX) return headerRows.value
  const visibleKeys = new Set(virtualNormalColumns.value.map((c) => c.key))
  return headerRows.value.map((row) => row.filter((col) => visibleKeys.has(col.key)))
})

/** 统一滚动处理 */
const onBodyScroll = (event: unknown) => {
  if (props.virtual || props.virtualX) {
    handleVirtualScroll(event)
    // 虚拟滚动范围变更后派发事件
    emit('onRangeChange', {
      rowStart: rowStartIndex.value,
      rowEnd: rowEndIndex.value,
      colStart: colStartIndex.value,
      colEnd: colEndIndex.value
    })
  }
  emit('onScroll', event)
}

/** 初始化视口尺寸（虚拟滚动依赖此值计算可见行数） */
if (props.virtual || props.virtualX) {
  let h = 0
  if (props.height) {
    h = typeof props.height === 'number' ? props.height : parseInt(String(props.height), 10) || 0
  } else if (props.maxHeight) {
    h = typeof props.maxHeight === 'number' ? props.maxHeight : parseInt(String(props.maxHeight), 10) || 0
  } else {
    h = 400
  }
  // 初始化宽度：使用系统屏幕宽度作为近似值
  const w = typeof uni !== 'undefined' && uni.getSystemInfoSync ? uni.getSystemInfoSync().windowWidth : 375
  setViewportSize(w, h)
}

// ========== 计算属性 ==========
const safeData = computed(() => props.data ?? [])

const isEmpty = computed(() => !props.loading && !props.error && safeData.value.length === 0)

const showHeader = computed(() => props.showHeader)

/** 获取行的唯一 key */
const getRowKey = (row: unknown, index: number): string | number => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  if (props.rowKey && typeof row === 'object' && row !== null) {
    return ((row as Record<string, unknown>)[props.rowKey] as string | number) ?? index
  }
  return index
}

/** 获取单元格值 */
const getCellValue = (row: unknown, column: SeeTableColumn): unknown => {
  if (column.formatter) return undefined
  const field = column.dataIndex || column.key
  if (typeof row === 'object' && row !== null) {
    return (row as Record<string, unknown>)[field]
  }
  return undefined
}

/** 格式化单元格显示值 */
const getCellDisplayValue = (row: unknown, column: SeeTableColumn, rowIndex: number): string | number => {
  if (column.formatter) return column.formatter(row, column, rowIndex)
  const val = getCellValue(row, column)
  return val !== undefined && val !== null ? String(val) : ''
}

/** 获取序号列的值 */
const getIndexValue = (rowIndex: number): number => {
  if (showPagination.value) {
    return (currentPage.value - 1) * pageSize.value + rowIndex + 1
  }
  return rowIndex + 1
}

// ========== 样式计算 ==========

const rootClasses = computed(() => [
  'see-table',
  `see-table--${props.size}`,
  {
    'see-table--border': props.border,
    'see-table--stripe': props.stripe,
    'see-table--loading': props.loading,
    'see-table--error': props.error,
    'see-table--sticky-header': props.stickyHeader,
    'see-table--virtual': props.virtual,
    'see-table--virtual-x': props.virtualX
  }
])

/**
 * 将尺寸值标准化为合法 CSS 长度。
 * - 数字 / 纯数字字符串（如 400、"400"）补上 px 单位
 * - 已带单位的字符串（如 "400px"、"60vh"、"50%"）原样返回
 * 不做这一步的话，Vue 会把无单位的字符串视为非法 CSS 而丢弃整段 style，
 * 导致 scroll-view 没有固定高度、虚拟行 scrollTop 永远为 0，只渲染首屏。
 */
const normalizeCssSize = (val: string | number | undefined): string => {
  if (val === undefined || val === null || val === '') return ''
  if (typeof val === 'number') return `${val}px`
  const trimmed = String(val).trim()
  if (trimmed === '') return ''
  // 纯数字（含小数、负号）→ 自动补 px
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`
  return trimmed
}

const bodyStyle = computed(() => {
  const style: Record<string, string> = {}
  const h = normalizeCssSize(props.height)
  const mh = normalizeCssSize(props.maxHeight)
  // 虚拟模式需要固定高度 + 纵向滚动
  if (props.virtual) {
    if (h) {
      style.height = h
    } else if (mh) {
      style.maxHeight = mh
    } else {
      style.height = '400px' // 虚拟模式默认高度
    }
    return style
  }
  if (h) {
    style.height = h
    style.overflowY = 'auto'
  }
  if (mh) {
    style.maxHeight = mh
    style.overflowY = 'auto'
  }
  return style
})

/** 表格总宽度（用于横向滚动） */
const tableWidth = computed(() => {
  let total = 0
  for (const col of displayColumns.value) {
    if (col.width) {
      total += typeof col.width === 'number' ? col.width : parseInt(col.width, 10) || 0
    }
  }
  if (total === 0) return undefined
  return `${total}px`
})

// ========== 事件处理 ==========

const handleRowClick = (row: unknown, rowIndex: number) => {
  emit('onRowClick', row, rowIndex)
}

const handleCellClick = (row: unknown, column: SeeTableColumn, rowIndex: number) => {
  emit('onCellClick', row, column, rowIndex)
}

const handleScroll = (event: unknown) => {
  onBodyScroll(event)
}

const handleSelectAll = () => {
  toggleAll()
}

const handleSelectRow = (row: unknown, rowIndex: number) => {
  toggleSelectRow(row, rowIndex)
}

const handleToggleExpand = (row: unknown, rowIndex: number) => {
  if (props.tree) {
    toggleTreeExpand(row as Record<string, unknown>, rowIndex)
  } else {
    toggleRowExpand(row, rowIndex)
  }
}

const handleSortClick = (column: SeeTableColumn) => {
  handleSort(column)
}

// 分页按钮生成
const pageNumbers = computed(() => {
  const pages: number[] = []
  const cur = currentPage.value
  const total = totalPages.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (cur > 3) pages.push(-1) // 省略号
    const start = Math.max(2, cur - 1)
    const end = Math.min(total - 1, cur + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (cur < total - 2) pages.push(-1) // 省略号
    pages.push(total)
  }
  return pages
})
</script>

<template>
  <view :class="rootClasses">
    <!-- 加载状态遮罩 -->
    <view v-if="loading && safeData.length === 0" class="see-table__loading-mask">
      <slot name="loading">
        <view class="see-table__loading">
          <view class="see-table__loading-spinner" />
          <text class="see-table__loading-text">{{ t('table.loading') }}</text>
        </view>
      </slot>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error && safeData.length === 0" class="see-table__status">
      <slot name="error">
        <view class="see-table__error">
          <text class="see-table__error-icon">!</text>
          <text class="see-table__status-text">{{ t('table.error') }}</text>
        </view>
      </slot>
    </view>

    <!-- 空状态 -->
    <view v-else-if="isEmpty" class="see-table__status">
      <slot name="empty">
        <view class="see-table__empty">
          <text class="see-table__empty-icon">○</text>
          <text class="see-table__status-text">{{ emptyText || t('table.empty') }}</text>
        </view>
      </slot>
    </view>

    <!-- 表格主体 -->
    <template v-else>
      <scroll-view
        class="see-table__wrapper"
        :class="{ 'see-table__wrapper--virtual': virtual }"
        :scroll-x="!virtual || virtualX"
        :scroll-y="!!virtual"
        :show-scrollbar="false"
        :style="bodyStyle"
        @scroll="handleScroll"
      >
        <view
          class="see-table__container"
          :style="{ ...(tableWidth ? { width: tableWidth } : {}), ...(virtual ? { position: 'relative', minHeight: totalHeight + 'px' } : {}) }"
        >
          <!-- 表头 -->
          <view v-if="showHeader" class="see-table__header" :class="{ 'see-table__header--sticky': stickyHeader }">
            <view v-for="(headerRow, rowIndex) in virtualX ? virtualHeaderRows : headerRows" :key="rowIndex" class="see-table__header-row">
              <!-- 选择列表头 -->
              <view
                v-if="rowIndex === 0 && hasSelection && !selectionColumn"
                class="see-table__header-cell see-table__header-cell--selection"
                :style="{ position: 'sticky', left: '0', zIndex: '6' }"
              >
                <view
                  class="see-table__checkbox"
                  :class="{ 'see-table__checkbox--checked': isAllSelected, 'see-table__checkbox--indeterminate': isIndeterminate }"
                  @tap.stop="handleSelectAll"
                >
                  <view class="see-table__checkbox-icon">
                    <text v-if="isAllSelected" class="see-table__checkbox-check">✓</text>
                    <text v-else-if="isIndeterminate" class="see-table__checkbox-minus">-</text>
                  </view>
                </view>
              </view>

              <!-- 展开列表头占位 -->
              <view v-if="rowIndex === 0 && hasExpand" class="see-table__header-cell see-table__header-cell--expand" />

              <!-- 序号列表头 -->
              <view
                v-if="rowIndex === 0 && indexColumn"
                class="see-table__header-cell see-table__header-cell--index"
                :class="getColumnClass(indexColumn)"
                :style="getColumnStyle(indexColumn)"
              >
                <text class="see-table__header-text">{{ indexColumn.title || '#' }}</text>
              </view>

              <!-- 虚拟列左侧占位 -->
              <view v-if="virtualX && rowIndex === 0" class="see-table__virtual-spacer-h" :style="{ width: spacerLeft + 'px' }" />

              <!-- 表头单元格 -->
              <view
                v-for="(column, colIndex) in headerRow.filter((c) => c.type === 'normal' || !c.type || c.type === 'selection')"
                :key="column.key"
                class="see-table__header-cell"
                :class="[
                  getColumnClass(column),
                  {
                    'see-table__header-cell--sortable': column.sortable !== false && (column.sortable || sortable),
                    'see-table__header-cell--selection': column.type === 'selection'
                  }
                ]"
                :style="getColumnStyle(column)"
                @tap.stop="column.sortable !== false && (column.sortable || sortable) ? handleSortClick(column) : undefined"
              >
                <!-- 选择列表头（显式定义） -->
                <template v-if="column.type === 'selection'">
                  <view
                    class="see-table__checkbox"
                    :class="{ 'see-table__checkbox--checked': isAllSelected, 'see-table__checkbox--indeterminate': isIndeterminate }"
                    @tap.stop="handleSelectAll"
                  >
                    <view class="see-table__checkbox-icon">
                      <text v-if="isAllSelected" class="see-table__checkbox-check">✓</text>
                      <text v-else-if="isIndeterminate" class="see-table__checkbox-minus">-</text>
                    </view>
                  </view>
                </template>
                <!-- 普通列表头 -->
                <template v-else>
                  <slot :name="`header-${column.key}`" :column="column" :column-index="colIndex">
                    <view class="see-table__header-content">
                      <text class="see-table__header-text">{{ column.title }}</text>
                      <!-- 排序图标 -->
                      <view v-if="column.sortable !== false && (column.sortable || sortable)" class="see-table__sort-icon">
                        <text
                          class="see-table__sort-arrow see-table__sort-arrow--up"
                          :class="{ 'see-table__sort-arrow--active': getSortOrder(column) === 'asc' }"
                        >
                          ▲
                        </text>
                        <text
                          class="see-table__sort-arrow see-table__sort-arrow--down"
                          :class="{ 'see-table__sort-arrow--active': getSortOrder(column) === 'desc' }"
                        >
                          ▼
                        </text>
                      </view>
                    </view>
                  </slot>
                </template>
              </view>

              <!-- 虚拟列右侧占位 -->
              <view v-if="virtualX && rowIndex === 0" class="see-table__virtual-spacer-h" :style="{ width: spacerRight + 'px' }" />
            </view>
          </view>

          <!-- 表体 -->
          <view class="see-table__body">
            <!-- 虚拟滚动顶部占位 -->
            <view v-if="virtual" class="see-table__virtual-spacer" :style="{ height: translateY + 'px' }" />

            <!-- 树形数据渲染 -->
            <template v-if="tree">
              <template
                v-for="(flatRow, localIndex) in virtual ? virtualRows : flatRows"
                :key="getRowKey(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)"
              >
                <view
                  class="see-table__row"
                  :class="{ 'see-table__row--even': stripe && (virtual ? rowStartIndex + localIndex : localIndex) % 2 === 1 }"
                  @tap="handleRowClick(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)"
                >
                  <!-- 选择列（自动插入） -->
                  <view v-if="hasSelection && !selectionColumn" class="see-table__cell see-table__cell--selection">
                    <view
                      class="see-table__checkbox"
                      :class="{ 'see-table__checkbox--checked': isRowSelected(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex) }"
                      @tap.stop="handleSelectRow(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)"
                    >
                      <view class="see-table__checkbox-icon">
                        <text v-if="isRowSelected(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)" class="see-table__checkbox-check">
                          ✓
                        </text>
                      </view>
                    </view>
                  </view>

                  <!-- 选择列（显式定义） -->
                  <view
                    v-if="selectionColumn"
                    class="see-table__cell see-table__cell--selection"
                    :class="getColumnClass(selectionColumn)"
                    :style="getColumnStyle(selectionColumn)"
                  >
                    <view
                      class="see-table__checkbox"
                      :class="{ 'see-table__checkbox--checked': isRowSelected(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex) }"
                      @tap.stop="handleSelectRow(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)"
                    >
                      <view class="see-table__checkbox-icon">
                        <text v-if="isRowSelected(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)" class="see-table__checkbox-check">
                          ✓
                        </text>
                      </view>
                    </view>
                  </view>

                  <!-- 展开列（树形展开图标） -->
                  <view v-if="hasExpand" class="see-table__cell see-table__cell--expand">
                    <view
                      v-if="flatRow.hasChildren"
                      class="see-table__expand-icon"
                      @tap.stop="handleToggleExpand(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)"
                    >
                      <text
                        class="see-table__expand-arrow"
                        :class="{
                          'see-table__expand-arrow--expanded': isNodeExpanded(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)
                        }"
                      >
                        ▶
                      </text>
                    </view>
                  </view>

                  <!-- 序号列 -->
                  <view
                    v-if="indexColumn"
                    class="see-table__cell see-table__cell--index"
                    :class="getColumnClass(indexColumn)"
                    :style="getColumnStyle(indexColumn)"
                  >
                    <text class="see-table__cell-text">{{ getIndexValue(virtual ? rowStartIndex + localIndex : localIndex) }}</text>
                  </view>

                  <!-- 虚拟列左侧占位 -->
                  <view v-if="virtualX" class="see-table__virtual-spacer-h" :style="{ width: spacerLeft + 'px' }" />

                  <!-- 数据列 -->
                  <view
                    v-for="column in virtualX ? virtualNormalColumns : normalDataColumns"
                    :key="column.key"
                    class="see-table__cell"
                    :class="getColumnClass(column)"
                    :style="[getColumnStyle(column), column.key === firstDataColumnKey ? { paddingLeft: flatRow.depth * indent + 24 + 'rpx' } : {}]"
                    @tap.stop="handleCellClick(flatRow.row, column, virtual ? rowStartIndex + localIndex : localIndex)"
                  >
                    <!-- 树形展开/收起图标（在第一数据列显示） -->
                    <view
                      v-if="column.key === firstDataColumnKey && flatRow.hasChildren"
                      class="see-table__tree-toggle"
                      @tap.stop="handleToggleExpand(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)"
                    >
                      <text
                        class="see-table__tree-arrow"
                        :class="{
                          'see-table__tree-arrow--expanded': isNodeExpanded(flatRow.row, virtual ? rowStartIndex + localIndex : localIndex)
                        }"
                      >
                        ▶
                      </text>
                    </view>
                    <slot
                      :name="`cell-${column.key}`"
                      :row="flatRow.row"
                      :column="column"
                      :row-index="virtual ? rowStartIndex + localIndex : localIndex"
                      :value="getCellValue(flatRow.row, column)"
                    >
                      <text class="see-table__cell-text">
                        {{ getCellDisplayValue(flatRow.row, column, virtual ? rowStartIndex + localIndex : localIndex) }}
                      </text>
                    </slot>
                  </view>

                  <!-- 虚拟列右侧占位 -->
                  <view v-if="virtualX" class="see-table__virtual-spacer-h" :style="{ width: spacerRight + 'px' }" />
                </view>
              </template>
            </template>

            <!-- 普通数据渲染（非树形） -->
            <template v-else>
              <template
                v-for="(row, localIndex) in virtual ? virtualRows : pagedData"
                :key="getRowKey(row, virtual ? rowStartIndex + localIndex : localIndex)"
              >
                <view
                  class="see-table__row"
                  :class="{ 'see-table__row--even': stripe && (virtual ? rowStartIndex + localIndex : localIndex) % 2 === 1 }"
                  @tap="handleRowClick(row, virtual ? rowStartIndex + localIndex : localIndex)"
                >
                  <!-- 选择列（自动插入） -->
                  <view v-if="hasSelection && !selectionColumn" class="see-table__cell see-table__cell--selection">
                    <view
                      class="see-table__checkbox"
                      :class="{ 'see-table__checkbox--checked': isRowSelected(row, virtual ? rowStartIndex + localIndex : localIndex) }"
                      @tap.stop="handleSelectRow(row, virtual ? rowStartIndex + localIndex : localIndex)"
                    >
                      <view class="see-table__checkbox-icon">
                        <text v-if="isRowSelected(row, virtual ? rowStartIndex + localIndex : localIndex)" class="see-table__checkbox-check">✓</text>
                      </view>
                    </view>
                  </view>

                  <!-- 选择列（显式定义） -->
                  <view
                    v-if="selectionColumn"
                    class="see-table__cell see-table__cell--selection"
                    :class="getColumnClass(selectionColumn)"
                    :style="getColumnStyle(selectionColumn)"
                  >
                    <view
                      class="see-table__checkbox"
                      :class="{ 'see-table__checkbox--checked': isRowSelected(row, virtual ? rowStartIndex + localIndex : localIndex) }"
                      @tap.stop="handleSelectRow(row, virtual ? rowStartIndex + localIndex : localIndex)"
                    >
                      <view class="see-table__checkbox-icon">
                        <text v-if="isRowSelected(row, virtual ? rowStartIndex + localIndex : localIndex)" class="see-table__checkbox-check">✓</text>
                      </view>
                    </view>
                  </view>

                  <!-- 展开列 -->
                  <view v-if="hasExpand" class="see-table__cell see-table__cell--expand">
                    <view class="see-table__expand-icon" @tap.stop="handleToggleExpand(row, virtual ? rowStartIndex + localIndex : localIndex)">
                      <text
                        class="see-table__expand-arrow"
                        :class="{ 'see-table__expand-arrow--expanded': isRowExpanded(row, virtual ? rowStartIndex + localIndex : localIndex) }"
                      >
                        ▶
                      </text>
                    </view>
                  </view>

                  <!-- 序号列 -->
                  <view
                    v-if="indexColumn"
                    class="see-table__cell see-table__cell--index"
                    :class="getColumnClass(indexColumn)"
                    :style="getColumnStyle(indexColumn)"
                  >
                    <text class="see-table__cell-text">{{ getIndexValue(virtual ? rowStartIndex + localIndex : localIndex) }}</text>
                  </view>

                  <!-- 虚拟列左侧占位 -->
                  <view v-if="virtualX" class="see-table__virtual-spacer-h" :style="{ width: spacerLeft + 'px' }" />

                  <!-- 数据列 -->
                  <view
                    v-for="column in virtualX ? virtualNormalColumns : normalDataColumns"
                    :key="column.key"
                    class="see-table__cell"
                    :class="getColumnClass(column)"
                    :style="getColumnStyle(column)"
                    @tap.stop="handleCellClick(row, column, virtual ? rowStartIndex + localIndex : localIndex)"
                  >
                    <slot
                      :name="`cell-${column.key}`"
                      :row="row"
                      :column="column"
                      :row-index="virtual ? rowStartIndex + localIndex : localIndex"
                      :value="getCellValue(row, column)"
                    >
                      <text class="see-table__cell-text">
                        {{ getCellDisplayValue(row, column, virtual ? rowStartIndex + localIndex : localIndex) }}
                      </text>
                    </slot>
                  </view>

                  <!-- 虚拟列右侧占位 -->
                  <view v-if="virtualX" class="see-table__virtual-spacer-h" :style="{ width: spacerRight + 'px' }" />
                </view>

                <!-- 展开行内容 -->
                <view v-if="expandable && isRowExpanded(row, virtual ? rowStartIndex + localIndex : localIndex)" class="see-table__expand-row">
                  <slot name="expand" :row="row" :row-index="virtual ? rowStartIndex + localIndex : localIndex" />
                </view>
              </template>
            </template>

            <!-- 虚拟滚动底部占位 -->
            <view
              v-if="virtual"
              class="see-table__virtual-spacer"
              :style="{ height: totalHeight - translateY - (rowEndIndex - rowStartIndex) * effectiveRowHeight + 'px' }"
            />
          </view>
        </view>
        <!-- 分页 -->
        <view v-if="showPagination" class="see-table__pagination">
          <view v-if="showTotal" class="see-table__pagination-total">
            <text class="see-table__pagination-total-text">{{ t('table.total', { total }) }}</text>
          </view>
          <view class="see-table__pagination-nav">
            <view class="see-table__pagination-btn" :class="{ 'see-table__pagination-btn--disabled': !hasPrev }" @tap="prevPage">
              <text class="see-table__pagination-btn-text">‹</text>
            </view>
            <template v-if="!simplePagination">
              <view
                v-for="(page, idx) in pageNumbers"
                :key="idx"
                class="see-table__pagination-page"
                :class="{ 'see-table__pagination-page--active': page === currentPage, 'see-table__pagination-page--ellipsis': page === -1 }"
                @tap="page !== -1 ? changePage(page) : undefined"
              >
                <text class="see-table__pagination-page-text">{{ page === -1 ? '...' : page }}</text>
              </view>
            </template>
            <template v-else>
              <view class="see-table__pagination-simple">
                <text class="see-table__pagination-simple-text">{{ currentPage }} / {{ totalPages }}</text>
              </view>
            </template>
            <view class="see-table__pagination-btn" :class="{ 'see-table__pagination-btn--disabled': !hasNext }" @tap="nextPage">
              <text class="see-table__pagination-btn-text">›</text>
            </view>
          </view>
        </view>
        <!-- 底部插槽 -->
        <view v-if="$slots.footer" class="see-table__footer">
          <slot name="footer" />
        </view>
        <!-- 加载遮罩（有数据时叠加显示） -->
        <view v-if="loading && safeData.length > 0" class="see-table__loading-overlay">
          <slot name="loading">
            <view class="see-table__loading">
              <view class="see-table__loading-spinner" />
            </view>
          </slot>
        </view>
      </scroll-view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.see-table {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  background: var(--see-bg-color);

  // ========== 尺寸变体 ==========
  &--small {
    .see-table__header-cell,
    .see-table__cell {
      padding: 12rpx 16rpx;
    }

    .see-table__header-text,
    .see-table__cell-text {
      font-size: 24rpx;
    }
  }

  &--medium {
    .see-table__header-cell,
    .see-table__cell {
      padding: 20rpx 24rpx;
    }

    .see-table__header-text,
    .see-table__cell-text {
      font-size: 28rpx;
    }
  }

  &--large {
    .see-table__header-cell,
    .see-table__cell {
      padding: 28rpx 32rpx;
    }

    .see-table__header-text,
    .see-table__cell-text {
      font-size: 30rpx;
    }
  }

  // ========== 边框变体 ==========
  &--border {
    border: 1px solid var(--see-border-four-color);
    border-radius: 8rpx;
    overflow: hidden;

    .see-table__header-cell,
    .see-table__cell {
      border-right: 1px solid var(--see-border-four-color);

      &:last-child {
        border-right: none;
      }
    }

    .see-table__row {
      border-bottom: 1px solid var(--see-border-four-color);

      &:last-child {
        border-bottom: none;
      }
    }

    .see-table__header-row {
      border-bottom: 1px solid var(--see-border-four-color);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  // ========== 包装器 ==========
  &__wrapper {
    width: 100%;
    overflow-x: auto;

    &--virtual {
      // scroll-view with scroll-y handles vertical scrolling
      // CSS overflow-x enables horizontal scrolling within the scroll-view
      overflow-x: auto;
    }
  }

  &__container {
    min-width: 100%;
  }

  // ========== 表头 ==========
  &__header {
    background: var(--see-info-light);

    &--sticky {
      position: sticky;
      top: 0;
      z-index: 5;
    }
  }

  &__header-row {
    display: flex;
    flex-direction: row;

    .see-table--border & {
      border-bottom: 1px solid var(--see-border-four-color);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  &__header-cell {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    flex-shrink: 0;

    &--sortable {
      cursor: pointer;
      user-select: none;

      &:active {
        background: rgba(0, 0, 0, 0.04);
      }
    }

    &--selection {
      justify-content: center;
    }

    &--expand {
      width: 40rpx;
    }

    &--index {
      justify-content: center;
    }
  }

  &__header-content {
    display: flex;
    align-items: center;
    gap: 6rpx;
  }

  &__header-text {
    font-weight: 600;
    color: var(--see-main-color);
    white-space: nowrap;
  }

  // ========== 排序图标 ==========
  &__sort-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    line-height: 1;
  }

  &__sort-arrow {
    font-size: 16rpx;
    color: var(--see-info-dark);
    line-height: 1;
    opacity: 0.4;

    &--active {
      color: var(--see-primary);
      opacity: 1;
    }
  }

  // ========== 表体 ==========
  &__body {
    display: flex;
    flex-direction: column;
  }

  &__row {
    display: flex;
    flex-direction: row;
    transition: background-color 0.2s;

    // 斑马纹
    &--even {
      background: var(--see-info-light);
    }
  }

  &__cell {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    flex-shrink: 0;

    &--selection {
      justify-content: center;
    }

    &--expand {
      width: 40rpx;
      justify-content: center;
    }

    &--index {
      justify-content: center;
    }
  }

  &__cell-text {
    color: var(--see-main-color);
    white-space: nowrap;
  }

  // ========== 复选框 ==========
  &__checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid var(--see-border-color);
    border-radius: 6rpx;
    background: var(--see-bg-color);
    transition: all 0.2s;

    &--checked {
      background: var(--see-primary);
      border-color: var(--see-primary);
    }

    &--indeterminate {
      background: var(--see-primary);
      border-color: var(--see-primary);
    }
  }

  &__checkbox-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__checkbox-check {
    font-size: 22rpx;
    color: #fff;
    font-weight: 700;
  }

  &__checkbox-minus {
    font-size: 24rpx;
    color: #fff;
    font-weight: 700;
    line-height: 1;
  }

  // ========== 展开行 ==========
  &__expand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32rpx;
    height: 32rpx;
    cursor: pointer;
  }

  &__expand-arrow {
    font-size: 20rpx;
    color: var(--see-info-dark);
    transition: transform 0.2s;

    &--expanded {
      transform: rotate(90deg);
    }
  }

  &__expand-row {
    background: var(--see-fill-color-lighter);
    border-bottom: 1px solid var(--see-border-four-color);
  }

  // ========== 树形 ==========
  &__tree-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32rpx;
    height: 32rpx;
    margin-right: 8rpx;
    flex-shrink: 0;
    cursor: pointer;
  }

  &__tree-arrow {
    font-size: 18rpx;
    color: var(--see-info-dark);
    transition: transform 0.2s;

    &--expanded {
      transform: rotate(90deg);
    }
  }

  // ========== 文本对齐 ==========
  &__cell--left {
    justify-content: flex-start;
    text-align: left;
  }

  &__cell--center {
    justify-content: center;
    text-align: center;
  }

  &__cell--right {
    justify-content: flex-end;
    text-align: right;
  }

  // ========== 文本省略 ==========
  &__cell--ellipsis {
    overflow: hidden;

    .see-table__cell-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
  }

  // ========== 固定列 ==========
  &__cell--fixed-left {
    position: sticky;
    z-index: 3;
    // left 由 inline style 动态设置
  }

  &__cell--fixed-right {
    position: sticky;
    z-index: 3;
    // right 由 inline style 动态设置
  }

  // 固定列表头（更高层级，覆盖吸顶表头）
  &__header-cell--fixed-left {
    z-index: 6;
  }

  &__header-cell--fixed-right {
    z-index: 6;
  }

  // 固定列背景（避免透明导致内容穿透）
  &__cell--fixed-left,
  &__cell--fixed-right {
    background: var(--see-bg-color);
  }

  .see-table__header & {
    .see-table__cell--fixed-left,
    .see-table__cell--fixed-right,
    .see-table__header-cell--fixed-left,
    .see-table__header-cell--fixed-right {
      background: var(--see-info-light);
    }
  }

  // 行 hover 时固定列背景同步
  &__row:active &__cell--fixed-left,
  &__row:active &__cell--fixed-right {
    background: rgba(0, 0, 0, 0.04);
  }

  // 斑马纹行的固定列背景
  &__row--even &__cell--fixed-left,
  &__row--even &__cell--fixed-right {
    background: var(--see-info-light);
  }

  // ========== 虚拟滚动 ==========
  &__virtual-spacer {
    width: 100%;
    pointer-events: none;
    // 占位元素不可见
  }

  &__virtual-spacer-h {
    flex-shrink: 0;
    pointer-events: none;
  }

  // ========== 状态 ==========
  &__status {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80rpx 24rpx;
    min-height: 200rpx;
  }

  &__empty,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
  }

  &__empty-icon {
    font-size: 64rpx;
    color: var(--see-info-dark);
  }

  &__error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48rpx;
    height: 48rpx;
    font-size: 28rpx;
    font-weight: 700;
    color: var(--see-error);
    border: 3rpx solid var(--see-error);
    border-radius: 50%;
  }

  &__status-text {
    font-size: 24rpx;
    color: var(--see-info-dark);
  }

  // ========== 加载状态 ==========
  &__loading-mask {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200rpx;
  }

  &__loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--see-bg-color);
      opacity: 0.7;
    }
  }

  &__loading {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
  }

  &__loading-spinner {
    width: 40rpx;
    height: 40rpx;
    border: 4rpx solid var(--see-border-color);
    border-top-color: var(--see-primary);
    border-radius: 50%;
    animation: see-table-spin 0.8s linear infinite;
  }

  &__loading-text {
    font-size: 24rpx;
    color: var(--see-info-dark);
  }

  // ========== 分页 ==========
  &__pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 24rpx;
    border-top: 1px solid var(--see-border-four-color);
    gap: 16rpx;
  }

  &__pagination-total {
    flex-shrink: 0;
  }

  &__pagination-total-text {
    font-size: 24rpx;
    color: var(--see-info-dark);
  }

  &__pagination-nav {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }

  &__pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56rpx;
    height: 56rpx;
    border: 1px solid var(--see-border-color);
    border-radius: 8rpx;
    background: var(--see-bg-color);

    &--disabled {
      opacity: 0.4;
      pointer-events: none;
    }

    &:active {
      background: var(--see-fill-color-lighter);
    }
  }

  &__pagination-btn-text {
    font-size: 28rpx;
    color: var(--see-main-color);
  }

  &__pagination-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 56rpx;
    height: 56rpx;
    padding: 0 8rpx;
    border: 1px solid var(--see-border-color);
    border-radius: 8rpx;
    background: var(--see-bg-color);

    &--active {
      background: var(--see-primary);
      border-color: var(--see-primary);

      .see-table__pagination-page-text {
        color: #fff;
      }
    }

    &--ellipsis {
      border: none;
      background: transparent;
    }

    &:active:not(&--ellipsis) {
      background: var(--see-fill-color-lighter);
    }
  }

  &__pagination-page-text {
    font-size: 24rpx;
    color: var(--see-main-color);
  }

  &__pagination-simple {
    padding: 0 16rpx;
  }

  &__pagination-simple-text {
    font-size: 24rpx;
    color: var(--see-main-color);
  }

  // ========== 底部 ==========
  &__footer {
    border-top: 1px solid var(--see-border-four-color);
  }
}

@keyframes see-table-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
