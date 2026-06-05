/**
 * SeeKeyboard 自定义键盘组件类型定义
 * @description 自定义键盘的类型声明
 */

/** 键盘类型 */
export type KeyboardType = 'number' | 'card' | 'idcard' | 'text'

/** 键盘按键类型 */
export type KeyType = 'key' | 'delete' | 'confirm' | 'space' | 'shift' | 'toggle'

/** 键盘按键定义 */
export interface KeyboardKey {
  /** 按键显示文本 */
  label: string
  /** 按键实际值（输出到外部的值） */
  value: string
  /** 按键类型 */
  type: KeyType
  /** 按键宽度比例（默认 1） */
  width?: number
  /** 是否禁用 */
  disabled?: boolean
}

/** 文本键盘模式 */
export type TextKeyboardMode = 'letter' | 'number' | 'symbol'

/** SeeKeyboard Props */
export interface SeeKeyboardProps {
  /** 是否显示键盘（v-model） */
  modelValue?: boolean
  /** 键盘类型 */
  type?: KeyboardType
  /** 是否显示顶部 toolbar */
  isShowToolbar?: boolean
  /** 确认按钮文字 */
  confirmText?: string
  /** 是否显示确认按钮 */
  isShowConfirm?: boolean
  /** 是否显示删除按钮 */
  isShowDelete?: boolean
  /** 数字是否随机排列（安全键盘） */
  isRandom?: boolean
  /** 是否显示遮罩层 */
  isOverlay?: boolean
  /** 遮罩层自定义样式 */
  overlayStyle?: Record<string, any>
  /** 点击遮罩是否关闭 */
  isCloseOnClickOverlay?: boolean
  /** 是否适配底部安全区域 */
  isSafeArea?: boolean
  /** toolbar 标题 */
  title?: string
}

/** SeeKeyboard Events */
export interface SeeKeyboardEmits {
  /** 按键输入时触发 */
  onInput: (key: string) => void
  /** 删除时触发 */
  onDelete: () => void
  /** 确认时触发 */
  onConfirm: () => void
  /** 关闭时触发 */
  onClose: () => void
  /** 打开时触发 */
  onOpen: () => void
  /** v-model 更新 */
  'update:modelValue': (value: boolean) => void
}
