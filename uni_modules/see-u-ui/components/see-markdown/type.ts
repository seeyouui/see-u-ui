import type { MarkdownParserOptions } from '../../utils/hooks/useMarkdownParser'

export interface SeeMarkdownProps {
  /** Markdown 文本内容 */
  content?: string
  /** 段落内单换行是否转为 <br>（GFM 风格） */
  breaks?: boolean
  /** 是否自动把裸 URL 转为链接 */
  linkify?: boolean
  /** 是否启用 GFM 扩展（表格 / 删除线 / 任务列表） */
  gfm?: boolean
  /** 代码块语法高亮回调；返回的 HTML 会原样嵌入到 <code> 内部 */
  highlight?: (code: string, lang: string) => string
  /** 标签级样式注入：传递给底层 see-parse */
  tagStyle?: Record<string, string>
  /** 是否允许文本选中（rich-text 平台生效） */
  selectable?: boolean
  /** 是否启用图片点击预览 */
  previewImage?: boolean
  /** 自定义预览图片列表；不传则从 content 自动收集 */
  imageUrls?: string[]
  /** 空内容时显示的占位文本 */
  emptyText?: string
  /** H5 模式下图片懒加载 */
  lazyLoad?: boolean
  /** 自定义根元素 class */
  containerClass?: string
  /** 自定义根元素 style */
  containerStyle?: string | Record<string, string | number>
  /** 自定义允许的标签白名单（透传到 see-parse） */
  allowedTags?: string[]
  /** 自定义允许的属性白名单（透传到 see-parse） */
  allowedAttrs?: string[]
}

export interface SeeMarkdownEmits {
  /** 内容解析完成，回调 (html, nodes) */
  (e: 'onLoad', html: string, nodes: any[]): void
  /** 解析失败 */
  (e: 'onError', err: Error): void
  /** 点击根容器 */
  (e: 'onClick', event: any): void
  /** 点击链接 */
  (e: 'onLinkTap', href: string, event: any): void
  /** 点击图片 */
  (e: 'onImgTap', src: string, urls: string[], event: any): void
  /** 组件挂载就绪 */
  (e: 'onReady'): void
}

export type { MarkdownParserOptions }
