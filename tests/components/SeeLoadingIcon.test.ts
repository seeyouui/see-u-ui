import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeLoadingIcon from '@/uni_modules/see-u-ui/components/see-loading-icon/see-loading-icon.vue'

describe('SeeLoadingIcon', () => {
  it('default type is spinner', () => {
    const wrapper = mount(SeeLoadingIcon)
    expect(wrapper.classes()).toContain('see-loading-icon--spinner')
  })

  it('type switching adds correct class', () => {
    const types = ['spinner', 'circular', 'dots', 'pulse'] as const
    types.forEach((type) => {
      const wrapper = mount(SeeLoadingIcon, { props: { type } })
      expect(wrapper.classes()).toContain(`see-loading-icon--${type}`)
    })
  })

  it('custom size applies to style', () => {
    const wrapper = mount(SeeLoadingIcon, { props: { size: '80rpx' } })
    expect(wrapper.attributes('style')).toContain('width: 80rpx')
    expect(wrapper.attributes('style')).toContain('height: 80rpx')
  })

  it('custom color applies to style', () => {
    const wrapper = mount(SeeLoadingIcon, { props: { color: '#ff0000' } })
    expect(wrapper.attributes('style')).toContain('color: #ff0000')
  })

  it('custom speed applies to style', () => {
    const wrapper = mount(SeeLoadingIcon, { props: { speed: 1.5 } })
    expect(wrapper.attributes('style')).toContain('--loading-speed: 1.5s')
  })

  it('spinner type renders spinner-circle', () => {
    const wrapper = mount(SeeLoadingIcon, { props: { type: 'spinner' } })
    expect(wrapper.find('.see-loading-icon__spinner-circle').exists()).toBe(true)
    expect(wrapper.find('.see-loading-icon__circular-dot').exists()).toBe(false)
    expect(wrapper.find('.see-loading-icon__dot').exists()).toBe(false)
    expect(wrapper.find('.see-loading-icon__pulse-ring').exists()).toBe(false)
  })

  it('circular type renders circular-dot', () => {
    const wrapper = mount(SeeLoadingIcon, { props: { type: 'circular' } })
    expect(wrapper.find('.see-loading-icon__circular-dot').exists()).toBe(true)
    expect(wrapper.find('.see-loading-icon__spinner-circle').exists()).toBe(false)
    expect(wrapper.find('.see-loading-icon__dot').exists()).toBe(false)
    expect(wrapper.find('.see-loading-icon__pulse-ring').exists()).toBe(false)
  })

  it('dots type renders 3 dots', () => {
    const wrapper = mount(SeeLoadingIcon, { props: { type: 'dots' } })
    expect(wrapper.find('.see-loading-icon__dots').exists()).toBe(true)
    expect(wrapper.findAll('.see-loading-icon__dot')).toHaveLength(3)
    expect(wrapper.find('.see-loading-icon__spinner-circle').exists()).toBe(false)
    expect(wrapper.find('.see-loading-icon__circular-dot').exists()).toBe(false)
    expect(wrapper.find('.see-loading-icon__pulse-ring').exists()).toBe(false)
  })

  it('pulse type renders pulse-ring', () => {
    const wrapper = mount(SeeLoadingIcon, { props: { type: 'pulse' } })
    expect(wrapper.find('.see-loading-icon__pulse-ring').exists()).toBe(true)
    expect(wrapper.find('.see-loading-icon__spinner-circle').exists()).toBe(false)
    expect(wrapper.find('.see-loading-icon__circular-dot').exists()).toBe(false)
    expect(wrapper.find('.see-loading-icon__dot').exists()).toBe(false)
  })

  it('default props are applied correctly', () => {
    const wrapper = mount(SeeLoadingIcon)
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('width: 60rpx')
    expect(style).toContain('height: 60rpx')
    expect(style).toContain('color: var(--see-primary)')
    expect(style).toContain('--loading-speed: 0.8s')
  })
})
