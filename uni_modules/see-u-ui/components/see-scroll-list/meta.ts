import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeScrollList AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeScrollList',
  tag: 'see-scroll-list',
  title: '横向滚动列表',
  titleEn: 'ScrollList',
  category: '布局组件',
  description: '横向滚动列表，基于数据数组渲染列表项，支持自定义项内容、项间距、滚动条及触底/触顶加载更多事件。',
  docUrl: '/components/scroll-list/',
  examples: [
    {
      title: '基本使用',
      code: "<see-scroll-list :list=\"['推荐', '热门', '关注', '科技', '财经']\">\n  <template #item=\"{ item }\">\n    <view>{{ item }}</view>\n  </template>\n</see-scroll-list>"
    },
    {
      title: '加载更多',
      code: '<see-scroll-list :list="list" item-gap="30rpx" @on-scroll-to-lower="loadMore">\n  <template #item="{ item, index }">\n    <view>{{ index }} - {{ item }}</view>\n  </template>\n</see-scroll-list>'
    }
  ]
}

export default meta
