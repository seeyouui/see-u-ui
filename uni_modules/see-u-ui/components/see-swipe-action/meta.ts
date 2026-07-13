import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSwipeAction AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSwipeAction',
  tag: 'see-swipe-action',
  title: '滑动单元格',
  titleEn: 'SwipeAction',
  category: '反馈组件',
  description:
    '滑动单元格，左右滑动内容区露出操作按钮，通过 leftActions/rightActions 配置按钮（支持样式、图标、背景色），常用于列表项的删除、置顶等操作',
  docUrl: '/components/swipe-action/',
  examples: [
    {
      title: '右侧操作按钮',
      code: '<see-swipe-action :right-actions="actions" @on-click="onClick">\n  <view style="padding: 32rpx;">左滑显示操作</view>\n</see-swipe-action>\n// actions: [{ text: \'删除\', style: \'danger\' }, { text: \'置顶\' }]'
    },
    {
      title: '左右双向',
      code: "<see-swipe-action :left-actions=\"[{ text: '标记', style: 'success' }]\" :right-actions=\"[{ text: '删除', style: 'danger' }]\">\n  <view style=\"padding: 32rpx;\">列表项内容</view>\n</see-swipe-action>"
    }
  ]
}

export default meta
