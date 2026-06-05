/** Rate 评分组件 Props */
export interface RateProps {
  /** 绑定值 */
  modelValue?: number
  /** 星星总数 */
  count?: number
  /** 星星大小，单位 px */
  size?: number
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否允许半星 */
  allowHalf?: boolean
  /** 是否允许再次点击清除 */
  isClearable?: boolean
  /** 选中颜色 */
  color?: string
  /** 未选中颜色 */
  voidColor?: string
  /** 选中图标 */
  icon?: string
  /** 未选中图标 */
  voidIcon?: string
  /** 星星间距，单位 px */
  gap?: number
  /** 表单字段名 */
  name?: string
}

/** Rate 评分组件事件 */
export interface RateEmits {
  /** 分值变化时触发 */
  onChange: (value: number) => void
}

export type { FormContext } from '../../utils/shared/form-types'
