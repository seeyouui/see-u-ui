import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeLink AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeLink',
  tag: 'see-link',
  title: '链接',
  titleEn: 'Link',
  category: '基础组件',
  description: '超链接文本组件，支持预置主题色、自定义颜色与下划线，点击可跳转 http/tel/mailto（小程序端复制链接到剪贴板）',
  docUrl: '/components/link/',
  examples: [
    {
      title: '基本使用',
      code: '<see-link text="这是SeeYouUI的官方文档" type="primary" href="https://www.seeuui.cn" />\n<see-link text="自定义文字颜色" color="#52f7bd" href="https://www.seeuui.cn" />'
    },
    {
      title: '下划线链接',
      code: '<see-link text="带下划线的链接" type="primary" :isLine="true" :size="18" @on-click="onClick" />'
    }
  ]
}

export default meta
