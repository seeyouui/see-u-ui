/**
 * useTableExpand
 * @description 表格展开行逻辑：受控/非受控、toggle 展开/收起
 */
import { computed, ref, type Ref } from 'vue'

export interface UseTableExpandOptions<T = unknown> {
  /** 行唯一标识字段或函数 */
  rowKey: Ref<string | ((row: T, index: number) => string | number)>
  /** 受控展开行 key 列表 */
  expandedKeys: Ref<Array<string | number>>
  /** 是否显式传入了 expandedKeys（区分未传和传了空数组） */
  expandedKeysProvided?: Ref<boolean>
  /** 展开变更事件 */
  onExpandChange: (expandedKeys: Array<string | number>, row: T) => void
}

export interface UseTableExpandReturn<T = unknown> {
  /** 当前展开的 key 集合 */
  expandedKeySet: Ref<Set<string | number>>
  /** 切换某行展开状态 */
  toggleExpand: (row: T, rowIndex: number) => void
  /** 判断某行是否展开 */
  isRowExpanded: (row: T, rowIndex: number) => boolean
}

export function useTableExpand<T = unknown>(options: UseTableExpandOptions<T>): UseTableExpandReturn<T> {
  // 非受控内部状态
  const innerExpandedKeys = ref<Array<string | number>>([])

  // 受控判断：通过 options 中的 provided 标记区分"未传"和"传了空数组"
  const isControlled = computed(() => options.expandedKeysProvided?.value ?? false)

  // 当前展开的 key 列表
  const currentKeys = computed(() => (isControlled.value ? options.expandedKeys.value : innerExpandedKeys.value))

  // 展开 key 集合
  const expandedKeySet = computed(() => new Set(currentKeys.value))

  // 获取行的 key
  const getRowKey = (row: T, index: number): string | number => {
    const rk = options.rowKey.value
    if (typeof rk === 'function') return rk(row, index)
    if (rk && typeof row === 'object' && row !== null) {
      return ((row as Record<string, unknown>)[rk] as string | number) ?? index
    }
    return index
  }

  /** 判断某行是否展开 */
  const isRowExpanded = (row: T, rowIndex: number): boolean => {
    return expandedKeySet.value.has(getRowKey(row, rowIndex))
  }

  /** 切换某行展开状态 */
  const toggleExpand = (row: T, rowIndex: number) => {
    const key = getRowKey(row, rowIndex)
    const oldKeys = [...currentKeys.value]
    const set = new Set(oldKeys)

    if (set.has(key)) {
      set.delete(key)
    } else {
      set.add(key)
    }

    const newKeys = Array.from(set)

    if (!isControlled.value) {
      innerExpandedKeys.value = newKeys
    }

    options.onExpandChange(newKeys, row)
  }

  return {
    expandedKeySet,
    toggleExpand,
    isRowExpanded
  }
}
