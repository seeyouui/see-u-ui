/**
 * useTablePagination
 * @description 表格分页逻辑：页码状态、数据切片、页码变更
 */
import { computed, ref, watch, type Ref } from 'vue'
import type { SeeTablePagination } from '../type'

export interface UseTablePaginationOptions<T = unknown> {
  /** 原始数据（可能经过排序） */
  data: Ref<T[]>
  /** 分页配置 */
  pagination: Ref<false | SeeTablePagination>
  /** 分页变更事件 */
  onPageChange: (data: { current: number; pageSize: number }) => void
}

export interface UseTablePaginationReturn<T = unknown> {
  /** 当前页码 */
  currentPage: Ref<number>
  /** 每页条数 */
  pageSize: Ref<number>
  /** 总条数 */
  total: Ref<number>
  /** 总页数 */
  totalPages: Ref<number>
  /** 分页后的数据 */
  pagedData: Ref<T[]>
  /** 是否显示分页 */
  showPagination: Ref<boolean>
  /** 是否显示总条数 */
  showTotal: Ref<boolean>
  /** 是否简单模式 */
  simple: Ref<boolean>
  /** 切换页码 */
  changePage: (page: number) => void
  /** 上一页 */
  prevPage: () => void
  /** 下一页 */
  nextPage: () => void
  /** 是否有上一页 */
  hasPrev: Ref<boolean>
  /** 是否有下一页 */
  hasNext: Ref<boolean>
}

export function useTablePagination<T = unknown>(options: UseTablePaginationOptions<T>): UseTablePaginationReturn<T> {
  // 内部页码状态（组件自己管理，不依赖外部 prop 驱动）
  const innerCurrent = ref(1)
  const innerPageSize = ref(10)

  // 是否启用分页
  const showPagination = computed(() => !!options.pagination.value)

  // 从配置中读取初始值（仅用于初始化内部状态）
  const config = computed(() => {
    if (!options.pagination.value) return { current: 1, pageSize: 10, total: 0, showTotal: false, simple: false }
    return {
      current: options.pagination.value.current ?? 1,
      pageSize: options.pagination.value.pageSize ?? 10,
      total: options.pagination.value.total ?? options.data.value.length,
      showTotal: options.pagination.value.showTotal ?? false,
      simple: options.pagination.value.simple ?? false
    }
  })

  // 监听外部 pagination prop 变化，同步初始值到内部状态
  watch(
    () => options.pagination.value,
    (val) => {
      if (val) {
        if (val.current !== undefined) innerCurrent.value = val.current
        if (val.pageSize !== undefined) innerPageSize.value = val.pageSize
      }
    },
    { immediate: true, deep: true }
  )

  // 内部状态驱动，不受外部 prop 的 current/pageSize 控制
  const currentPage = innerCurrent
  const pageSize = innerPageSize

  const total = computed(() => config.value.total)
  const showTotal = computed(() => config.value.showTotal)
  const simple = computed(() => config.value.simple)

  const totalPages = computed(() => {
    if (pageSize.value <= 0) return 1
    return Math.max(1, Math.ceil(total.value / pageSize.value))
  })

  // 分页后的数据
  const pagedData = computed(() => {
    if (!showPagination.value) return options.data.value
    // 服务端分页：total 与 data.length 不一致时，说明调用方已分好页，不做二次 slice
    if (total.value !== options.data.value.length) return options.data.value
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return options.data.value.slice(start, end)
  })

  const hasPrev = computed(() => currentPage.value > 1)
  const hasNext = computed(() => currentPage.value < totalPages.value)

  /** 切换页码 */
  const changePage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages.value))
    if (p === currentPage.value) return

    innerCurrent.value = p
    options.onPageChange({ current: p, pageSize: pageSize.value })
  }

  /** 上一页 */
  const prevPage = () => {
    if (hasPrev.value) changePage(currentPage.value - 1)
  }

  /** 下一页 */
  const nextPage = () => {
    if (hasNext.value) changePage(currentPage.value + 1)
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    pagedData,
    showPagination,
    showTotal,
    simple,
    changePage,
    prevPage,
    nextPage,
    hasPrev,
    hasNext
  }
}
