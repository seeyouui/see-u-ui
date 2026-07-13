import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeWaterfall AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeWaterfall',
  tag: 'see-waterfall',
  title: '瀑布流',
  titleEn: 'Waterfall',
  category: '布局组件',
  description: '瀑布流布局组件，将数据按索引轮询分配到多列不等高排列，支持自定义项内容、列数、间距及触底加载更多。',
  docUrl: '/components/waterfall/',
  examples: [
    {
      title: '基本使用',
      code: '<see-waterfall :list="list" :columns="2" gap="16rpx" @on-click="handleClick" />'
    },
    {
      title: '自定义项与加载更多',
      code: '<see-waterfall :list="list" :columns="2" :has-more="hasMore" @on-load-more="loadMore">\n  <template #item="{ item, index }">\n    <image :src="item.image" mode="widthFix" />\n    <text>{{ item.title }}</text>\n  </template>\n</see-waterfall>'
    }
  ]
}

export default meta
