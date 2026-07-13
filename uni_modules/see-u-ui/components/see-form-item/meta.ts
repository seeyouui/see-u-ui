import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeFormItem AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeFormItem',
  tag: 'see-form-item',
  title: '表单',
  titleEn: 'Form',
  category: '表单组件',
  description: '表单项,配合 see-form 使用,通过 field 关联字段,提供标签、必填星号、校验错误提示,支持覆盖标签宽度/位置与自定义规则',
  docUrl: '/components/form/',
  examples: [
    {
      title: '基本使用',
      code: '<see-form-item label="用户名" field="username">\n  <see-input v-model="formData.username" placeholder="请输入用户名" />\n</see-form-item>'
    },
    {
      title: '自定义校验规则',
      code: '<see-form-item label="手机号" field="phone" :rules="phoneRules" is-required>\n  <see-input v-model="formData.phone" />\n</see-form-item>'
    }
  ]
}

export default meta
