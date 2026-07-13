import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCheckbox AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCheckbox',
  tag: 'see-checkbox',
  title: '复选框',
  titleEn: 'Checkbox',
  category: '表单组件',
  description: '复选框,可单独使用绑定布尔值,也可置于 see-checkbox-group 内多选,支持半选、边框、选中色与尺寸',
  docUrl: '/components/checkbox/',
  examples: [
    {
      title: '单独使用',
      code: '<see-checkbox v-model="checked">同意协议</see-checkbox>'
    },
    {
      title: '配合 checkbox-group 多选',
      code: '<see-checkbox-group v-model="list">\n  <see-checkbox label="a">选项A</see-checkbox>\n  <see-checkbox label="b">选项B</see-checkbox>\n</see-checkbox-group>'
    }
  ]
}

export default meta
