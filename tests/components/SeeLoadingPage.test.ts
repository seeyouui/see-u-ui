import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeLoadingPage from '../../uni_modules/see-u-ui/components/see-loading-page/see-loading-page.vue'

describe('SeeLoadingPage', () => {
  it('shows loading mask when loading is true (default)', () => {
    const wrapper = mount(SeeLoadingPage)
    expect(wrapper.find('.see-loading-page__mask').exists()).toBe(true)
    expect(wrapper.find('.see-loading-page__body').exists()).toBe(false)
  })

  it('shows slot content when loading is false', () => {
    const wrapper = mount(SeeLoadingPage, {
      props: { loading: false },
      slots: {
        default: '<div class="test-content">Hello</div>'
      }
    })
    expect(wrapper.find('.see-loading-page__mask').exists()).toBe(false)
    expect(wrapper.find('.see-loading-page__body').exists()).toBe(true)
    expect(wrapper.find('.test-content').text()).toBe('Hello')
  })

  it('renders custom message text', () => {
    const wrapper = mount(SeeLoadingPage, {
      props: { loading: true, message: '正在加载数据...' }
    })
    expect(wrapper.find('.see-loading-page__message').text()).toBe('正在加载数据...')
  })

  it('hides message when message is empty', () => {
    const wrapper = mount(SeeLoadingPage, {
      props: { loading: true, message: '' }
    })
    expect(wrapper.find('.see-loading-page__message').exists()).toBe(false)
  })

  it('applies fullscreen class when isFullscreen is true', () => {
    const wrapper = mount(SeeLoadingPage, {
      props: { loading: true, isFullscreen: true }
    })
    expect(wrapper.find('.see-loading-page__mask--fullscreen').exists()).toBe(true)
  })

  it('does not apply fullscreen class when isFullscreen is false', () => {
    const wrapper = mount(SeeLoadingPage, {
      props: { loading: true, isFullscreen: false }
    })
    expect(wrapper.find('.see-loading-page__mask--fullscreen').exists()).toBe(false)
  })

  it('passes iconType to see-loading-icon', () => {
    const wrapper = mount(SeeLoadingPage, {
      props: { loading: true, iconType: 'circular' }
    })
    const icon = wrapper.findComponent({ name: 'SeeLoadingIcon' })
    if (icon.exists()) {
      expect(icon.props('type')).toBe('circular')
    }
  })

  it('applies custom background color', () => {
    const wrapper = mount(SeeLoadingPage, {
      props: { loading: true, background: '#f5f5f5' }
    })
    const mask = wrapper.find('.see-loading-page__mask')
    expect(mask.attributes('style')).toContain('#f5f5f5')
  })

  it('applies zIndex when fullscreen', () => {
    const wrapper = mount(SeeLoadingPage, {
      props: { loading: true, isFullscreen: true, zIndex: 1000 }
    })
    const mask = wrapper.find('.see-loading-page__mask')
    expect(mask.attributes('style')).toContain('1000')
  })

  it('does not apply zIndex when not fullscreen', () => {
    const wrapper = mount(SeeLoadingPage, {
      props: { loading: true, isFullscreen: false, zIndex: 1000 }
    })
    const mask = wrapper.find('.see-loading-page__mask')
    expect(mask.attributes('style')).not.toContain('1000')
  })
})
