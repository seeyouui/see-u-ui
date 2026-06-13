/**
 * SeeCoupon 组件类型定义
 */

/** 优惠券状态 */
export type CouponStatus = 'available' | 'received' | 'used' | 'expired'

/** 优惠券主题色 */
export type CouponType = 'primary' | 'warning' | 'success' | 'error'

export interface SeeCouponProps {
  /** 主金额 */
  amount?: string | number
  /** 金额单位前缀 */
  unit?: string
  /** 折扣文案（与 amount 互斥，优先于 amount） */
  discountText?: string
  /** 使用条件 */
  condition?: string
  /** 主标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 有效期文案 */
  validDate?: string
  /** 按钮文字 */
  buttonText?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 状态 */
  status?: CouponStatus
  /** 主题色 */
  type?: CouponType
  /** 右上角标签 */
  tag?: string
}

export interface SeeCouponEmits {
  /** 点击整张卡片 */
  onClick: (payload: { amount?: string | number; status?: CouponStatus }) => void
  /** 点击按钮 */
  onButtonClick: (payload: { amount?: string | number; status?: CouponStatus }) => void
}
