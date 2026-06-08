/** Switch 组件尺寸 */
export type SwitchSize = 'small' | 'default' | 'large'

/** Switch 组件 Props */
export interface SwitchProps {
  /** 绑定值 */
  modelValue?: boolean | string | number
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 尺寸 */
  size?: SwitchSize
  /** 选中时背景色 */
  activeColor?: string
  /** 未选中时背景色 */
  inactiveColor?: string
  /** 选中时的值 */
  activeValue?: boolean | string | number
  /** 未选中时的值 */
  inactiveValue?: boolean | string | number
  /** 选中时的文字描述 */
  activeText?: string
  /** 未选中时的文字描述 */
  inactiveText?: string
  /** 表单字段名 */
  name?: string
}

/** Switch 组件事件 */
export interface SwitchEmits {
  /** 状态变化时触发 */
  onChange: (value: boolean | string | number) => void
  /** 点击时触发 */
  onClick: () => void
  /** v-model 更新 */
  'update:modelValue': (value: boolean | string | number) => void
}

/** Switch 组件暴露的实例方法 */
export interface SeeSwitchInstance {
  /** 是否激活 */
  isActive: () => boolean
  /** 是否禁用 */
  isDisabled: () => boolean
}

export type { FormContext } from '../../utils/shared/form-types'
