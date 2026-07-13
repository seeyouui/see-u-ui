import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeLoadingIcon AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeLoadingIcon',
  tag: 'see-loading-icon',
  title: '加载动画',
  titleEn: 'LoadingIcon',
  category: '布局组件',
  description: '加载动画图标，支持 spinner / circular / dots / pulse 四种类型，可自定义尺寸、颜色和动画速度。',
  docUrl: '/components/loading-icon/',
  examples: [
    {
      title: '基本使用',
      code: '<see-loading-icon type="spinner" size="60rpx" color="#3c9cff" />'
    },
    {
      title: '三点弹跳',
      code: '<see-loading-icon type="dots" :speed="1" />'
    }
  ]
}

export default meta
