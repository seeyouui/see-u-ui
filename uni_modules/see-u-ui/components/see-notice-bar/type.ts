/**
 * NoticeBar 类型
 */
export type NoticeBarType = 'info' | 'warning' | 'error'

/**
 * SeeNoticeBar 组件属性
 */
export interface SeeNoticeBarProps {
  /**
   * 通知文字
   * @default ''
   */
  text?: string
  /**
   * 通知类型
   * @default 'info'
   */
  type?: NoticeBarType
  /**
   * 滚动速度(px/s)
   * @default 50
   */
  speed?: number
  /**
   * 是否可滚动（false 则文字不滚动）
   * @default true
   */
  isScrollable?: boolean
  /**
   * 滚动开始前停顿(ms)
   * @default 1000
   */
  delay?: number
  /**
   * 是否可关闭
   * @default false
   */
  isClosable?: boolean
  /**
   * 是否显示左侧图标
   * @default true
   */
  isShowIcon?: boolean
  /**
   * 自定义图标（留空时按 type 显示内置图标）
   * @default ''
   */
  icon?: string
  /**
   * 右侧图标
   * @default ''
   */
  rightIcon?: string
  /**
   * 是否显示（v-model）
   * @default true
   */
  isShow?: boolean
  /**
   * 触摸时是否暂停滚动
   * @default true
   */
  isPauseOnTouch?: boolean
  /**
   * 是否垂直滚动（多条消息轮播）
   * @default false
   */
  vertical?: boolean
  /**
   * 多条消息（vertical=true 时）
   * @default []
   */
  messages?: string[]
  /**
   * 垂直轮播间隔(ms)
   * @default 3000
   */
  verticalInterval?: number
}

/**
 * SeeNoticeBar 组件事件
 */
export interface SeeNoticeBarEmits {
  /** 点击通知条 */
  onClick: () => void
  /** 关闭时触发 */
  onClose: () => void
  /** 点击右侧图标 */
  onRightClick: () => void
  /** v-model 更新 */
  'update:isShow': (value: boolean) => void
}
