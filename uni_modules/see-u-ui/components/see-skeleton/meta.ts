import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSkeleton AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSkeleton',
  tag: 'see-skeleton',
  title: '骨架屏',
  titleEn: 'Skeleton',
  category: '布局组件',
  description: '骨架屏占位组件，加载时按配置显示头像、标题、多行占位块，支持行数/行宽/形状及闪烁动画，加载完成显示插槽内容。',
  docUrl: '/components/skeleton/',
  examples: [
    {
      title: '基本使用',
      code: '<see-skeleton :loading="isLoading" :rows="3">\n  <text>加载完成的内容</text>\n</see-skeleton>'
    },
    {
      title: '带头像与标题',
      code: '<see-skeleton :loading="isLoading" avatar title :rows="4" avatar-shape="circle">\n  <view>内容区域</view>\n</see-skeleton>'
    }
  ]
}

export default meta
