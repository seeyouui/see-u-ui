import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSwiper AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSwiper',
  tag: 'see-swiper',
  title: '轮播图',
  titleEn: 'Swiper',
  category: '布局组件',
  description: '轮播图组件，基于数据渲染图片/自定义内容，支持自动播放、循环、dots/digital 指示器及切换、点击事件。',
  docUrl: '/components/swiper/',
  examples: [
    {
      title: '基本使用',
      code: '<see-swiper :list="list" height="300rpx" @on-click="onItemClick" @on-change="onChange" />'
    },
    {
      title: '数字指示器与自定义内容',
      code: '<see-swiper :list="list" indicator-type="digital" :autoplay="true" :interval="3000">\n  <template #item="{ item }">\n    <image :src="item.image" mode="aspectFill" />\n  </template>\n</see-swiper>'
    }
  ]
}

export default meta
