/**
 * 步骤项配置
 */
export interface StepItem {
  /** 步骤标题 */
  title: string
  /** 步骤描述 */
  description?: string
  /** 步骤图标 */
  icon?: string
  /** 步骤状态 */
  status?: 'wait' | 'process' | 'finish' | 'error'
}

/**
 * SeeSteps Props
 */
export interface SeeStepsProps {
  /** 当前步骤索引 */
  modelValue?: number
  /** 步骤列表 */
  steps?: StepItem[]
  /** 方向 */
  direction?: 'horizontal' | 'vertical'
  /** 激活时颜色 */
  activeColor?: string
  /** 未激活时颜色 */
  inactiveColor?: string
  /** 是否使用圆点样式 */
  isDotStyle?: boolean
  /** 是否可点击切换 */
  isClickable?: boolean
  /** 是否允许自由跳转（默认 false：只允许回退到已完成步骤） */
  isFreeJump?: boolean
}

/**
 * SeeSteps 事件
 */
export interface SeeStepsEmits {
  /** 步骤切换 */
  (e: 'onChange', index: number, step: StepItem): void
  /** v-model 同步（点击切换时） */
  (e: 'update:modelValue', value: number): void
  /** 完成所有步骤 */
  (e: 'onFinish'): void
}
