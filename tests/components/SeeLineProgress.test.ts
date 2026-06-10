import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeLineProgress from '@/uni_modules/see-u-ui/components/see-line-progress/see-line-progress.vue'

describe('SeeLineProgress', () => {
  it('renders with default props', () => {
    const wrapper = mount(SeeLineProgress)
    expect(wrapper.find('.see-line-progress').exists()).toBe(true)
    expect(wrapper.find('.see-line-progress__bar').attributes('style')).toContain('width: 0%')
    expect(wrapper.text()).toContain('0%')
  })

  it('clamps percentage between 0 and 100', async () => {
    const wrapper = mount(SeeLineProgress, { props: { percentage: 128 } })
    expect(wrapper.find('.see-line-progress__bar').attributes('style')).toContain('width: 100%')

    await wrapper.setProps({ percentage: -20 })
    expect(wrapper.find('.see-line-progress__bar').attributes('style')).toContain('width: 0%')
  })

  it('calculates percent from max', () => {
    const wrapper = mount(SeeLineProgress, { props: { percentage: 25, max: 50 } })
    expect(wrapper.find('.see-line-progress__bar').attributes('style')).toContain('width: 50%')
    expect(wrapper.text()).toContain('50%')
  })

  it('supports status, striped, animated and textInside classes', () => {
    const wrapper = mount(SeeLineProgress, {
      props: { percentage: 60, status: 'success', striped: true, animated: true, textInside: true }
    })
    expect(wrapper.classes()).toContain('see-line-progress--success')
    expect(wrapper.classes()).toContain('is-striped')
    expect(wrapper.classes()).toContain('is-animated')
    expect(wrapper.classes()).toContain('is-text-inside')
  })

  it('supports gradient activeColor', () => {
    const wrapper = mount(SeeLineProgress, {
      props: { percentage: 40, activeColor: ['#2f80ed', '#67c23a'] }
    })
    expect(wrapper.find('.see-line-progress__bar').attributes('style')).toContain('linear-gradient')
  })

  it('renders text slot with clamped percentage', () => {
    const wrapper = mount(SeeLineProgress, {
      props: { percentage: 72 },
      slots: { text: '<text class="custom-text">done</text>' }
    })
    expect(wrapper.find('.custom-text').exists()).toBe(true)
  })

  it('emits onChange and onComplete', async () => {
    const onComplete = vi.fn()
    const wrapper = mount(SeeLineProgress, {
      props: { percentage: 20, onOnComplete: onComplete }
    })

    await wrapper.setProps({ percentage: 100 })
    expect(wrapper.emitted('onChange')?.at(-1)?.[0]).toBe(100)
    expect(wrapper.emitted('onComplete')).toBeTruthy()
  })
})
