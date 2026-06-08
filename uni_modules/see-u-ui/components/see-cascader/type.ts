/**
 * SeeCascader 组件类型定义
 * @description 级联选择器组件的类型声明
 */

/** 级联选项 */
export interface CascaderOption {
  /** 选项值 */
  value: string | number
  /** 选项文本 */
  text: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否叶子节点（懒加载模式下使用） */
  isLeaf?: boolean
  /** 子选项列表 */
  children?: CascaderOption[]
  /**
   * 额外数据（可存放任意字段）
   * 注意：此索引签名允许传入自定义扩展字段，使用时请确保类型安全
   */
  [key: string]: unknown
}

/** 级联选择器尺寸 */
export type CascaderSize = 'small' | 'default' | 'large'

/** 内部使用的节点（带父级引用和层级信息） */
export interface CascaderNode {
  /** 原始选项 */
  option: CascaderOption
  /** 所在层级（从 0 开始） */
  level: number
  /** 是否选中 */
  isSelected: boolean
  /** 是否为叶子节点 */
  isLeaf: boolean
  /** 是否禁用 */
  isDisabled: boolean
  /** 值 */
  value: string | number
  /** 文本 */
  text: string
}

/** 每一层级的面板数据 */
export interface CascaderPanel {
  /** 层级索引 */
  level: number
  /** 当前层级下的选项列表 */
  nodes: CascaderNode[]
  /** 当前层级选中的值 */
  selectedValue?: string | number
  /** 当前层级选中的文本 */
  selectedText?: string
  /** 是否正在加载 */
  isLoading: boolean
}

/** Tab 信息 */
export interface CascaderTab {
  /** tab 索引 */
  index: number
  /** tab 标签文本 */
  text: string
  /** 是否可选中 */
  isActive: boolean
}

export type { FormContext } from '../../utils/shared/form-types'

/** SeeCascader Props */
export interface SeeCascaderProps {
  /** 选中值路径数组 */
  modelValue?: (string | number)[]
  /** 选项数据 */
  options?: CascaderOption[]
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否显示 toolbar */
  isShowToolbar?: boolean
  /** toolbar 标题 */
  toolbarTitle?: string
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 值键名 */
  valueKey?: string
  /** 标签键名 */
  labelKey?: string
  /** 子选项键名 */
  childrenKey?: string
  /** 是否懒加载子选项 */
  isLazy?: boolean
  /** 懒加载函数 */
  lazyLoad?: (node: CascaderOption) => Promise<CascaderOption[]>
  /** 尺寸 */
  size?: CascaderSize
  /** 是否显示边框 */
  isBorder?: boolean
  /** 表单字段名 */
  name?: string
  /** 是否显示标签页 */
  isShowTab?: boolean
}

/** SeeCascader Events */
export interface SeeCascaderEmits {
  /** 值变化时触发 */
  onChange: (value: (string | number)[]) => void
  /** 确认时触发 */
  onConfirm: (value: (string | number)[]) => void
  /** 取消时触发 */
  onCancel: () => void
  /** 切换层级 tab 时触发 */
  onTabChange: (index: number) => void
  /** v-model 更新 */
  'update:modelValue': (value: (string | number)[]) => void
}
