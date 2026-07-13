import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCoupon AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCoupon',
  tag: 'see-coupon',
  title: '优惠券',
  titleEn: 'Coupon',
  category: '业务组件',
  description: '优惠券卡片组件，支持满减/折扣两种券面、四种主题色、可用/已领/已用/过期状态与领取按钮',
  docUrl: '/components/coupon/',
  examples: [
    {
      title: '满减券',
      code: '<see-coupon :amount="10" unit="¥" condition="满 100 元可用" title="新人专享券" validDate="2026-12-31 到期" buttonText="立即领取" @on-button-click="onReceive" />'
    },
    {
      title: '折扣券与状态',
      code: '<see-coupon discountText="8.5折" title="会员折扣券" type="warning" status="received" tag="限量" />'
    }
  ]
}

export default meta
