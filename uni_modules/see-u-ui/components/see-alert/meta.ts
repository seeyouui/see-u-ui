import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeAlert AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeAlert',
  tag: 'see-alert',
  title: '警告提示',
  titleEn: 'Alert',
  category: '反馈组件',
  description: '页面内联的警告提示条，支持 success/error/warning/info 四种类型与 light/dark/border 三种效果，可选图标、可关闭、可折叠长内容',
  docUrl: '/components/alert/',
  examples: [
    {
      title: '四种类型',
      code: '<see-alert type="info" title="信息提示" content="这是一条信息提示" />\n<see-alert type="success" title="成功提示" content="这是一条成功提示" />\n<see-alert type="warning" title="警告提示" content="这是一条警告提示" />\n<see-alert type="error" title="错误提示" content="这是一条错误提示" />'
    },
    {
      title: '可关闭 + 边框效果',
      code: '<see-alert type="warning" effect="border" title="提示" content="点击右侧可关闭" :is-closable="true" @on-close="onClose" />'
    }
  ]
}

export default meta
