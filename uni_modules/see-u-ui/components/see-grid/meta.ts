import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeGrid AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeGrid',
  tag: 'see-grid',
  title: '宫格布局',
  titleEn: 'Grid',
  category: '布局组件',
  description: '宫格布局容器，搭配 see-grid-item 使用，可配置列数、间距、边框、正方形及点击反馈，子项支持图标、文字与跳转。',
  docUrl: '/components/grid/',
  examples: [
    {
      title: '基本使用',
      code: '<see-grid :columns="4" :border="true">\n  <see-grid-item text="宫格1" icon="📱" />\n  <see-grid-item text="宫格2" icon="⭐" />\n  <see-grid-item text="宫格3" icon="📌" />\n  <see-grid-item text="宫格4" icon="🎨" />\n</see-grid>'
    },
    {
      title: '正方形可点击',
      code: '<see-grid :columns="3" :gap="20" is-square is-clickable>\n  <see-grid-item text="设置" icon="⚙" to="/pages/setting/index" @on-click="handleClick" />\n</see-grid>'
    }
  ]
}

export default meta
