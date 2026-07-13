import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeLoadingPage AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeLoadingPage',
  tag: 'see-loading-page',
  title: '加载页',
  titleEn: 'LoadingPage',
  category: '布局组件',
  description: '页面/区域加载状态遮罩，内置加载动画与提示文字，可选全屏，支持自定义图标类型、大小、背景和层级。',
  docUrl: '/components/loading-page/',
  examples: [
    {
      title: '基本使用',
      code: '<see-loading-page :loading="isLoading" message="加载中...">\n  <view>内容区域</view>\n</see-loading-page>'
    },
    {
      title: '全屏加载',
      code: '<see-loading-page :loading="isLoading" is-fullscreen icon-type="circular" icon-size="100rpx" />'
    }
  ]
}

export default meta
