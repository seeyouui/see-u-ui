import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCopy AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCopy',
  tag: 'see-copy',
  title: '复制',
  titleEn: 'Copy',
  category: '反馈组件',
  description: '点击即复制文本到剪贴板的包裹容器，通过 text 指定内容，复制成功可自动弹 Toast 提示，支持成功/失败事件回调',
  docUrl: '/components/copy/',
  examples: [
    {
      title: '基本使用',
      code: '<see-copy text="要复制的文字内容" @on-success="onSuccess">\n  <see-button>点击复制</see-button>\n</see-copy>'
    },
    {
      title: '自定义提示文字',
      code: '<see-copy text="13800138000" toast-message="手机号已复制">\n  <text>13800138000</text>\n</see-copy>'
    }
  ]
}

export default meta
