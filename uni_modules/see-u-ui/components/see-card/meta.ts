import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCard AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCard',
  tag: 'see-card',
  title: '卡片',
  titleEn: 'Card',
  category: '布局组件',
  description: '卡片容器组件，支持标题、副标题、头部/底部插槽，可配置阴影、圆角、边框，并提供点击事件。',
  docUrl: '/components/card/',
  examples: [
    {
      title: '基本使用',
      code: '<see-card title="卡片标题" sub-title="副标题">\n  <text>这是卡片的内容区域</text>\n</see-card>'
    },
    {
      title: '带底部与点击事件',
      code: '<see-card title="卡片标题" shadow="hover" @on-click="handleClick">\n  <text>卡片内容</text>\n  <template #footer>\n    <text>底部区域</text>\n  </template>\n</see-card>'
    }
  ]
}

export default meta
