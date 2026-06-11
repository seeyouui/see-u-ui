import type { ParseNode, ParseNodeAttrs, ParseTextNode, ParseElementNode, UseHtmlParserOptions } from '../../utils/hooks/useHtmlParser'

export type SeeParseNode = ParseNode
export type SeeParseNodeAttrs = ParseNodeAttrs
export type SeeParseTextNode = ParseTextNode
export type SeeParseElementNode = ParseElementNode

export interface SeeParseProps {
  /** 富文本 HTML 字符串 */
  content?: string
  /** 标签级样式注入：{ p: 'color: red', img: 'max-width: 100%' } */
  tagStyle?: Record<string, string>
  /** 是否允许文本选中（仅 rich-text 平台生效） */
  selectable?: boolean
  /** 是否启用图片点击预览 */
  previewImage?: boolean
  /** 自定义预览图片列表；不传则从 content 自动收集 */
  imageUrls?: string[]
  /** 空内容时显示的占位文本 */
  emptyText?: string
  /** 是否懒加载图片（H5 模式生效） */
  lazyLoad?: boolean
  /** 是否解析 \n 为 <br>（rich-text 默认会忽略 \n） */
  preserveNewline?: boolean
  /** 自定义根元素 class */
  containerClass?: string
  /** 自定义根元素 style */
  containerStyle?: string | Record<string, string | number>
  /** 自定义允许的标签白名单 */
  allowedTags?: string[]
  /** 自定义允许的属性白名单 */
  allowedAttrs?: string[]
}

export interface SeeParseEmits {
  /** 内容解析完成 */
  (e: 'onLoad', nodes: SeeParseNode[]): void
  /** 解析失败 */
  (e: 'onError', err: Error): void
  /** 点击富文本容器 */
  (e: 'onClick', event: any): void
  /** 点击链接（H5 默认拦截 javascript: 协议） */
  (e: 'onLinkTap', href: string, event: any): void
  /** 点击图片 */
  (e: 'onImgTap', src: string, urls: string[], event: any): void
  /** 组件挂载就绪 */
  (e: 'onReady'): void
}

export type { UseHtmlParserOptions }
