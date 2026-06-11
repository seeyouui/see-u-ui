/**
 * 下拉菜单类型
 */
export type DropdownMenuType = 'single' | 'multiple' | 'cascade' | 'date' | 'custom'

/**
 * 下拉选项
 */
export interface DropdownOption {
  /** 显示文字 */
  label: string
  /** 选项值 */
  value: string | number
  /** 子选项（cascade 用） */
  children?: DropdownOption[]
}

/**
 * SeeDropdown Props
 */
export interface SeeDropdownProps {
  /** 当前选中值（各 item 的值） */
  modelValue?: Record<string, any>
  /** 层级 */
  zIndex?: number
  /** 动画时长（ms） */
  duration?: number
  /** 是否显示遮罩 */
  isOverlay?: boolean
  /** 点击遮罩是否关闭 */
  closeOnClickOverlay?: boolean
}

/**
 * SeeDropdownItem Props
 */
export interface SeeDropdownItemProps {
  /** 唯一标识 */
  name: string
  /** 显示标题 */
  title?: string
  /** 菜单类型 */
  menuType?: DropdownMenuType
  /** 选项列表 */
  options?: DropdownOption[]
  /** 是否禁用 */
  isDisabled?: boolean
  /** 占位文字 */
  placeholder?: string
}

/**
 * SeeDropdownPanel Props
 */
export interface SeeDropdownPanelProps {
  /** 对应的 dropdown-item 的 name */
  name: string
}

/**
 * SeeDropdown 事件
 */
export interface SeeDropdownEmits {
  /** 选项变更 */
  (e: 'onChange', value: any, name: string): void
  /** 面板打开 */
  (e: 'onOpen', name: string): void
  /** 面板关闭 */
  (e: 'onClose', name: string): void
}

/**
 * SeeDropdown 暴露方法
 */
export interface SeeDropdownExpose {
  /** 打开指定面板 */
  open: (name: string) => void
  /** 关闭指定面板 */
  close: (name: string) => void
  /** 关闭所有面板 */
  closeAll: () => void
  /** 重置所有选项 */
  reset: () => void
}

/**
 * Dropdown 注入的上下文
 */
export interface DropdownContext {
  activeItem: import('vue').Ref<string | null>
  registerItem: (item: SeeDropdownItemProps) => void
  unregisterItem: (name: string) => void
  openItem: (name: string) => void
  closeItem: (name: string) => void
  closeAll: () => void
  emitChange: (value: any, name: string) => void
}
