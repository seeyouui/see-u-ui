/**
 * useTableVirtual
 * @description 表格虚拟滚动 hook：行虚拟化（基于 useVirtualWindow）+ 列虚拟化（手动计算）
 */
import { computed, ref, type Ref } from 'vue'
import type { SeeTableColumn } from '../type'
import { useVirtualWindow } from '../../../utils/hooks/useVirtualWindow'

export interface UseTableVirtualOptions {
  /** 是否开启虚拟行 */
  virtual: Ref<boolean>
  /** 是否开启虚拟列 */
  virtualX: Ref<boolean>
  /** 固定行高（px），虚拟行时推荐必填 */
  rowHeight: Ref<number>
  /** 预估行高（px），动态高度模式使用 */
  estimatedRowHeight: Ref<number>
  /** 缓冲行数 */
  buffer: Ref<number>
  /** 总行数 */
  totalRows: Ref<number>
  /** 可滚动列（不含 fixed 列） */
  columns: Ref<SeeTableColumn[]>
  /** 表格总宽度（px），所有列宽之和 */
  tableWidth: Ref<number>
}

export interface UseTableVirtualReturn {
  /** 行渲染起始索引（含 buffer） */
  rowStartIndex: Ref<number>
  /** 行渲染结束索引（含 buffer） */
  rowEndIndex: Ref<number>
  /** 行 translateY 偏移量（px） */
  translateY: Ref<number>
  /** 内容总高度（px） */
  totalHeight: Ref<number>
  /** 列渲染起始索引 */
  colStartIndex: Ref<number>
  /** 列渲染结束索引 */
  colEndIndex: Ref<number>
  /** 左侧 spacer 宽度（px） */
  spacerLeft: Ref<number>
  /** 右侧 spacer 宽度（px） */
  spacerRight: Ref<number>
  /** 滚动事件处理器 */
  onScroll: (event: unknown) => void
  /** 更新视口尺寸 */
  setViewportSize: (width: number, height: number) => void
}

/** 解析 Ref 或原始值 */
const resolve = <T>(val: Ref<T> | T): T => {
  return (val as Ref<T>)?.value ?? (val as T)
}

/** 将列宽度值解析为数字（px） */
function parseColumnWidth(val?: string | number): number {
  if (val === undefined || val === null) return 0
  if (typeof val === 'number') return val
  const num = parseInt(val, 10)
  return isNaN(num) ? 0 : num
}

export function useTableVirtual(options: UseTableVirtualOptions): UseTableVirtualReturn {
  // ========== 视口尺寸（内部管理） ==========
  const viewportWidth = ref(0)
  const viewportHeight = ref(0)

  const setViewportSize = (width: number, height: number) => {
    viewportWidth.value = width
    viewportHeight.value = height
  }

  // ========== 行虚拟化（基于 useVirtualWindow） ==========
  const rowVirtual = useVirtualWindow({
    total: options.totalRows,
    itemSize: computed(() => {
      const h = resolve(options.rowHeight)
      return h > 0 ? h : resolve(options.estimatedRowHeight) || 48
    }),
    viewportSize: viewportHeight,
    buffer: resolve(options.buffer),
    dynamic: computed(() => resolve(options.rowHeight) <= 0 && resolve(options.estimatedRowHeight) > 0)
  })

  const rowStartIndex = computed(() => (resolve(options.virtual) ? rowVirtual.startIndex.value : 0))
  const rowEndIndex = computed(() => (resolve(options.virtual) ? rowVirtual.endIndex.value : resolve(options.totalRows)))
  const translateY = computed(() => (resolve(options.virtual) ? rowVirtual.translateOffset.value : 0))
  const totalHeight = computed(() => (resolve(options.virtual) ? rowVirtual.totalSize.value : 0))

  // ========== 列虚拟化（手动计算） ==========
  /** 列累计宽度数组：cumWidths[i] = 前 i 列的宽度之和 */
  const columnCumWidths = computed(() => {
    const cols = options.columns.value
    const widths: number[] = [0]
    let cum = 0
    for (const col of cols) {
      cum += parseColumnWidth(col.width)
      widths.push(cum)
    }
    return widths
  })

  /** 列总宽度 */
  const totalColumnWidth = computed(() => {
    const widths = columnCumWidths.value
    return widths[widths.length - 1] || 0
  })

  const scrollLeft = ref(0)

  /** 查找第一个可见列的索引（二分查找） */
  function findColumnIndex(cumWidths: number[], offset: number): number {
    let lo = 0
    let hi = cumWidths.length - 2 // 最大列索引 = length - 2（因为 cumWidths 比列多 1）
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1
      if (cumWidths[mid + 1] <= offset) {
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }
    return Math.max(0, lo)
  }

  const colStartIndex = computed(() => {
    if (!resolve(options.virtualX)) return 0
    const cumWidths = columnCumWidths.value
    if (cumWidths.length <= 1) return 0
    // 找到 scrollLeft 之后的第一个可见列
    return findColumnIndex(cumWidths, scrollLeft.value)
  })

  const colEndIndex = computed(() => {
    if (!resolve(options.virtualX)) return options.columns.value.length
    const cumWidths = columnCumWidths.value
    if (cumWidths.length <= 1) return 0
    const vw = viewportWidth.value
    if (vw <= 0) return options.columns.value.length
    // 找到 scrollLeft + viewportWidth 之后的第一列
    const endIdx = findColumnIndex(cumWidths, scrollLeft.value + vw)
    // 加 buffer 列
    const buffer = Math.max(2, resolve(options.buffer))
    return Math.min(options.columns.value.length, endIdx + buffer)
  })

  const spacerLeft = computed(() => {
    if (!resolve(options.virtualX)) return 0
    const cumWidths = columnCumWidths.value
    return cumWidths[colStartIndex.value] || 0
  })

  const spacerRight = computed(() => {
    if (!resolve(options.virtualX)) return 0
    const cumWidths = columnCumWidths.value
    const total = totalColumnWidth.value
    const endCum = cumWidths[colEndIndex.value] || total
    return Math.max(0, total - endCum)
  })

  // ========== 滚动处理 ==========
  const onScroll = (event: unknown) => {
    const e = event as { detail?: { scrollTop?: number; scrollLeft?: number; scrollHeight?: number; scrollWidth?: number } }
    const detail = e?.detail
    if (!detail) return

    // 更新行虚拟化滚动偏移
    if (resolve(options.virtual) && detail.scrollTop !== undefined) {
      rowVirtual.setScrollOffset(detail.scrollTop)
    }

    // 更新列虚拟化滚动偏移
    if (resolve(options.virtualX) && detail.scrollLeft !== undefined) {
      scrollLeft.value = detail.scrollLeft
    }
  }

  return {
    rowStartIndex,
    rowEndIndex,
    translateY,
    totalHeight,
    colStartIndex,
    colEndIndex,
    spacerLeft,
    spacerRight,
    onScroll,
    setViewportSize
  }
}
