/**
 * useTableTree
 * @description 表格树形数据逻辑：递归 flatten、展开/收起、缩进、叶子节点判断
 */
import { computed, ref, watch, type Ref } from 'vue'

export interface UseTableTreeOptions<T = unknown> {
  /** 原始数据（树形结构） */
  data: Ref<T[]>
  /** 子节点字段名 */
  childrenField: Ref<string>
  /** 是否默认展开所有 */
  defaultExpandAll: Ref<boolean>
  /** 行唯一标识字段或函数 */
  rowKey: Ref<string | ((row: T, index: number) => string | number)>
}

/** 扁平化后的行信息 */
export interface TreeFlatRow<T = unknown> {
  /** 原始行数据 */
  row: T
  /** 在原始数据中的索引（用于 getRowKey） */
  originalIndex: number
  /** 树形层级深度（从 0 开始） */
  depth: number
  /** 是否有子节点 */
  hasChildren: boolean
  /** 是否为最后一个子节点（用于缩进线绘制） */
  isLast: boolean
  /** 父级路径的 isLast 标记（用于绘制缩进线） */
  parentLastFlags: boolean[]
}

export interface UseTableTreeReturn<T = unknown> {
  /** 扁平化后的可见行列表 */
  flatRows: Ref<TreeFlatRow<T>[]>
  /** 展开的节点 key 集合 */
  expandedKeySet: Ref<Set<string | number>>
  /** 切换节点展开/收起 */
  toggleExpand: (row: T, originalIndex: number) => void
  /** 判断节点是否展开 */
  isNodeExpanded: (row: T, originalIndex: number) => boolean
  /** 判断节点是否有子节点 */
  hasChildren: (row: T, childrenField: string) => boolean
}

/** 获取行的 key */
function getRowKeyValue<T>(row: T, index: number, rowKey: string | ((row: T, index: number) => string | number)): string | number {
  if (typeof rowKey === 'function') return rowKey(row, index)
  if (rowKey && typeof row === 'object' && row !== null) {
    return ((row as Record<string, unknown>)[rowKey] as string | number) ?? index
  }
  // 无 rowKey 时，用 JSON 序列化作为唯一标识，避免 index 冲突
  if (typeof row === 'object' && row !== null) {
    return JSON.stringify(row)
  }
  return index
}

export function useTableTree<T = unknown>(options: UseTableTreeOptions<T>): UseTableTreeReturn<T> {
  // 展开的节点 key 集合
  const expandedKeys = ref<Set<string | number>>(new Set())

  // 收集所有节点的 key（用于 defaultExpandAll）
  const allNodeKeys = computed(() => {
    const keys: Array<string | number> = []
    let globalIndex = 0
    const walk = (items: T[]) => {
      items.forEach((item) => {
        const key = getRowKeyValue(item, globalIndex, options.rowKey.value)
        keys.push(key)
        globalIndex++
        const childrenField = options.childrenField.value
        const children = (item as Record<string, unknown>)[childrenField]
        if (Array.isArray(children) && children.length > 0) {
          walk(children as T[])
        }
      })
    }
    walk(options.data.value)
    return keys
  })

  // 初始化展开状态
  const initialized = ref(false)
  watch(
    () => options.defaultExpandAll.value,
    (val) => {
      if (val) {
        expandedKeys.value = new Set(allNodeKeys.value)
      }
      initialized.value = true
    },
    { immediate: true }
  )

  // 如果 defaultExpandAll 为 false，也需要初始化
  if (!initialized.value) {
    initialized.value = true
  }

  /** 判断节点是否有子节点 */
  const hasChildrenFn = (row: T, childrenField: string): boolean => {
    if (typeof row !== 'object' || row === null) return false
    const children = (row as Record<string, unknown>)[childrenField]
    return Array.isArray(children) && children.length > 0
  }

  /** 判断节点是否展开 */
  const isNodeExpanded = (row: T, originalIndex: number): boolean => {
    const key = getRowKeyValue(row, originalIndex, options.rowKey.value)
    return expandedKeys.value.has(key)
  }

  /** 切换节点展开/收起 */
  const toggleExpand = (row: T, originalIndex: number) => {
    const key = getRowKeyValue(row, originalIndex, options.rowKey.value)
    const newSet = new Set(expandedKeys.value)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    expandedKeys.value = newSet
  }

  /** 扁平化树形数据 */
  const flatRows = computed(() => {
    const result: TreeFlatRow<T>[] = []
    const childrenField = options.childrenField.value

    const walk = (items: T[], depth: number, parentLastFlags: boolean[]) => {
      items.forEach((item, i) => {
        const isLast = i === items.length - 1
        const children = hasChildrenFn(item, childrenField) ? ((item as Record<string, unknown>)[childrenField] as T[]) : []
        const expanded = isNodeExpanded(item, 0) // originalIndex 在这里不重要，因为 key 来自 row 本身

        result.push({
          row: item,
          originalIndex: 0, // 占位，实际 key 由 row 决定
          depth,
          hasChildren: children.length > 0,
          isLast,
          parentLastFlags: [...parentLastFlags]
        })

        if (children.length > 0 && expanded) {
          walk(children, depth + 1, [...parentLastFlags, isLast])
        }
      })
    }

    walk(options.data.value, 0, [])
    return result
  })

  return {
    flatRows,
    expandedKeySet: expandedKeys,
    toggleExpand,
    isNodeExpanded,
    hasChildren: hasChildrenFn
  }
}
