import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeConfig AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeConfig',
  tag: 'see-config',
  title: 'config',
  titleEn: 'Config',
  category: '基础组件',
  description: '全局配置注入组件，作为应用根容器提供主题（明暗）、主题色 CSS 变量与全局骨架屏能力，内容通过默认插槽渲染',
  docUrl: '/components/config/',
  examples: [
    {
      title: '根容器包裹',
      code: '<see-config>\n  <!-- 页面内容 -->\n  <slot></slot>\n</see-config>'
    }
  ]
}

export default meta
