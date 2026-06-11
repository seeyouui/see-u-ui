/**
 * Tabbar 项配置
 */
export interface TabbarItem {
  /** 唯一标识 */
  name: string | number
  /** 显示文字 */
  text: string
  /** 图标名称 */
  icon: string
  /** 选中时图标名称 */
  activeIcon?: string
  /** 徽标内容 */
  badge?: string | number
  /** 是否显示红点 */
  dot?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 路由模式下的页面路径 */
  url?: string
  /** 是否为中央凸起按钮 */
  isCenter?: boolean
  /** 中央按钮图标 */
  centerIcon?: string
}

/**
 * SeeTabbar Props
 */
export interface SeeTabbarProps {
  /** 当前选中的 tab name */
  modelValue?: string | number
  /** tab 列表 */
  tabs?: TabbarItem[]
  /** 是否固定在底部 */
  isFixed?: boolean
  /** 是否启用毛玻璃效果 */
  isFrosted?: boolean
  /** 层级 */
  zIndex?: number
  /** 是否适配底部安全区 */
  safeAreaInsetBottom?: boolean
  /** 选中时颜色 */
  activeColor?: string
  /** 未选中时颜色 */
  inactiveColor?: string
  /** 自定义背景色 */
  bgColor?: string
  /** 是否显示顶部边框 */
  border?: boolean
  /** 是否为路由模式 */
  route?: boolean
  /** fixed 定位时是否生成占位元素 */
  placeholder?: boolean
}

/**
 * SeeTabbar 事件
 */
export interface SeeTabbarEmits {
  /** tab 切换 */
  (e: 'onChange', name: string | number, index: number): void
  /** tab 点击（切换前触发） */
  (e: 'onClick', name: string | number, index: number): void
  /** 中央按钮点击 */
  (e: 'onCenterClick'): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string | number): void
}

/**
 * SeeTabbar 暴露方法
 */
export interface SeeTabbarExpose {
  /** 切换 tab */
  switchTab: (name: string | number) => void
  /** 设置徽标 */
  setBadge: (name: string | number, badge: string | number) => void
  /** 清除徽标 */
  clearBadge: (name: string | number) => void
}
