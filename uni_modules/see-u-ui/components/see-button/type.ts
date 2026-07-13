export type TouchEvent = {
  touches: Array<{ clientX: number; clientY: number }>
  changedTouches: Array<{ clientX: number; clientY: number }>
  detail?: {
    clientX?: number
    clientY?: number
  }
  // H5 click (MouseEvent) 直接携带坐标
  clientX?: number
  clientY?: number
}

export type ClientRectData = {
  id?: string
  dataset?: Record<string, string>

  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number

  finalWidth?: number
}

export interface RippleItem {
  id: number
  x: number
  y: number
  size: number
}

/** 按钮尺寸 */
export type ButtonSize = 'default' | 'large' | 'small' | 'mini'

/** 按钮预置类型 */
export type ButtonType = 'info' | 'primary' | 'error' | 'warning' | 'success'

/** SeeButton Props */
export interface SeeButtonProps {
  /** 按钮文本内容 */
  title?: string
  /** 是否加载中状态 */
  loading?: boolean
  /** 加载中文案（默认跟随语言） */
  loadingText?: string
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 按钮预置样式类型 */
  type?: ButtonType
  /** 自定义背景色（会覆盖 type 的默认颜色） */
  color?: string
  /** 文本颜色 */
  textColor?: string
  /** 是否启用水波纹点击效果 */
  isRipple?: boolean
  /** 水波纹扩散动画时长（毫秒） */
  rippleTime?: number
  /** 水波纹淡出遮罩时长（毫秒，建议为 rippleTime 的 2 倍） */
  maskTime?: number
  /** 是否为镂空按钮（反色按钮） */
  isHollow?: boolean
  /** 点击产生的涟漪颜色 */
  rippleColor?: string
  /** 涟漪的自定义 style */
  rippleStyle?: import('vue').CSSProperties | null
  /** 自定义按钮 style */
  customStyle?: import('vue').CSSProperties | null
  /** 点击时的 hover 样式 class（H5 & 小程序有效） */
  hoverClass?: string | null
  /** 边框开关（1 有边框，0 无边框） */
  border?: 1 | 0
  /** 是否禁用按钮 */
  isDisabled?: boolean
  /** 按钮圆角（px） */
  radius?: number
}

/** SeeButton Events */
export interface SeeButtonEmits {
  /** 点击按钮时触发（禁用/loading 状态下不触发） */
  click: (event: unknown) => void
}
