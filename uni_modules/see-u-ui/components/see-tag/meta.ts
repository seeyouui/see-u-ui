import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeTag AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeTag',
  tag: 'see-tag',
  title: '标签',
  titleEn: 'Tag',
  category: '基础组件',
  description: '标签组件，用于标记与分类，支持 6 种主题类型、dark/light/plain 三种效果、大小、圆角、可关闭与自定义颜色，文本通过默认插槽传入',
  docUrl: '/components/tag/',
  examples: [
    {
      title: '基本使用',
      code: '<see-tag>默认</see-tag>\n<see-tag type="primary">主要</see-tag>\n<see-tag type="success">成功</see-tag>\n<see-tag type="warning">警告</see-tag>\n<see-tag type="danger">危险</see-tag>\n<see-tag type="info">信息</see-tag>'
    },
    {
      title: '可关闭与圆角',
      code: '<see-tag type="primary" effect="plain" :round="true" :closable="true" @on-close="onClose">标签</see-tag>'
    }
  ]
}

export default meta
