/**
 * SeeTabs Props
 */
export interface SeeTabsProps {
  /** 当前选中的 tab name */
  modelValue?: string | number
  /** 标签样式类型 */
  type?: 'line' | 'card' | 'button'
  /** 是否可滑动切换 */
  isSwipeable?: boolean
  /** 是否使用粘性布局 */
  isSticky?: boolean
  /** 粘性布局偏移量 */
  stickyOffsetTop?: number
  /** 切换动画时长（ms） */
  duration?: number
  /** 标签栏是否可滚动 */
  isScrollable?: boolean
  /** 指示器宽度（px） */
  lineWidth?: number
  /** 指示器高度（px） */
  lineHeight?: number
  /** 选中时颜色 */
  activeColor?: string
  /** 未选中时颜色 */
  inactiveColor?: string
  /** 自定义背景色 */
  bgColor?: string
  /** 是否启用懒加载 */
  isLazy?: boolean
  /** 是否启用缓存（KeepAlive） */
  isCache?: boolean
  /** 是否显示 Badge */
  isShowBadge?: boolean
}

/**
 * SeeTabPane Props
 */
export interface SeeTabPaneProps {
  /** 唯一标识 */
  name: string | number
  /** 标签标题 */
  title?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 徽标内容 */
  badge?: string | number
  /** 是否显示红点 */
  dot?: boolean
  /** 图标名称 */
  icon?: string
  /** 是否可关闭 */
  closable?: boolean
}

/**
 * SeeTabs 事件
 */
export interface SeeTabsEmits {
  /** tab 切换 */
  (e: 'onChange', name: string | number, title: string): void
  /** tab 点击（切换前触发） */
  (e: 'onClick', name: string | number, title: string): void
  /** 标签关闭 */
  (e: 'onClose', name: string | number): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string | number): void
}

/**
 * SeeTabs 暴露方法
 */
export interface SeeTabsExpose {
  /** 切换到指定 tab */
  switchTo: (name: string | number) => void
  /** 添加标签 */
  addTab: (tab: SeeTabPaneProps) => void
  /** 移除标签 */
  removeTab: (name: string | number) => void
  /** 滚动到指定标签 */
  scrollToTab: (name: string | number) => void
}

/**
 * Tabs 注入的上下文
 */
export interface TabsContext {
  activeName: import('vue').Ref<string | number>
  registerPane: (pane: SeeTabPaneProps) => void
  unregisterPane: (name: string | number) => void
  isLazy: import('vue').ComputedRef<boolean>
  isCache: import('vue').ComputedRef<boolean>
}
