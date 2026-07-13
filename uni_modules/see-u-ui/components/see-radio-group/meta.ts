import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeRadioGroup AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeRadioGroup',
  tag: 'see-radio-group',
  title: '单选框',
  titleEn: 'Radio',
  category: '表单组件',
  description: '单选框组容器,统一管理内部 see-radio 的单选状态,v-model 绑定选中值,支持整组禁用/只读、行内排列与选中色',
  docUrl: '/components/radio/',
  examples: [
    {
      title: '基本使用',
      code: '<see-radio-group v-model="selected" @on-change="handleChange">\n  <see-radio label="a">选项一</see-radio>\n  <see-radio label="b">选项二</see-radio>\n</see-radio-group>'
    }
  ]
}

export default meta
