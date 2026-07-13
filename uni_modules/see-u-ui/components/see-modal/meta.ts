import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeModal AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeModal',
  tag: 'see-modal',
  title: '模态框',
  titleEn: 'Modal',
  category: '反馈组件',
  description:
    '居中弹出的模态对话框，v-model:show 控制显隐，支持标题/内容/确认取消按钮、确认按钮类型与加载态、beforeClose 钩子；同时提供命令式 API modal.confirm() / modal.alert() 返回 Promise',
  docUrl: '/components/modal/',
  examples: [
    {
      title: '组件式调用',
      code: '<see-modal v-model:show="show" title="提示" content="确认删除该数据？" confirm-type="danger" @on-confirm="onConfirm" @on-cancel="onCancel" />'
    },
    {
      title: '命令式调用',
      code: "import { modal } from '@/uni_modules/see-u-ui'\nconst res = await modal.confirm({ title: '提示', content: '确认删除？' })\nif (res.confirm) { /* 用户点击了确认 */ }"
    }
  ]
}

export default meta
