/**
 * SeeOverlay 组件属性
 */
export interface SeeOverlayProps {
  /**
   * 是否显示遮罩层（v-model）
   * @default false
   */
  show?: boolean
  /**
   * z-index
   * @default 1000
   */
  zIndex?: number
  /**
   * 背景色
   * @default 'rgba(0, 0, 0, 0.6)'
   */
  background?: string
  /**
   * 透明度
   * @default 1
   */
  opacity?: number
  /**
   * 是否可点击关闭
   * @default true
   */
  clickable?: boolean
  /**
   * 是否启用动画
   * @default true
   */
  isAnimated?: boolean
  /**
   * 动画持续时间（毫秒）
   * @default 300
   */
  duration?: number
}

/**
 * SeeOverlay 组件事件
 */
export interface SeeOverlayEmits {
  onClick: () => void
  onClose: () => void
  onOpen: () => void
  'update:show': (value: boolean) => void
}
