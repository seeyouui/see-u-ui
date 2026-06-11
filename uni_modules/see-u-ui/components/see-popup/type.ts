/**
 * Popup 弹出位置
 */
export type PopupPosition = 'top' | 'bottom' | 'left' | 'right' | 'center'

/**
 * SeePopup 组件属性
 */
export interface SeePopupProps {
  /**
   * 是否显示弹出层（v-model）
   * @default false
   */
  show?: boolean
  /**
   * 弹出位置
   * @default 'bottom'
   */
  position?: PopupPosition
  /**
   * z-index
   * @default 1000
   */
  zIndex?: number
  /**
   * 动画时长(ms)
   * @default 300
   */
  duration?: number
  /**
   * 是否显示遮罩
   * @default true
   */
  isOverlay?: boolean
  /**
   * 遮罩背景色
   * @default 'var(--see-overlay-bg)'
   */
  overlayBackground?: string
  /**
   * 遮罩透明度
   * @default 1
   */
  overlayOpacity?: number
  /**
   * 点击遮罩是否关闭
   * @default true
   */
  isCloseOnClickOverlay?: boolean
  /**
   * 是否锁定背景滚动
   * @default true
   */
  isLockScroll?: boolean
  /**
   * 是否显示关闭按钮
   * @default false
   */
  isShowCloseBtn?: boolean
  /**
   * 关闭按钮位置
   * @default 'top-right'
   */
  closeBtnPosition?: string
  /**
   * 是否圆角（top/bottom 弹出时）
   * @default true
   */
  isRound?: boolean
  /**
   * 自定义圆角值
   * @default '32rpx 32rpx 0 0'
   */
  borderRadius?: string
  /**
   * 是否适配安全区
   * @default true
   */
  isSafeArea?: boolean
  /**
   * 是否显示标题栏
   * @default false
   */
  isShowHeader?: boolean
  /**
   * 标题文字
   * @default ''
   */
  title?: string
  /**
   * 过渡动画名称
   * @default 'see-popup'
   */
  transitionName?: string
  /**
   * 是否响应返回键（App/H5）
   * @default true
   */
  isCloseOnPressBack?: boolean
  /**
   * 关闭前钩子，返回 false 可阻止关闭
   * @default null
   */
  beforeClose?: (() => boolean | Promise<boolean>) | null
}

/**
 * SeePopup 组件事件
 */
export interface SeePopupEmits {
  /** 弹出层打开时触发 */
  onOpen: () => void
  /** 弹出层打开动画结束时触发 */
  onOpened: () => void
  /** 弹出层关闭时触发 */
  onClose: () => void
  /** 弹出层关闭动画结束时触发 */
  onClosed: () => void
  /** 点击遮罩时触发 */
  onClickOverlay: () => void
  /** v-model 更新 */
  'update:show': (value: boolean) => void
}
