import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeInput AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeInput',
  tag: 'see-input',
  title: '输入框',
  titleEn: 'Input',
  category: '表单组件',
  description: '文本输入框，支持 text/number/password 等类型、清除按钮、字数统计、前后缀图标、密码切换及格式化，可接入表单校验',
  docUrl: '/components/input/',
  examples: [
    {
      title: '基本使用',
      code: '<see-input v-model="value" placeholder="请输入内容" />'
    },
    {
      title: '密码框带清除',
      code: '<see-input v-model="pwd" type="password" is-show-password is-clearable placeholder="请输入密码" />'
    }
  ]
}

export default meta
