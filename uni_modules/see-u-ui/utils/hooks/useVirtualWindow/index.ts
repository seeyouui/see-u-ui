import { ref, computed, type Ref } from 'vue'

/**
 * 虚拟窗口范围
 */
export interface VirtualWindowRange {
  visibleStart: number
  visibleEnd: number
  translateOffset: number
  totalSize: number
}

/**
 * useVirtualWindow 选项
 */
export interface UseVirtualWindowOptions {
  /** 列表总长度 */
  total: Ref<number> | number
  /** 单项尺寸（px），固定高度主路径 */
  itemSize: Ref<number> | number
  /** 视口尺寸（px） */
  viewportSize: Ref<number> | number
  /** 缓冲项目数，默认 5 */
  buffer?: number
  /** 预估单项尺寸（px），动态高度模式使用 */
  estimatedItemSize?: Ref<number> | number
  /** 是否启用动态高度，默认 false */
  dynamic?: boolean
  /** 滚动偏移量（px） */
  scrollOffset?: Ref<number> | number
}

const resolve = <T>(val: Ref<T> | T): T => {
  return (val as Ref<T>)?.value ?? (val as T)
}

/**
 * useVirtualWindow
 * @description 虚拟窗口计算 hook，用于虚拟列表和虚拟表格的可见范围计算
 *
 * @param options.total      列表总条目数
 * @param options.itemSize   固定条目尺寸（px）
 * @param options.viewportSize 视口尺寸（px）
 * @param options.buffer     上下缓冲项目数，默认 5
 * @param options.estimatedItemSize 动态高度时的预估尺寸
 * @param options.dynamic    是否动态高度模式
 * @param options.scrollOffset 外部滚动偏移量（可选）
 *
 * @returns { visibleStart, visibleEnd, visibleCount, translateOffset, totalSize, startIndex, endIndex, range }
 *
 * 固定高度主路径：
 *   visibleStart = Math.floor(scrollOffset / itemSize)
 *   visibleEnd = visibleStart + visibleCount + buffer * 2
 *   translateOffset = visibleStart * itemSize
 *   totalSize = total * itemSize
 *
 * 动态高度路径：
 *   以 estimatedItemSize 替代计算，totalSize = total * estimatedItemSize
 */
export function useVirtualWindow(options: UseVirtualWindowOptions) {
  const buffer = options.buffer ?? 5

  const totalRef = computed(() => resolve(options.total))
  const itemSizeRef = computed(() => resolve(options.itemSize))
  const viewportRef = computed(() => resolve(options.viewportSize))
  const estimatedRef = computed(() => resolve(options.estimatedItemSize ?? options.itemSize))
  const dynamicRef = computed(() => resolve(options.dynamic ?? false))

  const internalScrollOffset = ref(0)
  const externalScrollOffset = options.scrollOffset ? computed(() => resolve(options.scrollOffset!)) : undefined

  const scrollOffset = computed(() => externalScrollOffset?.value ?? internalScrollOffset.value)

  const effectiveItemSize = computed(() => {
    if (dynamicRef.value) return estimatedRef.value
    return itemSizeRef.value
  })

  /** 检查尺寸是否合法 */
  const hasValidSize = computed(() => effectiveItemSize.value > 0 && viewportRef.value > 0)

  /** 视口内可见项目数 */
  const visibleCount = computed(() => {
    if (!hasValidSize.value) return 0
    return Math.ceil(viewportRef.value / effectiveItemSize.value)
  })

  /** 可见范围的起始索引（不含 buffer） */
  const visibleStart = computed(() => {
    if (!hasValidSize.value) return 0
    return Math.max(0, Math.floor(scrollOffset.value / effectiveItemSize.value))
  })

  /** 可见范围的结束索引（不含 buffer，严格可见） */
  const visibleEnd = computed(() => {
    if (!hasValidSize.value) return 0
    return Math.min(totalRef.value, visibleStart.value + visibleCount.value)
  })

  /** 实际渲染的起始索引（含左 buffer） */
  const startIndex = computed(() => Math.max(0, visibleStart.value - buffer))

  /** 实际渲染的结束索引（含右 buffer） */
  const endIndex = computed(() => Math.min(totalRef.value, visibleEnd.value + buffer))

  /** 占位偏移量（px） */
  const translateOffset = computed(() => {
    if (!hasValidSize.value) return 0
    return startIndex.value * effectiveItemSize.value
  })

  /** 内容总尺寸（px） */
  const totalSize = computed(() => {
    if (!hasValidSize.value) return 0
    return totalRef.value * effectiveItemSize.value
  })

  /** 滚动偏移量更新（内部模式） */
  const setScrollOffset = (offset: number) => {
    internalScrollOffset.value = Math.max(0, offset)
  }

  /** 可见范围对象 */
  const range = computed<VirtualWindowRange>(() => ({
    visibleStart: visibleStart.value,
    visibleEnd: visibleEnd.value,
    translateOffset: translateOffset.value,
    totalSize: totalSize.value
  }))

  /** 可见范围内的项目索引数组 */
  const visibleIndices = computed(() => {
    const indices: number[] = []
    for (let i = startIndex.value; i < endIndex.value; i++) {
      indices.push(i)
    }
    return indices
  })

  return {
    /** 可见范围起始索引（不含 buffer） */
    visibleStart,
    /** 可见范围结束索引（不含 buffer） */
    visibleEnd,
    /** 视口内可见项目数 */
    visibleCount,
    /** 占位偏移量（px） */
    translateOffset,
    /** 内容总尺寸（px） */
    totalSize,
    /** 实际渲染起始索引（含 buffer） */
    startIndex,
    /** 实际渲染结束索引（含 buffer） */
    endIndex,
    /** 可见范围对象 */
    range,
    /** 当前滚动偏移 */
    scrollOffset,
    /** 更新滚动偏移 */
    setScrollOffset,
    /** 可见范围内的原始终端索引 */
    visibleIndices
  }
}
