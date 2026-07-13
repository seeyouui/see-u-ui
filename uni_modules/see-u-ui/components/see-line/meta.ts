import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeLine AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeLine',
  tag: 'see-line',
  title: '线条',
  titleEn: 'Line',
  category: '布局组件',
  description: '水平或垂直分割线，支持实线/虚线、自定义颜色、粗细、长度和外边距。',
  docUrl: '/components/line/',
  examples: [
    {
      title: '基本使用',
      code: '<see-line color="#e5e5e5" margin="20rpx 0" />'
    },
    {
      title: '虚线与垂直线',
      code: '<see-line is-dashed color="#999" />\n<see-line direction="vertical" length="40rpx" size="2px" />'
    }
  ]
}

export default meta
