/**
 * SeeLine 组件属性
 */
export interface SeeLineProps {
  /**
   * 方向
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * 线条颜色
   * @default 'var(--see-border-color)'
   */
  color?: string
  /**
   * 线条粗细（宽度）
   * @default '1px'
   */
  size?: string
  /**
   * 外边距
   */
  margin?: string
  /**
   * 是否虚线
   * @default false
   */
  isDashed?: boolean
  /**
   * 长度比例（水平方向时占父容器宽度的比例）
   * @default '100%'
   */
  length?: string
}
