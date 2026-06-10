/**
 * useTableColumns
 * @description 表格列配置处理：扁平化、宽度计算、列对齐、固定列分区
 */
import { computed, type Ref } from 'vue'
import type { SeeTableColumn } from '../type'

/** 扁平化后的列（含层级信息） */
export interface FlatColumn<T = unknown> {
  column: SeeTableColumn<T>
  /** 第几层表头 */
  level: number
  /** 该列是否属于最底层（数据列） */
  isLeaf: boolean
  /** 该列跨越的行数（用于多级表头 rowspan） */
  rowSpan: number
  /** 该列跨越的列数（用于多级表头 colspan） */
  colSpan: number
}

export interface UseTableColumnsOptions<T = unknown> {
  columns: Ref<SeeTableColumn<T>[]>
  /** 额外的左侧固定列（如自动插入的 selection/index 列） */
  extraLeftFixedWidths?: Ref<number[]>
}

export interface UseTableColumnsReturn<T = unknown> {
  /** 最底层数据列列表（按显示顺序） */
  dataColumns: Ref<SeeTableColumn<T>[]>
  /** 表头层级结构（二维数组，每行是一层表头） */
  headerRows: Ref<SeeTableColumn<T>[][]>
  /** 最大表头深度 */
  maxDepth: Ref<number>
  /** 左侧固定列（fixed === 'left'） */
  fixedLeftColumns: Ref<SeeTableColumn<T>[]>
  /** 右侧固定列（fixed === 'right'） */
  fixedRightColumns: Ref<SeeTableColumn<T>[]>
  /** 可滚动列（无 fixed） */
  scrollableColumns: Ref<SeeTableColumn<T>[]>
  /** 计算列宽度样式（含固定列 sticky 偏移） */
  getColumnStyle: (column: SeeTableColumn<T>) => Record<string, string>
  /** 计算列 class（含固定列 class） */
  getColumnClass: (column: SeeTableColumn<T>) => Record<string, boolean>
}

/** 将宽度值转为 CSS 字符串 */
function toWidth(val?: string | number): string | undefined {
  if (val === undefined || val === null) return undefined
  if (typeof val === 'number') return `${val}px`
  return val
}

/** 获取列的最大嵌套深度 */
function getColumnDepth<T>(column: SeeTableColumn<T>): number {
  if (!column.children || column.children.length === 0) return 1
  return 1 + Math.max(...column.children.map(getColumnDepth))
}

/** 递归收集所有叶子列 */
function collectLeafColumns<T>(columns: SeeTableColumn<T>[]): SeeTableColumn<T>[] {
  const result: SeeTableColumn<T>[] = []
  for (const col of columns) {
    if (col.children && col.children.length > 0) {
      result.push(...collectLeafColumns(col.children))
    } else {
      result.push(col)
    }
  }
  return result
}

/** 递归构建表头行结构 */
function buildHeaderRows<T>(columns: SeeTableColumn<T>[], maxDepth: number): SeeTableColumn<T>[][] {
  const rows: SeeTableColumn<T>[][] = Array.from({ length: maxDepth }, () => [])

  function walk(cols: SeeTableColumn<T>[], level: number) {
    for (const col of cols) {
      rows[level].push(col)
      if (col.children && col.children.length > 0) {
        walk(col.children, level + 1)
      } else if (level < maxDepth - 1) {
        // 叶子列在更深层级也要占位（用于多级表头下方的行）
        for (let l = level + 1; l < maxDepth; l++) {
          rows[l].push(col)
        }
      }
    }
  }

  walk(columns, 0)
  return rows
}

export function useTableColumns<T = unknown>(options: UseTableColumnsOptions<T>): UseTableColumnsReturn<T> {
  const maxDepth = computed(() => {
    const depths = options.columns.value.map(getColumnDepth)
    return depths.length > 0 ? Math.max(...depths) : 1
  })

  const dataColumns = computed(() => collectLeafColumns(options.columns.value))

  const headerRows = computed(() => buildHeaderRows(options.columns.value, maxDepth.value))

  // ========== 固定列分区 ==========
  const fixedLeftColumns = computed(() => dataColumns.value.filter((col) => col.fixed === 'left'))
  const fixedRightColumns = computed(() => dataColumns.value.filter((col) => col.fixed === 'right'))
  const scrollableColumns = computed(() => dataColumns.value.filter((col) => col.fixed !== 'left' && col.fixed !== 'right'))

  /** 解析列宽度为数字（px） */
  const parseWidth = (val?: string | number): number => {
    if (val === undefined || val === null) return 0
    if (typeof val === 'number') return val
    const num = parseInt(val, 10)
    return isNaN(num) ? 0 : num
  }

  /**
   * 计算左侧固定列的累计偏移量
   * 每列的 left = 前面所有 left-fixed 列的宽度之和 + 额外左固定列宽度
   */
  const leftFixedOffsets = computed(() => {
    const offsets = new Map<string, number>()
    const extraWidths = options.extraLeftFixedWidths?.value ?? []
    let cumOffset = extraWidths.reduce((sum, w) => sum + w, 0)
    for (const col of fixedLeftColumns.value) {
      offsets.set(col.key, cumOffset)
      cumOffset += parseWidth(col.width)
    }
    return offsets
  })

  /**
   * 计算右侧固定列的累计偏移量
   * 每列的 right = 后面所有 right-fixed 列的宽度之和
   */
  const rightFixedOffsets = computed(() => {
    const offsets = new Map<string, number>()
    const cols = fixedRightColumns.value
    let cumOffset = 0
    // 从右往左累计
    for (let i = cols.length - 1; i >= 0; i--) {
      offsets.set(cols[i].key, cumOffset)
      cumOffset += parseWidth(cols[i].width)
    }
    return offsets
  })

  const getColumnStyle = (column: SeeTableColumn<T>): Record<string, string> => {
    const style: Record<string, string> = {}
    const w = toWidth(column.width)
    if (w) style.width = w
    const minW = toWidth(column.minWidth)
    if (minW) style.minWidth = minW
    if (column.align) style.textAlign = column.align

    // 固定列 sticky 偏移
    if (column.fixed === 'left') {
      style.position = 'sticky'
      style.left = `${leftFixedOffsets.value.get(column.key) ?? 0}px`
      style.zIndex = '3'
    } else if (column.fixed === 'right') {
      style.position = 'sticky'
      style.right = `${rightFixedOffsets.value.get(column.key) ?? 0}px`
      style.zIndex = '3'
    }

    return style
  }

  const getColumnClass = (column: SeeTableColumn<T>): Record<string, boolean> => ({
    'see-table__cell--ellipsis': !!column.ellipsis,
    [`see-table__cell--${column.align || 'left'}`]: true,
    'see-table__cell--fixed-left': column.fixed === 'left',
    'see-table__cell--fixed-right': column.fixed === 'right'
  })

  return {
    dataColumns,
    headerRows,
    maxDepth,
    fixedLeftColumns,
    fixedRightColumns,
    scrollableColumns,
    getColumnStyle,
    getColumnClass
  }
}
