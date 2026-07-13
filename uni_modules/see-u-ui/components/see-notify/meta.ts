import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeNotify AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeNotify',
  tag: 'see-notify',
  title: '消息提示',
  titleEn: 'Notify',
  category: '反馈组件',
  description:
    '从顶部滑入的全局消息通知条，支持 success/error/warning/info 四种类型、自定义颜色与时长；主要通过命令式 API notify.success() / notify.error() 等调用',
  docUrl: '/components/notify/',
  examples: [
    {
      title: '命令式调用',
      code: "import { notify } from '@/uni_modules/see-u-ui'\nnotify.success('操作成功')\nnotify.error('操作失败', 5000)\nnotify.show({ message: '自定义通知', type: 'warning', isClosable: true })"
    },
    {
      title: '组件式调用',
      code: '<see-notify v-model:show="show" message="这是一条通知消息" type="success" />'
    }
  ]
}

export default meta
