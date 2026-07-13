import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeePopover AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeePopover',
  tag: 'see-popover',
  title: '弹窗提示',
  titleEn: 'Popover',
  category: '反馈组件',
  description: '依附于触发元素的气泡卡片，默认插槽为触发器、#content 插槽为气泡内容，支持 12 个弹出方位、click/hover/manual 触发方式与箭头、关闭按钮',
  docUrl: '/components/popover/',
  examples: [
    {
      title: '点击触发',
      code: '<see-popover v-model:show="show" position="bottom" trigger="click">\n  <see-button title="点击弹出" />\n  <template #content>\n    <view style="padding: 20rpx;">弹出框内容</view>\n  </template>\n</see-popover>'
    },
    {
      title: '带标题与箭头',
      code: '<see-popover v-model:show="show" position="top" title="提示" :is-show-arrow="true">\n  <text>悬浮查看</text>\n  <template #content><text>详细说明内容</text></template>\n</see-popover>'
    }
  ]
}

export default meta
