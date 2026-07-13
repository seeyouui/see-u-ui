import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCountDown AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCountDown',
  tag: 'see-count-down',
  title: '倒计时',
  titleEn: 'CountDown',
  category: '数据组件',
  description: '倒计时组件，用于验证码、活动、支付剩余时间与订单超时场景，支持自定义格式、毫秒级、服务端时间校准与作用域插槽',
  docUrl: '/components/count-down/',
  examples: [
    {
      title: '基本使用',
      code: '<see-count-down :time="60000" @on-finish="onFinish" />'
    },
    {
      title: '自定义格式与天数',
      code: '<see-count-down :time="90061000" :showDays="true" format="DD 天 HH:mm:ss" @on-change="onChange" />'
    }
  ]
}

export default meta
