import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeRadio AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeRadio',
  tag: 'see-radio',
  title: '单选框',
  titleEn: 'Radio',
  category: '表单组件',
  description: '单选框,通过 label 指定选项值,通常置于 see-radio-group 内实现单选,支持边框、选中色与尺寸',
  docUrl: '/components/radio/',
  examples: [
    {
      title: '配合 radio-group 使用',
      code: '<see-radio-group v-model="selected">\n  <see-radio label="a">选项一</see-radio>\n  <see-radio label="b">选项二</see-radio>\n</see-radio-group>'
    }
  ]
}

export default meta
