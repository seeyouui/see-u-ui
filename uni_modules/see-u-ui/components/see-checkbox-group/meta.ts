import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCheckboxGroup AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCheckboxGroup',
  tag: 'see-checkbox-group',
  title: '复选框',
  titleEn: 'Checkbox',
  category: '表单组件',
  description: '复选框组容器,统一管理内部 see-checkbox 的多选状态,v-model 绑定数组,支持最多/最少可选数量、整组禁用与行内排列',
  docUrl: '/components/checkbox/',
  examples: [
    {
      title: '基本使用',
      code: '<see-checkbox-group v-model="list" @on-change="handleChange">\n  <see-checkbox label="a">选项A</see-checkbox>\n  <see-checkbox label="b">选项B</see-checkbox>\n</see-checkbox-group>'
    },
    {
      title: '限制最多可选',
      code: '<see-checkbox-group v-model="list" :max="2">\n  <see-checkbox label="a">A</see-checkbox>\n  <see-checkbox label="b">B</see-checkbox>\n  <see-checkbox label="c">C</see-checkbox>\n</see-checkbox-group>'
    }
  ]
}

export default meta
