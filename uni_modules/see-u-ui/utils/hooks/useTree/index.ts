import { ref, computed } from 'vue'

/**
 * 树节点
 */
export interface TreeNode {
  id: string | number
  label: string
  children?: TreeNode[]
  isDisabled?: boolean
  isLeaf?: boolean
  icon?: string
  [key: string]: any
}

/**
 * 扁平化节点
 */
export interface FlatNode {
  node: TreeNode
  level: number
  parentKey: string | number | null
  expanded: boolean
  isLeaf: boolean
  hasChildren: boolean
  visible: boolean
  checked: boolean
  indeterminate: boolean
  loading: boolean
}

/**
 * useTree 配置
 */
export interface UseTreeOptions {
  data: ReturnType<typeof ref<TreeNode[]>>
  checkedKeys?: ReturnType<typeof ref<(string | number)[]>>
  expandedKeys?: ReturnType<typeof ref<(string | number)[]>>
  keyField?: string
  labelField?: string
  childrenField?: string
  selectMode?: 'single' | 'multiple' | 'check-cascade'
  isLazy?: boolean
}

/**
 * useTree 返回值
 */
export interface UseTreeReturn {
  flatNodes: ReturnType<typeof ref<FlatNode[]>>
  expandedKeys: ReturnType<typeof ref<Set<string | number>>>
  checkedKeys: ReturnType<typeof ref<Set<string | number>>>
  selectedKey: ReturnType<typeof ref<string | number | null>>
  toggleExpand: (key: string | number) => void
  toggleCheck: (key: string | number) => void
  selectNode: (key: string | number) => void
  expandAll: () => void
  collapseAll: () => void
  filterNodes: (query: string) => void
  loadChildren: (key: string | number, children: TreeNode[]) => void
  getCheckedNodes: () => TreeNode[]
  getExpandedKeys: () => (string | number)[]
  setExpandedKeys: (keys: (string | number)[]) => void
  appendNode: (parentKey: string | number | null, node: TreeNode) => void
  removeNode: (key: string | number) => void
  updateNode: (key: string | number, data: Partial<TreeNode>) => void
}

/**
 * 树形数据管理 Hook
 * @description 提供树形数据的扁平化、展开/折叠、选中/级联、搜索过滤、懒加载等功能
 * @param options 配置选项
 * @returns 树形数据操作方法和状态
 */
export function useTree(options: UseTreeOptions): UseTreeReturn {
  const { data, keyField = 'id', labelField = 'label', childrenField = 'children', isLazy = false } = options

  const expandedKeys = ref(new Set<string | number>())
  const checkedKeys = ref(new Set<string | number>())
  const selectedKey = ref<string | number | null>(null)
  const filterQuery = ref('')
  const loadingKeys = ref(new Set<string | number>())

  /**
   * 深拷贝树节点，避免对外部 props.data 数组的 mutation 操作（splice/Object.assign）污染源数据。
   * 仅在做写入操作（appendNode/removeNode/updateNode/loadChildren）时调用。
   */
  const cloneTree = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((n) => {
      const cloned: TreeNode = { ...n }
      const children = (n as any)[childrenField]
      if (Array.isArray(children)) {
        ;(cloned as any)[childrenField] = cloneTree(children)
      }
      return cloned
    })
  }

  /**
   * 获取节点的 key
   */
  const getNodeKey = (node: TreeNode): string | number => {
    return (node as any)[keyField]
  }

  /**
   * 获取节点的子节点
   */
  const getNodeChildren = (node: TreeNode): TreeNode[] => {
    return (node as any)[childrenField] || []
  }

  /**
   * 判断节点是否有子节点
   */
  const hasChildren = (node: TreeNode): boolean => {
    const children = getNodeChildren(node)
    return children.length > 0 || (isLazy && node.isLeaf !== true)
  }

  /**
   * 判断节点是否为叶子节点
   */
  const isLeaf = (node: TreeNode): boolean => {
    if (node.isLeaf === true) return true
    const children = getNodeChildren(node)
    return children.length === 0 && !isLazy
  }

  /**
   * 节点自身或其任一后代是否命中查询（用于搜索时保留祖先路径可见）
   */
  const matchesQuery = (node: TreeNode, query: string): boolean => {
    const label = String((node as any)[labelField] ?? '').toLowerCase()
    if (label.includes(query)) return true
    const children = getNodeChildren(node)
    for (const child of children) {
      if (matchesQuery(child, query)) return true
    }
    return false
  }

  /**
   * 扁平化树形数据（按需：只递归展开节点的子节点）
   */
  const flattenTree = (nodes: TreeNode[], level: number = 0, parentKey: string | number | null = null): FlatNode[] => {
    const result: FlatNode[] = []
    const query = filterQuery.value ? filterQuery.value.toLowerCase() : ''

    for (const node of nodes) {
      const key = getNodeKey(node)
      const children = getNodeChildren(node)
      const nodeIsLeaf = isLeaf(node)
      const nodeHasChildren = hasChildren(node)
      const expanded = expandedKeys.value.has(key)
      const checked = checkedKeys.value.has(key)
      const loading = loadingKeys.value.has(key)

      // 搜索过滤：命中节点及其祖先路径均可见（防御非字符串 label）
      let visible = true
      if (query) {
        visible = matchesQuery(node, query)
      }

      result.push({
        node,
        level,
        parentKey,
        expanded,
        isLeaf: nodeIsLeaf,
        hasChildren: nodeHasChildren,
        visible,
        checked,
        indeterminate: false,
        loading
      })

      // 如果展开且有子节点，递归扁平化子节点
      if (expanded && children.length > 0) {
        result.push(...flattenTree(children, level + 1, key))
      }
    }

    return result
  }

  /**
   * 扁平化节点列表
   */
  const flatNodes = computed(() => {
    return flattenTree(data.value || [])
  })

  /**
   * 切换展开/折叠
   */
  const toggleExpand = (key: string | number) => {
    if (expandedKeys.value.has(key)) {
      expandedKeys.value.delete(key)
    } else {
      expandedKeys.value.add(key)
    }
    // 触发响应式更新
    expandedKeys.value = new Set(expandedKeys.value)
  }

  /**
   * 切换选中状态
   */
  const toggleCheck = (key: string | number) => {
    if (checkedKeys.value.has(key)) {
      checkedKeys.value.delete(key)
    } else {
      checkedKeys.value.add(key)
    }
    checkedKeys.value = new Set(checkedKeys.value)
  }

  /**
   * 选择节点（单选模式）
   */
  const selectNode = (key: string | number) => {
    selectedKey.value = key
  }

  /**
   * 展开所有节点
   */
  const expandAll = () => {
    const keys = new Set<string | number>()
    const addKeys = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        const key = getNodeKey(node)
        const children = getNodeChildren(node)
        if (children.length > 0) {
          keys.add(key)
          addKeys(children)
        }
      }
    }
    addKeys(data.value || [])
    expandedKeys.value = keys
  }

  /**
   * 折叠所有节点
   */
  const collapseAll = () => {
    expandedKeys.value = new Set()
  }

  /**
   * 过滤节点
   * 命中项若位于折叠子树内，自动展开其所有祖先节点，使匹配项可见。
   */
  const filterNodes = (query: string) => {
    filterQuery.value = query

    const q = query ? query.toLowerCase() : ''
    if (!q) return

    // 收集所有命中节点的祖先 key
    const ancestorsToExpand = new Set<string | number>(expandedKeys.value)
    const walk = (nodes: TreeNode[], ancestors: (string | number)[]) => {
      for (const node of nodes) {
        const label = String((node as any)[labelField] ?? '').toLowerCase()
        if (label.includes(q)) {
          ancestors.forEach((k) => ancestorsToExpand.add(k))
        }
        const children = getNodeChildren(node)
        if (children.length > 0) {
          walk(children, [...ancestors, getNodeKey(node)])
        }
      }
    }
    walk(data.value || [], [])
    expandedKeys.value = ancestorsToExpand
  }

  /**
   * 懒加载子节点
   */
  const loadChildren = (key: string | number, children: TreeNode[]) => {
    loadingKeys.value.delete(key)
    loadingKeys.value = new Set(loadingKeys.value)

    // 在副本上写入，避免污染外部 props.data
    const cloned = cloneTree(data.value || [])
    const findAndAddChildren = (nodes: TreeNode[]): boolean => {
      for (const node of nodes) {
        if (getNodeKey(node) === key) {
          ;(node as any)[childrenField] = children
          return true
        }
        const nodeChildren = getNodeChildren(node)
        if (nodeChildren.length > 0 && findAndAddChildren(nodeChildren)) {
          return true
        }
      }
      return false
    }

    findAndAddChildren(cloned)
    data.value = cloned
    expandedKeys.value.add(key)
    expandedKeys.value = new Set(expandedKeys.value)
  }

  /**
   * 获取选中的节点
   */
  const getCheckedNodes = (): TreeNode[] => {
    const result: TreeNode[] = []
    const findChecked = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (checkedKeys.value.has(getNodeKey(node))) {
          result.push(node)
        }
        const children = getNodeChildren(node)
        if (children.length > 0) {
          findChecked(children)
        }
      }
    }
    findChecked(data.value || [])
    return result
  }

  /**
   * 获取展开的 key 列表
   */
  const getExpandedKeys = (): (string | number)[] => {
    return Array.from(expandedKeys.value)
  }

  /**
   * 设置展开的 key 列表
   */
  const setExpandedKeys = (keys: (string | number)[]) => {
    expandedKeys.value = new Set(keys)
  }

  /**
   * 添加节点
   */
  const appendNode = (parentKey: string | number | null, node: TreeNode) => {
    // 在副本上写入，避免污染外部 props.data
    const cloned = cloneTree(data.value || [])
    if (parentKey === null) {
      cloned.push(node)
    } else {
      const findAndAppend = (nodes: TreeNode[]): boolean => {
        for (const n of nodes) {
          if (getNodeKey(n) === parentKey) {
            if (!(n as any)[childrenField]) {
              ;(n as any)[childrenField] = []
            }
            ;(n as any)[childrenField].push(node)
            return true
          }
          const children = getNodeChildren(n)
          if (children.length > 0 && findAndAppend(children)) {
            return true
          }
        }
        return false
      }
      findAndAppend(cloned)
    }
    data.value = cloned
  }

  /**
   * 移除节点
   */
  const removeNode = (key: string | number) => {
    // 在副本上写入，避免污染外部 props.data
    const cloned = cloneTree(data.value || [])
    const findAndRemove = (nodes: TreeNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (getNodeKey(nodes[i]) === key) {
          nodes.splice(i, 1)
          return true
        }
        const children = getNodeChildren(nodes[i])
        if (children.length > 0 && findAndRemove(children)) {
          return true
        }
      }
      return false
    }
    findAndRemove(cloned)
    data.value = cloned
  }

  /**
   * 更新节点
   */
  const updateNode = (key: string | number, updateData: Partial<TreeNode>) => {
    // 在副本上写入，避免污染外部 props.data
    const cloned = cloneTree(data.value || [])
    const findAndUpdate = (nodes: TreeNode[]): boolean => {
      for (const node of nodes) {
        if (getNodeKey(node) === key) {
          Object.assign(node, updateData)
          return true
        }
        const children = getNodeChildren(node)
        if (children.length > 0 && findAndUpdate(children)) {
          return true
        }
      }
      return false
    }
    findAndUpdate(cloned)
    data.value = cloned
  }

  return {
    flatNodes,
    expandedKeys,
    checkedKeys,
    selectedKey,
    toggleExpand,
    toggleCheck,
    selectNode,
    expandAll,
    collapseAll,
    filterNodes,
    loadChildren,
    getCheckedNodes,
    getExpandedKeys,
    setExpandedKeys,
    appendNode,
    removeNode,
    updateNode
  }
}
