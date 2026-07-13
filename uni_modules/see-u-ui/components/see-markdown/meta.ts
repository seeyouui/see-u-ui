import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeMarkdown AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeMarkdown',
  tag: 'see-markdown',
  title: '文本解析',
  titleEn: 'Markdown',
  category: '内容解析',
  description: 'Markdown 渲染组件，将 Markdown 文本解析为富文本，支持 GFM 表格/删除线/任务列表、代码高亮、图片预览与链接点击',
  docUrl: '/components/markdown/',
  examples: [
    {
      title: '基本使用',
      code: '<see-markdown :content="md" />'
    },
    {
      title: 'GFM 与图片预览',
      code: '<see-markdown :content="md" :gfm="true" :breaks="true" :previewImage="true" @on-link-tap="onLinkTap" @on-img-tap="onImgTap" />'
    }
  ]
}

export default meta
