import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeTooltip AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeTooltip',
  tag: 'see-tooltip',
  title: '长按提示',
  titleEn: 'Tooltip',
  category: '反馈组件',
  description:
    '轻量文字提示气泡，默认插槽为触发元素、content 属性为提示文字，支持 12 个方位、longpress/hover/click/manual 触发方式与 dark/light 两种效果',
  docUrl: '/components/tooltip/',
  examples: [
    {
      title: '长按触发',
      code: '<see-tooltip content="这是一段提示文字" position="top">\n  <see-button title="长按触发" />\n</see-tooltip>'
    },
    {
      title: '悬停 + 浅色效果',
      code: '<see-tooltip content="帮助说明" trigger="hover" effect="light" position="right">\n  <text>?</text>\n</see-tooltip>'
    }
  ]
}

export default meta
