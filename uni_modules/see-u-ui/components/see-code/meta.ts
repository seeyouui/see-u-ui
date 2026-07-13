import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCode AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCode',
  tag: 'see-code',
  title: '验证码输入框',
  titleEn: 'Code',
  category: '表单组件',
  description: '验证码/短密码输入框,固定格数分格显示,支持 box/line/bottom 样式、遮罩圆点、数字或文本键盘及输入完成回调',
  docUrl: '/components/code/',
  examples: [
    {
      title: '基本使用',
      code: '<see-code v-model="code" :length="4" @on-complete="handleComplete" />'
    },
    {
      title: '密码遮罩',
      code: '<see-code v-model="code" :length="6" is-mask type="line" />'
    }
  ]
}

export default meta
