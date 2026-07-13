import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeKeyboard AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeKeyboard',
  tag: 'see-keyboard',
  title: '键盘',
  titleEn: 'Keyboard',
  category: '表单组件',
  description: '自定义弹出键盘,支持 number/card/idcard/text 类型、安全随机排列、toolbar、确认删除按钮及遮罩安全区适配',
  docUrl: '/components/keyboard/',
  examples: [
    {
      title: '基本使用',
      code: '<see-keyboard v-model="show" type="number" @on-input="handleInput" @on-delete="handleDelete" />'
    },
    {
      title: '带确认的身份证键盘',
      code: '<see-keyboard v-model="show" type="idcard" is-show-confirm confirm-text="完成" @on-confirm="handleConfirm" />'
    }
  ]
}

export default meta
