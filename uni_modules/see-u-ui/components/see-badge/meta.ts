import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeBadge AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeBadge',
  tag: 'see-badge',
  title: 'badge',
  titleEn: 'Badge',
  category: '基础组件',
  description: '徽标数组件，用于显示未读消息数量、状态提示等，支持圆点/数字两种形式、主题色、最大值溢出、绝对定位与显隐动画',
  docUrl: '/components/badge/',
  examples: [
    {
      title: '数字徽标',
      code: '<see-badge :value="5" type="error"></see-badge>'
    },
    {
      title: '圆点与绝对定位',
      code: '<view style="position: relative;">\n  <see-icon />\n  <see-badge :isDot="true" type="success" :absolute="true" :offset="[0, 0]"></see-badge>\n</view>'
    }
  ]
}

export default meta
