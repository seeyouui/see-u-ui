/**
 * SeeSearch 组件类型定义
 * @description 搜索框组件的类型声明
 */

/** 搜索框形状 */
export type SearchShape = 'round' | 'square'

/** 搜索框尺寸 */
export type SearchSize = 'small' | 'default' | 'large'

/** SeeSearch Props */
export interface SeeSearchProps {
  /** 绑定值 */
  modelValue?: string
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否显示清除按钮 */
  isClearable?: boolean
  /** 是否显示右侧操作按钮 */
  isShowAction?: boolean
  /** 操作按钮文字 */
  actionText?: string
  /** 是否自动聚焦 */
  isFocus?: boolean
  /** 搜索框形状 */
  shape?: SearchShape
  /** 尺寸 */
  size?: SearchSize
  /** 是否显示边框 */
  isBorder?: boolean
  /** 搜索框背景色 */
  bgColor?: string
  /** 表单字段名 */
  name?: string
}

/** SeeSearch Events */
export interface SeeSearchEmits {
  /** 输入时触发 */
  onInput: (value: string) => void
  /** 值变化时触发 */
  onChange: (value: string) => void
  /** 聚焦时触发 */
  onFocus: (event: { detail: { value: string } }) => void
  /** 失焦时触发 */
  onBlur: (event: { detail: { value: string } }) => void
  /** 清除时触发 */
  onClear: () => void
  /** 搜索时触发（键盘确认） */
  onSearch: (value: string) => void
  /** 取消时触发 */
  onCancel: () => void
  /** v-model 更新 */
  'update:modelValue': (value: string) => void
}

export type { FormContext } from '../../utils/shared/form-types'
