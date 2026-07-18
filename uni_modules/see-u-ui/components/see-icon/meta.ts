import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeIcon AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeIcon',
  tag: 'see-icon',
  title: '图标',
  titleEn: 'Icon',
  category: '基础组件',
  description: '图标组件，支持 Unicode 字符、图片路径、自定义图标字体等',
  docUrl: '/components/icon/',
  examples: [
    {
      title: '基本使用',
      code: '<see-icon name="checkmark" />'
    },
    {
      title: 'Unicode 字符',
      code: '<see-icon name="✓" />'
    },
    {
      title: '图片图标',
      code: '<see-icon name="/static/icon.png" :size="32" />'
    },
    {
      title: '自定义颜色和大小',
      code: '<see-icon name="home" :size="24" color="#7232dd" />'
    },
    {
      title: '自定义图标字体',
      code: '<see-icon name="home" custom-prefix="my-icon" custom-font="MyIconFont" />'
    }
  ]
}

export default meta
