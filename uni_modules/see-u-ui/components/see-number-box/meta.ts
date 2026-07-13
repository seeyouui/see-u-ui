import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeNumberBox AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeNumberBox',
  tag: 'see-number-box',
  title: '步进器',
  titleEn: 'NumberBox',
  category: '表单组件',
  description: '数字步进器，通过加减按钮或输入调整数值，支持最小/最大值、步长、小数位数、异步模式与尺寸',
  docUrl: '/components/number-box/',
  examples: [
    {
      title: '基本使用',
      code: '<see-number-box v-model="value" />'
    },
    {
      title: '范围与步长',
      code: '<see-number-box v-model="value" :min="1" :max="10" :step="2" @on-change="handleChange" />'
    }
  ]
}

export default meta
