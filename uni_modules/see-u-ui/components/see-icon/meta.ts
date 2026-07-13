import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeIcon AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeIcon',
  tag: 'see-icon',
  title: '图标',
  titleEn: 'Icon',
  category: '基础组件',
  description: '图标组件（占位/开发中），当前仅渲染占位文本，图标能力尚未实现',
  docUrl: '/components/icon/',
  examples: [
    {
      title: '基本使用',
      code: '<see-icon />'
    }
  ]
}

export default meta
