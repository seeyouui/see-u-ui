import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeNoticeBar AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeNoticeBar',
  tag: 'see-notice-bar',
  title: '滚动通知',
  titleEn: 'NoticeBar',
  category: '反馈组件',
  description: '横向滚动的通知栏，内容超长时自动跑马灯滚动，支持 info/warning/error 类型、左右图标、可关闭，以及 vertical 多条消息垂直轮播',
  docUrl: '/components/notice-bar/',
  examples: [
    {
      title: '基本使用',
      code: '<see-notice-bar text="这是一条通知消息，内容超出时会自动滚动" type="warning" :is-closable="true" @on-close="onClose" />'
    },
    {
      title: '垂直轮播',
      code: "<see-notice-bar :vertical=\"true\" :messages=\"['第一条消息', '第二条消息', '第三条消息']\" />"
    }
  ]
}

export default meta
