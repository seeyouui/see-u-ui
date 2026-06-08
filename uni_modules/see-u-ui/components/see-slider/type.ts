/** Slider 组件尺寸 */
export type SliderSize = 'small' | 'default' | 'large'

/** 轨道位置信息 */
export interface TrackRect {
  left: number
  top: number
  width: number
  height: number
}

/** Slider 组件 Props */
export interface SliderProps {
  /** 绑定值（v-model，支持范围选择时为 [min, max]） */
  modelValue?: number | number[]
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否范围选择 */
  isRange?: boolean
  /** 是否垂直模式 */
  isVertical?: boolean
  /** 进度条高度，单位 px */
  barHeight?: number
  /** 已选部分颜色 */
  activeColor?: string
  /** 未选部分颜色 */
  inactiveColor?: string
  /** 是否显示当前值 */
  isShowValue?: boolean
  /** 是否显示步长刻度 */
  isShowStep?: boolean
  /** 尺寸 */
  size?: SliderSize
  /** 表单字段名 */
  name?: string
}

/** Slider 组件事件 */
export interface SliderEmits {
  /** 值变化时触发 */
  onChange: (value: number | number[]) => void
  /** 开始拖动时触发 */
  onDragStart: () => void
  /** 结束拖动时触发 */
  onDragEnd: () => void
}

export type { FormContext } from '../../utils/shared/form-types'
