/**
 * useTableSort
 * @description 表格排序逻辑：三态切换、受控/非受控、custom 模式
 */
import { computed, ref, watch, type Ref } from 'vue'
import type { SeeTableColumn, SeeTableSortChange } from '../type'

export interface UseTableSortOptions<T = unknown> {
  /** 原始数据 */
  data: Ref<T[]>
  /** 列配置 */
  columns: Ref<SeeTableColumn<T>[]>
  /** 表格级是否可排序 */
  sortable: Ref<boolean>
  /** 受控排序字段 */
  sortKey: Ref<string>
  /** 受控排序方向 */
  sortOrder: Ref<'asc' | 'desc' | ''>
  /** 行唯一标识字段或函数 */
  rowKey: Ref<string | ((row: T, index: number) => string | number)>
  /** 排序变更事件 */
  onSortChange: (data: SeeTableSortChange) => void
}

export interface UseTableSortReturn<T = unknown> {
  /** 当前排序字段（受控优先，否则内部状态） */
  currentSortKey: Ref<string>
  /** 当前排序方向 */
  currentSortOrder: Ref<'asc' | 'desc' | ''>
  /** 排序后的数据 */
  sortedData: Ref<T[]>
  /** 处理表头点击排序 */
  handleSort: (column: SeeTableColumn<T>) => void
  /** 判断列是否为当前排序列 */
  isSortActive: (column: SeeTableColumn<T>) => boolean
  /** 获取排序方向 */
  getSortOrder: (column: SeeTableColumn<T>) => 'asc' | 'desc' | '' | undefined
}

export function useTableSort<T = unknown>(options: UseTableSortOptions<T>): UseTableSortReturn<T> {
  // 非受控状态
  const innerSortKey = ref('')
  const innerSortOrder = ref<'asc' | 'desc' | ''>('')

  // 受控判断：如果外部传了 sortKey，则使用受控模式
  const isControlled = computed(() => !!options.sortKey.value)

  const currentSortKey = computed(() => (isControlled.value ? options.sortKey.value : innerSortKey.value))
  const currentSortOrder = computed(() => (isControlled.value ? options.sortOrder.value : innerSortOrder.value))

  // 排序后的数据
  const sortedData = computed(() => {
    const key = currentSortKey.value
    const order = currentSortOrder.value
    if (!key || !order) return options.data.value

    // 找到对应列，检查是否 custom 模式
    const col = options.columns.value.find((c) => c.key === key)
    if (col?.sortable === 'custom') return options.data.value

    const list = [...options.data.value]
    list.sort((a, b) => {
      const aVal = getSortValue(a, key)
      const bVal = getSortValue(b, key)

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      let result = 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        result = aVal - bVal
      } else {
        result = String(aVal).localeCompare(String(bVal))
      }

      return order === 'asc' ? result : -result
    })
    return list
  })

  /** 获取行的排序值 */
  function getSortValue(row: T, key: string): unknown {
    if (typeof row === 'object' && row !== null) {
      return (row as Record<string, unknown>)[key]
    }
    return undefined
  }

  /** 处理排序点击 */
  const handleSort = (column: SeeTableColumn<T>) => {
    // 列级 sortable 或表格级 sortable 任一为 true 即可排序
    if (!column.sortable && !options.sortable.value) return

    const key = column.key
    const oldKey = currentSortKey.value
    const oldOrder = currentSortOrder.value

    // 三态切换：无 → asc → desc → 无
    let newOrder: 'asc' | 'desc' | '' = ''
    if (oldKey !== key || oldOrder === '') {
      newOrder = 'asc'
    } else if (oldOrder === 'asc') {
      newOrder = 'desc'
    } else {
      newOrder = ''
    }

    const newKey = newOrder ? key : ''

    if (!isControlled.value) {
      innerSortKey.value = newKey
      innerSortOrder.value = newOrder
    }

    options.onSortChange({
      key: newKey,
      order: newOrder,
      column
    })
  }

  /** 判断列是否为当前排序列 */
  const isSortActive = (column: SeeTableColumn<T>): boolean => {
    return currentSortKey.value === column.key && !!currentSortOrder.value
  }

  /** 获取列的排序方向 */
  const getSortOrder = (column: SeeTableColumn<T>): 'asc' | 'desc' | '' | undefined => {
    if (currentSortKey.value !== column.key) return undefined
    return currentSortOrder.value
  }

  // 同步受控值到内部状态（当外部清空时）
  watch(
    () => options.sortKey.value,
    (val) => {
      if (!val) {
        innerSortKey.value = ''
        innerSortOrder.value = ''
      }
    }
  )

  return {
    currentSortKey,
    currentSortOrder,
    sortedData,
    handleSort,
    isSortActive,
    getSortOrder
  }
}
