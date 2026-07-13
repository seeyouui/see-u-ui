import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSticky AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSticky',
  tag: 'see-sticky',
  title: '吸顶',
  titleEn: 'Sticky',
  category: '布局组件',
  description: '吸顶组件，滚动时将内容固定在距顶部指定位置，常用于导航栏、标题栏，支持自定义偏移、层级并可开关。',
  docUrl: '/components/sticky/',
  examples: [
    {
      title: '基本使用',
      code: '<see-sticky :offset-top="0">\n  <view>吸顶内容</view>\n</see-sticky>'
    },
    {
      title: '自定义偏移与滚动监听',
      code: '<see-sticky :offset-top="44" :z-index="100" @on-scroll="handleScroll">\n  <view>标题栏</view>\n</see-sticky>'
    }
  ]
}

export default meta
