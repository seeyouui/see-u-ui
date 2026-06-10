import type { InjectionKey, ComputedRef } from 'vue'

/**
 * SeeGrid provide/inject 的 InjectionKey 定义
 */
export const gridColumnsKey = Symbol('gridColumns') as InjectionKey<ComputedRef<number>>
export const gridIsSquareKey = Symbol('gridIsSquare') as InjectionKey<ComputedRef<boolean>>
export const gridIsClickableKey = Symbol('gridIsClickable') as InjectionKey<ComputedRef<boolean>>
export const gridBorderKey = Symbol('gridBorder') as InjectionKey<ComputedRef<boolean>>
export const gridBorderColorKey = Symbol('gridBorderColor') as InjectionKey<ComputedRef<string>>

/**
 * SeeGrid 组件属性
 */
export interface SeeGridProps {
  /**
   * 列数
   * @default 4
   */
  columns?: number
  /**
   * 间距
   * @default 0
   */
  gap?: number | string
  /**
   * 是否显示边框
   * @default false
   */
  border?: boolean
  /**
   * 边框颜色
   * @default 'var(--see-border-color)'
   */
  borderColor?: string
  /**
   * 是否正方形显示
   * @default false
   */
  isSquare?: boolean
  /**
   * 是否开启点击反馈
   * @default false
   */
  isClickable?: boolean
}

/**
 * SeeGridItem 组件属性
 */
export interface SeeGridItemProps {
  /**
   * 文本内容
   */
  text?: string
  /**
   * 图标
   */
  icon?: string
  /**
   * 图标大小
   * @default '48rpx'
   */
  iconSize?: string
  /**
   * 跳转路径
   */
  to?: string
  /**
   * 自定义索引
   */
  index?: number
}

/**
 * SeeGridItem 组件事件
 */
export interface SeeGridItemEmits {
  (e: 'onClick', index: number): void
}
