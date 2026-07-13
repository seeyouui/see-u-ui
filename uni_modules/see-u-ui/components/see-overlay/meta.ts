import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeOverlay AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeOverlay',
  tag: 'see-overlay',
  title: '遮罩层',
  titleEn: 'Overlay',
  category: '布局组件',
  description: '全屏半透明遮罩层，常用于弹窗、抽屉的背景，支持点击关闭、渐显动画、自定义背景色、透明度与层级。',
  docUrl: '/components/overlay/',
  examples: [
    {
      title: '基本使用',
      code: '<see-overlay v-model:show="show" @on-click="show = false" />'
    },
    {
      title: '自定义透明度与内容',
      code: '<see-overlay v-model:show="show" :opacity="0.5" :duration="300">\n  <view>遮罩上的内容</view>\n</see-overlay>'
    }
  ]
}

export default meta
