/**
 * 分段器选项
 */
export interface SubsectionOption {
  /** 显示文字 */
  label: string
  /** 选项值 */
  value: string | number
  /** 是否禁用 */
  isDisabled?: boolean
}

/**
 * SeeSubsection Props
 */
export interface SeeSubsectionProps {
  /** 当前选中的值 */
  modelValue?: string | number
  /** 选项列表 */
  options?: SubsectionOption[]
  /** 样式类型 */
  type?: 'default' | 'button' | 'pill'
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 选中时背景色 */
  activeColor?: string
  /** 是否全部禁用 */
  isDisabled?: boolean
  /** 是否占满整行宽度 */
  isFullWidth?: boolean
}

/**
 * SeeSubsection 事件
 */
export interface SeeSubsectionEmits {
  /** 选项切换 */
  (e: 'onChange', value: string | number, option: SubsectionOption): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string | number): void
}
