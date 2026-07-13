import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeParse AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeParse',
  tag: 'see-parse',
  title: '富文本解析器',
  titleEn: 'Parse',
  category: '内容解析',
  description: '富文本解析组件，将 HTML 字符串安全渲染为原生节点，支持标签样式注入、标签/属性白名单、图片点击预览与链接拦截',
  docUrl: '/components/parse/',
  examples: [
    {
      title: '基本使用',
      code: '<see-parse content="<h3>标题</h3><p>这是一段<b>富文本内容</b></p>" />'
    },
    {
      title: '样式注入与图片预览',
      code: '<see-parse :content="html" :tagStyle="{ p: \'color: #666\', img: \'max-width: 100%\' }" :previewImage="true" @on-img-tap="onImgTap" @on-link-tap="onLinkTap" />'
    }
  ]
}

export default meta
