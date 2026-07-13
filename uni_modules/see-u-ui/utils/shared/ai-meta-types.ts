/**
 * AI 元数据类型契约
 * @description 每个组件的 meta.ts 遵循此结构，供生成器抽取 → registry.json
 */

/** 组件分组 */
export type ComponentCategory = '基础组件' | '表单组件' | '布局组件' | '数据组件' | '反馈组件' | '导航组件' | '内容解析' | '业务组件'

/** 典型使用示例 */
export interface ComponentExample {
  /** 示例标题（如「基本使用」「按钮类型」） */
  title: string
  /** 示例代码（可直接复制运行的模板片段） */
  code: string
}

/**
 * 组件 AI 元数据
 * @description 只写 type.ts 抽不出来的信息（分组/描述/示例），props/emits 由生成器从 type.ts + vue 自动抽取。
 */
export interface ComponentMeta {
  /** 组件注册名，如 SeeButton */
  name: string
  /** 模板标签名，如 see-button */
  tag: string
  /** 中文名，如「按钮」 */
  title: string
  /** 英文名，如 Button */
  titleEn?: string
  /** 所属分组 */
  category: ComponentCategory
  /** 一句话描述（AI 用于判断何时选用该组件） */
  description: string
  /** 文档地址（相对路径，如 /components/button/） */
  docUrl?: string
  /** 至少一个典型示例，AI 生成代码时直接参考 */
  examples: ComponentExample[]
  /** 相关组件标签（如 see-button 关联 see-icon） */
  related?: string[]
}
