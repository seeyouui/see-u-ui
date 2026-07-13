import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeToast AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeToast',
  tag: 'see-toast',
  title: '消息提示',
  titleEn: 'Toast',
  category: '反馈组件',
  description:
    '轻量的全局消息轻提示，支持 success/error/warning/info/loading 类型与 top/center/bottom 位置；主要通过命令式 API toast.success() / toast.loading() 等调用',
  docUrl: '/components/toast/',
  examples: [
    {
      title: '命令式调用',
      code: "import { toast } from '@/uni_modules/see-u-ui'\ntoast.success('保存成功')\ntoast.loading('加载中...')\ntoast.show({ message: '自定义提示', type: 'info', position: 'top' })"
    },
    {
      title: '组件式调用',
      code: '<see-toast v-model:show="show" message="这是一条提示消息" type="success" position="center" />'
    }
  ]
}

export default meta
