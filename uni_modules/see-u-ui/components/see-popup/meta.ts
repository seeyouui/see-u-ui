import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeePopup AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeePopup',
  tag: 'see-popup',
  title: '弹出层',
  titleEn: 'Popup',
  category: '反馈组件',
  description:
    '基础弹出层容器，v-model:show 控制显隐，支持 top/bottom/left/right/center 五个弹出方向、遮罩、圆角、关闭按钮与安全区适配，是多数弹层组件的底层实现',
  docUrl: '/components/popup/',
  examples: [
    {
      title: '底部弹出',
      code: '<see-popup v-model:show="show" position="bottom">\n  <view style="padding: 40rpx;">弹出层内容</view>\n</see-popup>'
    },
    {
      title: '居中带关闭按钮',
      code: '<see-popup v-model:show="show" position="center" :is-show-close-btn="true" @on-close="onClose">\n  <view style="padding: 40rpx;">居中内容</view>\n</see-popup>'
    }
  ]
}

export default meta
