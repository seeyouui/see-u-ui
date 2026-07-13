import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeVirtualList AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeVirtualList',
  tag: 'see-virtual-list',
  title: '虚拟列表',
  titleEn: 'VirtualList',
  category: '数据组件',
  description: '虚拟列表组件，仅渲染可视区域项以承载海量数据，支持固定/动态高度、横向滚动、缓冲区与触底加载',
  docUrl: '/components/virtual-list/',
  examples: [
    {
      title: '基本使用',
      code: '<see-virtual-list :list="list" :itemHeight="50" height="400px">\n  <template #item="{ item, index }">\n    <view style="padding: 12rpx 24rpx;">{{ index }}. {{ item }}</view>\n  </template>\n</see-virtual-list>'
    },
    {
      title: '触底加载更多',
      code: '<see-virtual-list :list="list" :itemHeight="60" height="500px" :buffer="8" @on-scroll-to-lower="onLoadMore">\n  <template #item="{ item }">\n    <view style="padding: 20rpx;">{{ item.title }}</view>\n  </template>\n</see-virtual-list>'
    }
  ]
}

export default meta
