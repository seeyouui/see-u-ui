export type { TreeNode, FlatNode } from '../../utils/hooks/useTree'

/**
 * SeeTree Props
 */
export interface SeeTreeProps {
  /** 树形数据 */
  data?: import('../../utils/hooks/useTree').TreeNode[]
  /** 选中的节点 key 列表 */
  modelValue?: (string | number)[]
  /** 选择模式 */
  selectMode?: 'single' | 'multiple' | 'check-cascade'
  /** 子节点字段名 */
  childrenField?: string
  /** 标签字段名 */
  labelField?: string
  /** 主键字段名 */
  keyField?: string
  /** 是否启用手风琴模式 */
  isAccordion?: boolean
  /** 是否显示连接线 */
  isShowConnector?: boolean
  /** 是否显示复选框 */
  isCheckable?: boolean
  /** 是否默认展开所有节点 */
  isExpandAll?: boolean
  /** 是否可搜索 */
  isFilterable?: boolean
  /** 是否启用懒加载 */
  isLazy?: boolean
  /** 是否启用虚拟滚动 */
  isVirtual?: boolean
  /** 虚拟滚动可视区域高度 */
  virtualHeight?: number
  /** 节点高度（虚拟滚动用） */
  nodeHeight?: number
  /** 缩进量（px） */
  indent?: number
  /** 空数据提示文字 */
  emptyText?: string
}

/**
 * SeeTree 事件
 */
export interface SeeTreeEmits {
  /** 节点点击 */
  (e: 'onNodeClick', node: import('../../utils/hooks/useTree').TreeNode): void
  /** 节点展开/折叠 */
  (e: 'onNodeExpand', node: import('../../utils/hooks/useTree').TreeNode, expanded: boolean): void
  /** 选中状态变更 */
  (e: 'onCheckChange', checkedKeys: (string | number)[], node: import('../../utils/hooks/useTree').TreeNode): void
  /** 懒加载触发 */
  (
    e: 'onLazyLoad',
    node: import('../../utils/hooks/useTree').TreeNode,
    resolve: (children: import('../../utils/hooks/useTree').TreeNode[]) => void
  ): void
  /** 搜索触发 */
  (e: 'onSearch', query: string, filteredNodes: import('../../utils/hooks/useTree').TreeNode[]): void
  /** v-model 更新（单选为选中 key，可勾选为勾选 key 列表） */
  (e: 'update:modelValue', value: (string | number)[]): void
}

/**
 * SeeTree 暴露方法
 */
export interface SeeTreeExpose {
  /** 获取选中的节点 */
  getCheckedNodes: () => import('../../utils/hooks/useTree').TreeNode[]
  /** 获取展开的 key 列表 */
  getExpandedKeys: () => (string | number)[]
  /** 设置展开的 key 列表 */
  setExpandedKeys: (keys: (string | number)[]) => void
  /** 展开所有节点 */
  expandAll: () => void
  /** 折叠所有节点 */
  collapseAll: () => void
  /** 过滤节点 */
  filter: (query: string) => void
  /** 滚动到指定节点 */
  scrollToNode: (key: string | number) => void
  /** 添加节点 */
  appendNode: (parentKey: string | number | null, node: import('../../utils/hooks/useTree').TreeNode) => void
  /** 移除节点 */
  removeNode: (key: string | number) => void
  /** 更新节点 */
  updateNode: (key: string | number, data: Partial<import('../../utils/hooks/useTree').TreeNode>) => void
}
