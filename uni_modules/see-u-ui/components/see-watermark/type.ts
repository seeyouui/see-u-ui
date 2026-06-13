/**
 * SeeWatermark 组件类型定义
 */

export interface SeeWatermarkProps {
  /** 水印内容，单行字符串或多行数组 */
  content?: string | string[]
  /** 水印间距 [x, y]（rpx） */
  gap?: [number, number]
  /** 起始偏移 [x, y]（rpx） */
  offset?: [number, number]
  /** 旋转角度（deg） */
  rotate?: number | string
  /** 字号（数值默认拼 rpx，字符串原样） */
  fontSize?: number | string
  /** 字色 */
  fontColor?: string
  /** 字重 */
  fontWeight?: string | number
  /** 字体 */
  fontFamily?: string
  /** 层级 */
  zIndex?: number
  /** 是否全屏覆盖（fixed 定位） */
  fullScreen?: boolean
  /** 容器宽度（数值拼 rpx） */
  width?: number | string
  /** 容器高度（数值拼 rpx） */
  height?: number | string
}

// SeeWatermark 当前无事件，Emits 类型保留用于扩展
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SeeWatermarkEmits {}
