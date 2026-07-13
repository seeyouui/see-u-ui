import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeBox AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeBox',
  tag: 'see-box',
  title: '盒子',
  titleEn: 'Box',
  category: '布局组件',
  description: '基础布局容器，通过属性快捷配置内边距、外边距、背景色、圆角、阴影、边框，并内置 Flex 布局（方向/对齐/换行/间距）。',
  docUrl: '/components/box/',
  examples: [
    {
      title: '基本使用',
      code: '<see-box padding="20rpx" bg-color="#f5f5f5" radius="16rpx" shadow="medium">\n  <text>带内边距、背景色、圆角和阴影的盒子</text>\n</see-box>'
    },
    {
      title: 'Flex 布局',
      code: '<see-box direction="row" justify="space-between" align="center" gap="20rpx">\n  <text>左</text>\n  <text>右</text>\n</see-box>'
    }
  ]
}

export default meta
