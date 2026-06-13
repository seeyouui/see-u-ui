/**
 * SeeScratchCard 组件类型定义
 */

export interface SeeScratchCardProps {
  /** 宽度（数值默认 rpx） */
  width?: number | string
  /** 高度（数值默认 rpx） */
  height?: number | string
  /** 覆盖层纯色 */
  coverColor?: string
  /** 覆盖图片地址（优先于 coverColor） */
  coverImage?: string
  /** 覆盖层文字 */
  coverText?: string
  /** 覆盖层文字颜色 */
  coverTextColor?: string
  /** 覆盖层文字字号（rpx） */
  coverTextSize?: number
  /** 笔刷半径（rpx） */
  brushSize?: number
  /** 揭晓阈值（百分比，0-100） */
  threshold?: number
  /** 是否禁用 */
  isDisabled?: boolean
  /** 达到阈值是否自动揭晓（清除全部覆盖） */
  autoReveal?: boolean
  /** Canvas ID（多实例时需唯一） */
  canvasId?: string
}

export interface SeeScratchCardEmits {
  /** 第一次开始刮 */
  onStart: () => void
  /** 刮开进度变化（百分比） */
  onProgress: (percent: number) => void
  /** 达到阈值时触发 */
  onComplete: (percent: number) => void
}
