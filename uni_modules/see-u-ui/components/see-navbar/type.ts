/**
 * SeeNavbar 自定义导航栏 Props
 */
export interface SeeNavbarProps {
  /** 导航栏标题 */
  title?: string
  /** 是否固定在顶部 */
  isFixed?: boolean
  /** 是否显示左侧区域 */
  isShowLeft?: boolean
  /** 是否显示右侧区域 */
  isShowRight?: boolean
  /** 左侧文字 */
  leftText?: string
  /** 左侧是否显示箭头 */
  leftArrow?: boolean
  /** 右侧文字 */
  rightText?: string
  /** 右侧图标名称 */
  rightIcon?: string
  /** 是否为搜索模式 */
  isSearch?: boolean
  /** 搜索栏占位文字 */
  searchPlaceholder?: string
  /** 是否启用毛玻璃效果 */
  isFrosted?: boolean
  /** 层级 */
  zIndex?: number
  /** 是否适配顶部安全区 */
  safeAreaInsetTop?: boolean
  /** 自定义背景色 */
  bgColor?: string
  /** 自定义标题颜色 */
  titleColor?: string
  /** 是否显示底部边框 */
  border?: boolean
  /** fixed 定位时是否生成占位元素 */
  placeholder?: boolean
}

/**
 * SeeNavbar 事件
 */
export interface SeeNavbarEmits {
  /** 左侧按钮点击 */
  (e: 'onLeftClick'): void
  /** 右侧按钮点击 */
  (e: 'onRightClick', index: number): void
  /** 搜索触发 */
  (e: 'onSearch', query: string): void
  /** 返回按钮点击 */
  (e: 'onBack'): void
}

/**
 * SeeNavbar 暴露方法
 */
export interface SeeNavbarExpose {
  /** 动态设置标题 */
  setTitle: (title: string) => void
  /** 动态设置右侧文字 */
  setRightText: (text: string) => void
  /** 显示导航栏 */
  show: () => void
  /** 隐藏导航栏 */
  hide: () => void
}

/**
 * SeeNavbar 插槽
 */
export interface SeeNavbarSlots {
  /** 左侧插槽 */
  left?: () => any
  /** 中间插槽（覆盖 title） */
  center?: () => any
  /** 右侧插槽 */
  right?: () => any
}
