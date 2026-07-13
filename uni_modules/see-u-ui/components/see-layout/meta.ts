import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeLayout AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeLayout',
  tag: 'see-layout',
  title: '布局',
  titleEn: 'Layout',
  category: '布局组件',
  description: '基于 Flex 的 24 列栅格布局容器，搭配 see-layout-item 使用，子项通过 span 占列、offset 偏移或自定义 flex。',
  docUrl: '/components/layout/',
  examples: [
    {
      title: '基本使用',
      code: '<see-layout :gap="20">\n  <see-layout-item :span="8">\n    <view>span=8</view>\n  </see-layout-item>\n  <see-layout-item :span="8">\n    <view>span=8</view>\n  </see-layout-item>\n  <see-layout-item :span="8">\n    <view>span=8</view>\n  </see-layout-item>\n</see-layout>'
    },
    {
      title: '偏移布局',
      code: '<see-layout>\n  <see-layout-item :span="8">\n    <view>span=8</view>\n  </see-layout-item>\n  <see-layout-item :span="8" :offset="8">\n    <view>span=8 offset=8</view>\n  </see-layout-item>\n</see-layout>'
    }
  ]
}

export default meta
