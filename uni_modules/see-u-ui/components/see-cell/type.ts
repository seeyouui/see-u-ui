/**
 * SeeCell 组件属性
 */
export interface SeeCellProps {
  /**
   * 标题
   */
  title?: string
  /**
   * 值/右侧文字
   */
  value?: string
  /**
   * 描述/副标题
   */
  label?: string
  /**
   * 左侧图标名称
   */
  icon?: string
  /**
   * 图标大小
   * @default '40rpx'
   */
  iconSize?: string
  /**
   * 是否显示右侧箭头
   * @default false
   */
  isLink?: boolean
  /**
   * 跳转 URL（设置后点击自动跳转）
   */
  to?: string
  /**
   * 是否显示表单必填星号
   * @default false
   */
  isRequired?: boolean
  /**
   * 是否显示下边框
   * @default true
   */
  border?: boolean
  /**
   * 单元格高度
   */
  height?: string
  /**
   * 点击反馈效果
   * @default 'background'
   */
  clickEffect?: 'background' | 'opacity' | 'none'
  /**
   * 标题宽度
   * @default 'auto'
   */
  titleWidth?: string
  /**
   * 是否居中
   * @default false
   */
  isCenter?: boolean
}

/**
 * SeeCell 组件事件
 */
export interface SeeCellEmits {
  (e: 'onClick'): void
}
