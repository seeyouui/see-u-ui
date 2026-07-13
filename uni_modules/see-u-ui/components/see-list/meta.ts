import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeList AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeList',
  tag: 'see-list',
  title: '列表',
  titleEn: 'List',
  category: '数据组件',
  description: '基础数据列表容器，统一处理加载/空/错误/完成状态、上拉加载更多、分组与分割线，列表项通过 item 插槽渲染',
  docUrl: '/components/list/',
  examples: [
    {
      title: '基本使用',
      code: '<see-list :list="[\'苹果\', \'香蕉\', \'橙子\']">\n  <template #item="{ item }">\n    <view style="padding: 20rpx;">{{ item }}</view>\n  </template>\n</see-list>'
    },
    {
      title: '加载更多与状态',
      code: '<see-list :list="list" :loading="loading" :finished="finished" :divided="true" @on-load-more="onLoadMore">\n  <template #item="{ item, index }">\n    <view style="padding: 20rpx;">{{ index }} - {{ item.title }}</view>\n  </template>\n</see-list>'
    }
  ]
}

export default meta
