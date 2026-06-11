/**
 * Modal 确认按钮类型
 */
export type ModalConfirmType = 'primary' | 'danger' | 'warning'

/**
 * SeeModal 组件属性
 */
export interface SeeModalProps {
  /**
   * 是否显示（v-model）
   * @default false
   */
  show?: boolean
  /**
   * 标题
   * @default ''
   */
  title?: string
  /**
   * 内容文字
   * @default ''
   */
  content?: string
  /**
   * 是否显示标题栏
   * @default true
   */
  isShowHeader?: boolean
  /**
   * 是否显示底部按钮区
   * @default true
   */
  isShowFooter?: boolean
  /**
   * 确认按钮文字
   * @default '确认'
   */
  confirmText?: string
  /**
   * 取消按钮文字
   * @default '取消'
   */
  cancelText?: string
  /**
   * 是否显示取消按钮
   * @default true
   */
  isShowCancelBtn?: boolean
  /**
   * 确认按钮类型
   * @default 'primary'
   */
  confirmType?: ModalConfirmType
  /**
   * 确认按钮是否加载中
   * @default false
   */
  isConfirmLoading?: boolean
  /**
   * 确认按钮是否禁用
   * @default false
   */
  isConfirmDisabled?: boolean
  /**
   * 模态框宽度
   * @default '600rpx'
   */
  width?: string
  /**
   * z-index
   * @default 1001
   */
  zIndex?: number
  /**
   * 动画时长(ms)
   * @default 300
   */
  duration?: number
  /**
   * 点击遮罩是否关闭
   * @default false
   */
  isCloseOnClickOverlay?: boolean
  /**
   * 是否锁定背景滚动
   * @default true
   */
  isLockScroll?: boolean
  /**
   * 关闭前钩子，接收触发来源 action 参数
   * @default null
   */
  beforeClose?: ((action: 'confirm' | 'cancel') => boolean | Promise<boolean>) | null
}

/**
 * SeeModal 组件事件
 */
export interface SeeModalEmits {
  /** 点击确认按钮 */
  onConfirm: () => void
  /** 点击取消按钮 */
  onCancel: () => void
  /** 打开时触发 */
  onOpen: () => void
  /** 打开动画结束 */
  onOpened: () => void
  /** 关闭时触发 */
  onClose: () => void
  /** 关闭动画结束 */
  onClosed: () => void
  /** v-model 更新 */
  'update:show': (value: boolean) => void
}

/**
 * Modal 命令式选项
 */
export interface ModalOptions {
  /** 标题 */
  title?: string
  /** 内容文字 */
  content?: string
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 是否显示取消按钮 */
  isShowCancelBtn?: boolean
  /** 确认按钮类型 */
  confirmType?: ModalConfirmType
  /** 点击遮罩是否关闭 */
  isCloseOnClickOverlay?: boolean
  /** 关闭前钩子 */
  beforeClose?: (action: 'confirm' | 'cancel') => boolean | Promise<boolean>
}

/**
 * Modal 命令式调用结果
 */
export interface ModalResult {
  /** 是否点击了确认 */
  confirm: boolean
  /** 是否点击了取消 */
  cancel: boolean
}
