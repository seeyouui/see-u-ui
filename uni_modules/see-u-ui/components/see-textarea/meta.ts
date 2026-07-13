import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeTextarea AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeTextarea',
  tag: 'see-textarea',
  title: '文本域',
  titleEn: 'Textarea',
  category: '表单组件',
  description: '多行文本域，支持字数统计、自动增高、指定行数、清除按钮及键盘确认类型，可接入表单校验',
  docUrl: '/components/textarea/',
  examples: [
    {
      title: '基本使用',
      code: '<see-textarea v-model="value" placeholder="请输入内容" />'
    },
    {
      title: '限制字数并自动增高',
      code: '<see-textarea v-model="value" :maxlength="200" is-show-word-limit is-auto-height />'
    }
  ]
}

export default meta
