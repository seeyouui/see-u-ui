/**
 * SeeCollapse 父容器属性
 */
export interface SeeCollapseProps {
  /**
   * 当前展开项 name 数组（v-model）
   * @default []
   */
  modelValue?: (string | number)[]
  /**
   * 是否手风琴模式
   * @default false
   */
  isAccordion?: boolean
  /**
   * 是否显示边框
   * @default true
   */
  isShowBorder?: boolean
}

/**
 * SeeCollapse 父容器事件
 */
export interface SeeCollapseEmits {
  /** 展开项变化时触发 */
  onChange: (activeNames: (string | number)[]) => void
  /** v-model 更新 */
  'update:modelValue': (value: (string | number)[]) => void
}

/**
 * SeeCollapseItem 子项属性
 */
export interface SeeCollapseItemProps {
  /**
   * 唯一标识（必填）
   */
  name: string | number
  /**
   * 标题
   * @default ''
   */
  title?: string
  /**
   * 左侧图标
   * @default ''
   */
  icon?: string
  /**
   * 是否禁用
   * @default false
   */
  isDisabled?: boolean
  /**
   * 是否懒加载内容
   * @default false
   */
  isLazy?: boolean
  /**
   * 自定义箭头图标
   * @default '›'
   */
  arrowIcon?: string
}

/**
 * SeeCollapseItem 子项事件
 */
export interface SeeCollapseItemEmits {
  /** 点击标题时触发 */
  onClick: (name: string | number) => void
}

/**
 * Collapse 注入上下文
 */
import type { Ref, InjectionKey } from 'vue'

export interface CollapseContext {
  activeNames: Ref<(string | number)[]>
  isAccordion: Ref<boolean>
  toggle: (name: string | number) => void
  registerItem: (name: string | number) => void
  unregisterItem: (name: string | number) => void
}

export const collapseInjectionKey: InjectionKey<CollapseContext> = Symbol('see-collapse')
