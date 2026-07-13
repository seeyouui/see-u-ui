import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCollapse AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCollapse',
  tag: 'see-collapse',
  title: '折叠面板',
  titleEn: 'Collapse',
  category: '反馈组件',
  description: '折叠面板容器，配合 see-collapse-item 子项使用，v-model 绑定展开项 name 数组，支持手风琴模式（isAccordion）与子项图标、禁用、懒加载',
  docUrl: '/components/collapse/',
  examples: [
    {
      title: '基本使用',
      code: '<see-collapse v-model="activeNames" @on-change="onChange">\n  <see-collapse-item name="1" title="标题一">内容一</see-collapse-item>\n  <see-collapse-item name="2" title="标题二">内容二</see-collapse-item>\n</see-collapse>'
    },
    {
      title: '手风琴模式',
      code: '<see-collapse v-model="activeNames" :is-accordion="true">\n  <see-collapse-item name="1" title="标题一" icon="star">内容一</see-collapse-item>\n  <see-collapse-item name="2" title="标题二" :is-disabled="true">内容二</see-collapse-item>\n</see-collapse>'
    }
  ]
}

export default meta
