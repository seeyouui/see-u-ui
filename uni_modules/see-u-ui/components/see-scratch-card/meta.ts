import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeScratchCard AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeScratchCard',
  tag: 'see-scratch-card',
  title: '刮刮卡',
  titleEn: 'ScratchCard',
  category: '业务组件',
  description: '基于 Canvas 的刮刮卡组件，覆盖层可用纯色/图片/文字，可配笔刷大小与揭晓阈值，达到阈值自动揭晓奖品插槽内容',
  docUrl: '/components/scratch-card/',
  examples: [
    {
      title: '基本使用',
      code: '<see-scratch-card :width="300" :height="160" coverText="刮一刮">\n  <view class="prize">恭喜获得 10 元红包</view>\n</see-scratch-card>'
    },
    {
      title: '自定义阈值与自动揭晓',
      code: '<see-scratch-card :width="400" :height="200" coverColor="#c0c0c0" :brushSize="40" :threshold="60" :autoReveal="true" @on-complete="onComplete">\n  <view class="prize">谢谢参与</view>\n</see-scratch-card>'
    }
  ]
}

export default meta
