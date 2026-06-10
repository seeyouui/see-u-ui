/**
 * useTableSelection
 * @description 表格行选择逻辑：多选、全选、受控/非受控、半选状态
 */
import { computed, ref, type Ref } from 'vue'

export interface UseTableSelectionOptions<T = unknown> {
  /** 当前展示数据（可能经过排序/分页） */
  data: Ref<T[]>
  /** 行唯一标识字段或函数 */
  rowKey: Ref<string | ((row: T, index: number) => string | number)>
  /** 受控选中 key 列表 */
  selectedKeys: Ref<Array<string | number>>
  /** 默认选中 key 列表（非受控） */
  defaultSelectedKeys: Ref<Array<string | number>>
  /** 是否显式传入了 selectedKeys（区分未传和传了空数组） */
  selectedKeysProvided?: Ref<boolean>
  /** 选中变更事件 */
  onSelectionChange: (selectedKeys: Array<string | number>, selectedRows: T[]) => void
}

export interface UseTableSelectionReturn<T = unknown> {
  /** 当前选中的 key 集合（便于快速查找） */
  selectedKeySet: Ref<Set<string | number>>
  /** 是否全选 */
  isAllSelected: Ref<boolean>
  /** 是否半选（部分选中） */
  isIndeterminate: Ref<boolean>
  /** 切换某行选中状态 */
  toggleRow: (row: T, rowIndex: number) => void
  /** 切换全选 */
  toggleAll: () => void
  /** 判断某行是否选中 */
  isRowSelected: (row: T, rowIndex: number) => boolean
}

export function useTableSelection<T = unknown>(options: UseTableSelectionOptions<T>): UseTableSelectionReturn<T> {
  // 非受控内部状态
  const innerSelectedKeys = ref<Array<string | number>>([...options.defaultSelectedKeys.value])

  // 受控判断：通过 options 中的 provided 标记区分"未传"和"传了空数组"
  const isControlled = computed(() => options.selectedKeysProvided?.value ?? false)

  // 当前选中的 key 列表
  const currentKeys = computed(() => (isControlled.value ? options.selectedKeys.value : innerSelectedKeys.value))

  // 选中 key 集合
  const selectedKeySet = computed(() => new Set(currentKeys.value))

  // 获取行的 key
  const getRowKey = (row: T, index: number): string | number => {
    const rk = options.rowKey.value
    if (typeof rk === 'function') return rk(row, index)
    if (rk && typeof row === 'object' && row !== null) {
      return ((row as Record<string, unknown>)[rk] as string | number) ?? index
    }
    return index
  }

  // 当前数据的所有 key
  const allDataKeys = computed(() => {
    return options.data.value.map((row, index) => getRowKey(row, index))
  })

  // 是否全选
  const isAllSelected = computed(() => {
    const keys = allDataKeys.value
    if (keys.length === 0) return false
    const set = selectedKeySet.value
    return keys.every((k) => set.has(k))
  })

  // 是否半选
  const isIndeterminate = computed(() => {
    const keys = allDataKeys.value
    if (keys.length === 0) return false
    const set = selectedKeySet.value
    const selectedCount = keys.filter((k) => set.has(k)).length
    return selectedCount > 0 && selectedCount < keys.length
  })

  /** 判断某行是否选中 */
  const isRowSelected = (row: T, rowIndex: number): boolean => {
    return selectedKeySet.value.has(getRowKey(row, rowIndex))
  }

  /** 切换某行选中状态 */
  const toggleRow = (row: T, rowIndex: number) => {
    const key = getRowKey(row, rowIndex)
    const oldKeys = [...currentKeys.value]
    const set = new Set(oldKeys)

    if (set.has(key)) {
      set.delete(key)
    } else {
      set.add(key)
    }

    const newKeys = Array.from(set)
    const newRows = options.data.value.filter((r, i) => set.has(getRowKey(r, i)))

    if (!isControlled.value) {
      innerSelectedKeys.value = newKeys
    }

    options.onSelectionChange(newKeys, newRows)
  }

  /** 切换全选 */
  const toggleAll = () => {
    const keys = allDataKeys.value
    const set = selectedKeySet.value
    const allSelected = keys.length > 0 && keys.every((k) => set.has(k))

    let newKeys: Array<string | number>
    if (allSelected) {
      // 取消全选：移除当前数据页的所有 key
      const removeSet = new Set(keys)
      newKeys = currentKeys.value.filter((k) => !removeSet.has(k))
    } else {
      // 全选：合并当前数据页的所有 key
      const merged = new Set(currentKeys.value)
      keys.forEach((k) => merged.add(k))
      newKeys = Array.from(merged)
    }

    const newRows = options.data.value.filter((r, i) => {
      const rk = getRowKey(r, i)
      return new Set(newKeys).has(rk)
    })

    if (!isControlled.value) {
      innerSelectedKeys.value = newKeys
    }

    options.onSelectionChange(newKeys, newRows)
  }

  return {
    selectedKeySet,
    isAllSelected,
    isIndeterminate,
    toggleRow,
    toggleAll,
    isRowSelected
  }
}
