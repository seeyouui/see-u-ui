/**
 * 轮播项数据
 */
export interface SwiperItemData {
  /** 图片 URL */
  image?: string
  /** 标题 */
  title?: string
  /** 链接 */
  url?: string
  /** 自定义数据 */
  [key: string]: unknown
}

/**
 * 指示器类型
 */
export type IndicatorType = 'dots' | 'digital' | 'none'

/**
 * SeeSwiper 组件属性
 */
export interface SeeSwiperProps {
  /**
   * 轮播数据
   */
  list?: SwiperItemData[]
  /**
   * 高度
   * @default '300rpx'
   */
  height?: string
  /**
   * 是否自动播放
   * @default true
   */
  autoplay?: boolean
  /**
   * 自动播放间隔（毫秒）
   * @default 3000
   */
  interval?: number
  /**
   * 滑动动画时长（毫秒）
   * @default 300
   */
  duration?: number
  /**
   * 是否循环播放
   * @default true
   */
  loop?: boolean
  /**
   * 指示器样式
   * @default 'dots'
   */
  indicatorType?: IndicatorType
  /**
   * 指示器激活颜色
   * @default 'var(--see-primary)'
   */
  activeColor?: string
  /**
   * 指示器默认颜色
   * @default 'rgba(255,255,255,0.5)'
   */
  inactiveColor?: string
  /**
   * 当前页码（v-model）
   * @default 0
   */
  current?: number
}

/**
 * SeeSwiper 组件事件
 */
export interface SeeSwiperEmits {
  (e: 'onChange', index: number): void
  (e: 'update:current', index: number): void
  (e: 'onClick', item: SwiperItemData, index: number): void
}
