import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeForm AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeForm',
  tag: 'see-form',
  title: '表单',
  titleEn: 'Form',
  category: '表单组件',
  description: '表单容器,通过 model 绑定数据、rules 定义校验规则,统一管理内部 see-form-item 的标签位置、尺寸、禁用与整体校验/重置',
  docUrl: '/components/form/',
  examples: [
    {
      title: '基本使用',
      code: '<see-form :model="formData" :rules="rules" ref="formRef">\n  <see-form-item label="用户名" field="username">\n    <see-input v-model="formData.username" placeholder="请输入用户名" />\n  </see-form-item>\n</see-form>'
    }
  ]
}

export default meta
