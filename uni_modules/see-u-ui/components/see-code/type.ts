/**
 * SeeCode 验证码输入框组件类型定义
 * @description 验证码输入框的类型声明
 */

/** 验证码显示类型 */
export type CodeType = 'box' | 'line' | 'bottom'

/** 验证码尺寸 */
export type CodeSize = 'small' | 'default' | 'large'

/** 键盘类型 */
export type CodeKeyboard = 'number' | 'text'

/** SeeCode Props */
export interface SeeCodeProps {
  /** 绑定值（v-model） */
  modelValue?: string
  /** 验证码长度 */
  length?: number
  /** 是否自动聚焦 */
  isFocus?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 尺寸 */
  size?: CodeSize
  /** 显示类型：方框/底线/下划线 */
  type?: CodeType
  /** 输入时是否遮罩（显示为圆点） */
  isMask?: boolean
  /** 格子间距，单位 rpx */
  gap?: number
  /** 表单字段名 */
  name?: string
  /** 键盘类型 */
  keyboard?: CodeKeyboard
  /** 是否显示光标闪烁动画 */
  isCursor?: boolean
}

/** SeeCode Events */
export interface SeeCodeEmits {
  /** 值变化时触发 */
  onChange: (value: string) => void
  /** 输入完成时触发（达到指定长度） */
  onComplete: (value: string) => void
  /** 聚焦时触发 */
  onFocus: () => void
  /** 失焦时触发 */
  onBlur: () => void
  /** v-model 更新 */
  'update:modelValue': (value: string) => void
}

/** Form 注入的上下文类型 */
export interface FormContext {
  /** 表单禁用状态 */
  isDisabled?: boolean
  /** 表单只读状态 */
  isReadonly?: boolean
  /** 表单尺寸 */
  size?: CodeSize
}
