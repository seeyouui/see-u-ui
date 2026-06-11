/**
 * ActionSheet 选项
 */
export interface ActionSheetAction {
  /** 选项文字 */
  name: string
  /** 选项描述 */
  description?: string
  /** 图标 */
  icon?: string
  /** 文字颜色（覆盖默认） */
  color?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 选项值 */
  value?: string | number
}

/**
 * SeeActionSheet 组件属性
 */
export interface SeeActionSheetProps {
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
   * 描述文字
   * @default ''
   */
  description?: string
  /**
   * 选项列表
   * @default []
   */
  actions?: ActionSheetAction[]
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
   * z-index
   * @default 1001
   */
  zIndex?: number
  /**
   * 动画时长
   * @default 300
   */
  duration?: number
  /**
   * 点击遮罩是否关闭
   * @default true
   */
  isCloseOnClickOverlay?: boolean
  /**
   * 是否圆角
   * @default true
   */
  isRound?: boolean
  /**
   * 是否适配安全区
   * @default true
   */
  isSafeArea?: boolean
  /**
   * 关闭前钩子
   * @default null
   */
  beforeClose?: (() => boolean | Promise<boolean>) | null
}

/**
 * SeeActionSheet 组件事件
 */
export interface SeeActionSheetEmits {
  /** 选择选项时触发 */
  onSelect: (action: ActionSheetAction, index: number) => void
  /** 点击取消时触发 */
  onCancel: () => void
  /** 打开时触发 */
  onOpen: () => void
  /** 关闭时触发 */
  onClose: () => void
  /** v-model 更新 */
  'update:show': (value: boolean) => void
}
