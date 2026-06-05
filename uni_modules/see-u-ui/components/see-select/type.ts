/**
 * SeeSelect 组件类型定义
 * @description 选择器组件的类型声明，支持单选、多选、搜索过滤、远程搜索、分组
 */

/** 选择器选项 */
export interface SelectOption {
  /** 显示文字 */
  label: string
  /** 选项值 */
  value: string | number
  /** 是否禁用 */
  isDisabled?: boolean
  /** 子选项（分组时使用） */
  children?: SelectOption[]
}

/** 选择器尺寸 */
export type SelectSize = 'small' | 'default' | 'large'

/** SeeSelect Props */
export interface SeeSelectProps {
  /** 绑定值（v-model） */
  modelValue?: string | number | (string | number)[]
  /** 选项列表 */
  options?: SelectOption[]
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否可清除 */
  isClearable?: boolean
  /** 是否多选 */
  isMultiple?: boolean
  /** 是否可搜索 */
  isFilterable?: boolean
  /** 自定义过滤方法 */
  filterMethod?: (query: string, option: SelectOption) => boolean
  /** 是否远程搜索 */
  isRemote?: boolean
  /** 远程搜索方法 */
  remoteMethod?: (query: string) => void
  /** 是否加载中 */
  loading?: boolean
  /** 尺寸 */
  size?: SelectSize
  /** 多选时最多显示标签数 */
  maxTagCount?: number
  /** 是否显示边框（默认 true） */
  isBorder?: boolean
  /** 表单字段名 */
  name?: string
  /** 选项值的键名（默认 'value'） */
  valueKey?: string
  /** 选项标签的键名（默认 'label'） */
  labelKey?: string
}

/** SeeSelect Events */
export interface SeeSelectEmits {
  /** 值变化时触发 */
  onChange: (value: string | number | (string | number)[]) => void
  /** 下拉框显示/隐藏时触发 */
  onVisibleChange: (visible: boolean) => void
  /** 多选移除标签时触发 */
  onRemoveTag: (value: string | number) => void
  /** 清除时触发 */
  onClear: () => void
  /** 搜索时触发 */
  onSearch: (query: string) => void
  /** v-model 更新 */
  'update:modelValue': (value: string | number | (string | number)[]) => void
}

export type { FormContext } from '../../utils/shared/form-types'
