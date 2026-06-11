/**
 * SeeCopy 组件属性
 */
export interface SeeCopyProps {
  /**
   * 要复制的文字
   * @default ''
   */
  text?: string
  /**
   * 复制成功后是否显示 Toast
   * @default true
   */
  isShowToast?: boolean
  /**
   * 成功提示文字
   * @default '复制成功'
   */
  toastMessage?: string
  /**
   * Toast 显示时长
   * @default 1500
   */
  toastDuration?: number
  /**
   * 是否禁用复制
   * @default false
   */
  isDisabled?: boolean
  /**
   * 点击时是否高亮文字
   * @default false
   */
  isHighlight?: boolean
}

/**
 * SeeCopy 组件事件
 */
export interface SeeCopyEmits {
  /** 复制成功时触发 */
  onSuccess: (text: string) => void
  /** 复制失败时触发 */
  onError: (error: Error) => void
  /** 点击时触发（复制前） */
  onClick: (text: string) => void
}

/**
 * Copy 命令式选项
 */
export interface CopyOptions {
  /** 是否显示 Toast */
  showToast?: boolean
  /** 成功提示文字 */
  toastMessage?: string
}
