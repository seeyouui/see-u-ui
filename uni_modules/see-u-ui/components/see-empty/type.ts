/**
 * 空状态类型
 */
export type EmptyType = 'default' | 'search' | 'network' | 'error' | '404' | 'custom'

/**
 * SeeEmpty Props
 */
export interface SeeEmptyProps {
  /** 空状态类型 */
  type?: EmptyType
  /** 自定义图片 */
  image?: string
  /** 标题文字 */
  title?: string
  /** 描述文字 */
  description?: string
  /** 操作按钮文字 */
  actionText?: string
  /** 是否显示操作按钮 */
  isShowAction?: boolean
  /** 图片尺寸 */
  imageSize?: string
}

/**
 * SeeEmpty 事件
 */
export interface SeeEmptyEmits {
  /** 操作按钮点击 */
  (e: 'onAction'): void
}
