import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeRate AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeRate',
  tag: 'see-rate',
  title: '评分',
  titleEn: 'Rate',
  category: '表单组件',
  description: '星级评分，支持自定义星星数量、半星、颜色、图标、间距，可只读展示或点击清除',
  docUrl: '/components/rate/',
  examples: [
    {
      title: '基本使用',
      code: '<see-rate v-model="value" />'
    },
    {
      title: '半星与自定义数量',
      code: '<see-rate v-model="value" :count="5" allow-half @on-change="handleChange" />'
    }
  ]
}

export default meta
