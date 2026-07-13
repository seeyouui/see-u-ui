import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeWatermark AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeWatermark',
  tag: 'see-watermark',
  title: '水印',
  titleEn: 'Watermark',
  category: '业务组件',
  description: '水印组件，在内容区平铺文字水印，支持单行/多行内容、间距、旋转角度、字体样式、层级与全屏 fixed 覆盖',
  docUrl: '/components/watermark/',
  examples: [
    {
      title: '基本使用',
      code: '<see-watermark content="SeeYouUI">\n  <view class="your-content">敏感信息区域</view>\n</see-watermark>'
    },
    {
      title: '多行水印与旋转',
      code: '<see-watermark :content="[\'SeeYouUI\', \'机密文件\']" :rotate="-30" :gap="[40, 40]" fontColor="rgba(0,0,0,0.1)">\n  <view style="height: 600rpx;">页面内容</view>\n</see-watermark>'
    }
  ]
}

export default meta
