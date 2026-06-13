import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeCoupon from '../../uni_modules/see-u-ui/components/see-coupon/see-coupon.vue'

describe('SeeCoupon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================
  // 基础渲染
  // ============================================================

  it('基础渲染', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, condition: '满 100 元可用' }
    })
    expect(wrapper.find('.see-coupon').exists()).toBe(true)
  })

  it('渲染金额与单位', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, unit: '¥' }
    })
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('¥')
  })

  it('渲染折扣文案（discountText 优先于 amount）', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, discountText: '8.8 折' }
    })
    expect(wrapper.text()).toContain('8.8 折')
  })

  it('渲染使用条件', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, condition: '满 200 元可用' }
    })
    expect(wrapper.text()).toContain('满 200 元可用')
  })

  it('渲染标题与描述', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, title: '新人专享', description: '仅限新注册用户' }
    })
    expect(wrapper.text()).toContain('新人专享')
    expect(wrapper.text()).toContain('仅限新注册用户')
  })

  it('渲染有效期', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, validDate: '有效期至 2026-12-31' }
    })
    expect(wrapper.text()).toContain('有效期至 2026-12-31')
  })

  it('渲染按钮文字', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, buttonText: '立即领取' }
    })
    expect(wrapper.text()).toContain('立即领取')
  })

  // ============================================================
  // 状态
  // ============================================================

  it('isDisabled 时整张卡片不可用样式', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, isDisabled: true }
    })
    expect(wrapper.find('.see-coupon--disabled').exists()).toBe(true)
  })

  it('status=used 时显示已使用印章', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, status: 'used' }
    })
    expect(wrapper.find('.see-coupon__stamp').exists()).toBe(true)
    expect(wrapper.text()).toContain('Used')
  })

  it('status=expired 时显示已过期印章', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, status: 'expired' }
    })
    expect(wrapper.find('.see-coupon__stamp').exists()).toBe(true)
    expect(wrapper.text()).toContain('Expired')
  })

  it('status=received 时按钮文字变为已领取', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, status: 'received', buttonText: '立即领取' }
    })
    expect(wrapper.text()).toContain('Claimed')
  })

  it('status!=available 时按钮 disabled', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, status: 'received' }
    })
    expect(wrapper.find('.see-coupon__button--disabled').exists()).toBe(true)
  })

  // ============================================================
  // 主题
  // ============================================================

  it('type=primary 默认主题类', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10 }
    })
    expect(wrapper.find('.see-coupon--primary').exists()).toBe(true)
  })

  it('type=warning 时应用 warning 类', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, type: 'warning' }
    })
    expect(wrapper.find('.see-coupon--warning').exists()).toBe(true)
  })

  it('type=success 时应用 success 类', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, type: 'success' }
    })
    expect(wrapper.find('.see-coupon--success').exists()).toBe(true)
  })

  it('type=error 时应用 error 类', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, type: 'error' }
    })
    expect(wrapper.find('.see-coupon--error').exists()).toBe(true)
  })

  // ============================================================
  // tag
  // ============================================================

  it('渲染 tag 右上角小标签', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, tag: '限时' }
    })
    expect(wrapper.find('.see-coupon__tag').exists()).toBe(true)
    expect(wrapper.text()).toContain('限时')
  })

  it('无 tag 时不渲染标签元素', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10 }
    })
    expect(wrapper.find('.see-coupon__tag').exists()).toBe(false)
  })

  // ============================================================
  // 事件
  // ============================================================

  it('点击卡片触发 onClick', async () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10 }
    })
    await wrapper.find('.see-coupon').trigger('tap')
    expect(wrapper.emitted('onClick')).toBeTruthy()
  })

  it('点击按钮触发 onButtonClick 且不冒泡到 onClick', async () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10 }
    })
    await wrapper.find('.see-coupon__button').trigger('tap')
    expect(wrapper.emitted('onButtonClick')).toBeTruthy()
    expect(wrapper.emitted('onClick')).toBeFalsy()
  })

  it('isDisabled 时点击不触发事件', async () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, isDisabled: true }
    })
    await wrapper.find('.see-coupon').trigger('tap')
    await wrapper.find('.see-coupon__button').trigger('tap')
    expect(wrapper.emitted('onClick')).toBeFalsy()
    expect(wrapper.emitted('onButtonClick')).toBeFalsy()
  })

  it('status=used 时按钮不触发 onButtonClick', async () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10, status: 'used' }
    })
    await wrapper.find('.see-coupon__button').trigger('tap')
    expect(wrapper.emitted('onButtonClick')).toBeFalsy()
  })

  // ============================================================
  // 插槽
  // ============================================================

  it('amount 插槽可替换金额区', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10 },
      slots: { amount: '<text class="custom-amount">自定义金额</text>' }
    })
    expect(wrapper.find('.custom-amount').exists()).toBe(true)
  })

  it('button 插槽可替换按钮', () => {
    const wrapper = mount(SeeCoupon, {
      props: { amount: 10 },
      slots: { button: '<text class="custom-btn">去使用</text>' }
    })
    expect(wrapper.find('.custom-btn').exists()).toBe(true)
  })
})
