import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeNoticeBar from '../../uni_modules/see-u-ui/components/see-notice-bar/see-notice-bar.vue'

describe('SeeNoticeBar 组件测试', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('基本渲染', () => {
    it('isShow=true 时渲染（默认）', () => {
      const wrapper = mount(SeeNoticeBar, { props: { text: '通知' } })
      expect(wrapper.find('.see-notice-bar').exists()).toBe(true)
      expect(wrapper.html()).toContain('通知')
    })

    it('isShow=false 时不渲染', () => {
      const wrapper = mount(SeeNoticeBar, { props: { text: '通知', isShow: false } })
      expect(wrapper.find('.see-notice-bar').exists()).toBe(false)
    })
  })

  describe('Type 变体', () => {
    it.each(['info', 'warning', 'error'] as const)('type=%s', (type) => {
      const wrapper = mount(SeeNoticeBar, { props: { text: 't', type } })
      expect(wrapper.html()).toContain(`see-notice-bar--${type}`)
    })
  })

  describe('滚动模式', () => {
    it('isScrollable=true 时渲染滚动容器和重复文字', () => {
      const wrapper = mount(SeeNoticeBar, { props: { text: 'abc', isScrollable: true } })
      expect(wrapper.find('.see-notice-bar__scroll').exists()).toBe(true)
      const dups = wrapper.findAll('.see-notice-bar__text--duplicate')
      expect(dups.length).toBeGreaterThan(0)
    })

    it('isScrollable=false 时渲染静态文字', () => {
      const wrapper = mount(SeeNoticeBar, { props: { text: 'abc', isScrollable: false } })
      expect(wrapper.find('.see-notice-bar__static').exists()).toBe(true)
    })

    it('vertical=true 时渲染垂直滚动容器', () => {
      const wrapper = mount(SeeNoticeBar, {
        props: { text: '', vertical: true, messages: ['a', 'b', 'c'] }
      })
      expect(wrapper.find('.see-notice-bar__vertical').exists()).toBe(true)
    })
  })

  describe('关闭功能', () => {
    it('isClosable=true 时显示关闭按钮', () => {
      const wrapper = mount(SeeNoticeBar, { props: { text: 't', isClosable: true } })
      expect(wrapper.find('.see-notice-bar__close').exists()).toBe(true)
    })

    it('点击关闭按钮应 emit onClose 并隐藏', async () => {
      const wrapper = mount(SeeNoticeBar, { props: { text: 't', isClosable: true } })
      await wrapper.find('.see-notice-bar__close').trigger('click')
      expect(wrapper.emitted('onClose')).toBeTruthy()
      await nextTick()
      expect(wrapper.find('.see-notice-bar').exists()).toBe(false)
    })
  })

  describe('点击事件', () => {
    it('点击主体应 emit onClick', async () => {
      const wrapper = mount(SeeNoticeBar, { props: { text: 't' } })
      await wrapper.find('.see-notice-bar').trigger('click')
      expect(wrapper.emitted('onClick')).toBeTruthy()
    })

    it('rightIcon 提供时点击 emit onRightClick', async () => {
      const wrapper = mount(SeeNoticeBar, { props: { text: 't', rightIcon: '>' } })
      const right = wrapper.find('.see-notice-bar__right')
      if (right.exists()) {
        await right.trigger('click')
        expect(wrapper.emitted('onRightClick')).toBeTruthy()
      }
    })
  })

  describe('Speed 与 duration（regression: P1-13 speed 越大应越快）', () => {
    it('[修复后通过] speed=200 的滚动 duration 应短于 speed=50（regression: P1-13）', () => {
      const fast = mount(SeeNoticeBar, {
        props: { text: 'a'.repeat(50), isScrollable: true, speed: 200 }
      })
      const slow = mount(SeeNoticeBar, {
        props: { text: 'a'.repeat(50), isScrollable: true, speed: 50 }
      })
      const fastStyle = fast.find('.see-notice-bar__scroll').attributes('style') || ''
      const slowStyle = slow.find('.see-notice-bar__scroll').attributes('style') || ''
      const fastDur = parseFloat((fastStyle.match(/animation-duration:\s*([\d.]+)s/) || [])[1] || '0')
      const slowDur = parseFloat((slowStyle.match(/animation-duration:\s*([\d.]+)s/) || [])[1] || '0')
      // 修复后 fastDur 应严格小于 slowDur
      expect(fastDur).toBeLessThan(slowDur)
    })
  })

  describe('Expose 方法', () => {
    it('暴露 start / pause 等方法', () => {
      const wrapper = mount(SeeNoticeBar, { props: { text: 't' } })
      const vm = wrapper.vm as any
      expect(typeof vm.start).toBe('function')
      expect(typeof vm.pause).toBe('function')
    })
  })
})
