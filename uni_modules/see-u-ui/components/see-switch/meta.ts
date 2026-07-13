import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSwitch AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSwitch',
  tag: 'see-switch',
  title: '开关选择器',
  titleEn: 'Switch',
  category: '表单组件',
  description: '开关选择器，在开/关两种对立状态间切换，支持自定义选中值、颜色、文字描述与 small/default/large 尺寸',
  docUrl: '/components/switch/',
  examples: [
    {
      title: '基本使用',
      code: '<see-switch v-model="value" />'
    },
    {
      title: '自定义文字与颜色',
      code: '<see-switch v-model="value" active-text="开" inactive-text="关" active-color="#07c160" @on-change="handleChange" />'
    }
  ]
}

export default meta
