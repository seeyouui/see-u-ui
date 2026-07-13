import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSlider AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSlider',
  tag: 'see-slider',
  title: '滑动选择器',
  titleEn: 'Slider',
  category: '表单组件',
  description: '滑动选择器，拖动滑块选择数值，支持范围选择、垂直模式、步长刻度、值展示与自定义颜色',
  docUrl: '/components/slider/',
  examples: [
    {
      title: '基本使用',
      code: '<see-slider v-model="value" :min="0" :max="100" />'
    },
    {
      title: '范围选择',
      code: '<see-slider v-model="range" is-range is-show-value @on-change="handleChange" />'
    }
  ]
}

export default meta
