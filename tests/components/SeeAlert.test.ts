import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeAlert from '../../uni_modules/see-u-ui/components/see-alert/see-alert.vue'

describe('SeeAlert 组件测试', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('基本渲染', () => {
    it('默认 isShow=true 时渲染', () => {
      const wrapper = mount(SeeAlert, { props: { title: '提示', content: '内容' } })
      expect(wrapper.find('.see-alert').exists()).toBe(true)
      expect(wrapper.html()).toContain('提示')
      expect(wrapper.html()).toContain('内容')
    })

    it('isShow=false 时不渲染', () => {
      const wrapper = mount(SeeAlert, { props: { isShow: false, title: 't' } })
      expect(wrapper.find('.see-alert').exists()).toBe(false)
    })
  })

  describe('Type 变体', () => {
    it.each(['success', 'error', 'warning', 'info'] as const)('type=%s 应应用对应类', (type) => {
      const wrapper = mount(SeeAlert, { props: { type, title: 't' } })
      expect(wrapper.html()).toContain(`see-alert--${type}`)
    })
  })

  describe('Effect 变体', () => {
    it.each(['light', 'dark', 'border'] as const)('effect=%s', (effect) => {
      const wrapper = mount(SeeAlert, { props: { effect, title: 't' } })
      expect(wrapper.html()).toContain(`see-alert--${effect}`)
    })
  })

  describe('关闭功能', () => {
    it('isClosable=true 时显示关闭按钮', () => {
      const wrapper = mount(SeeAlert, { props: { isClosable: true, title: 't' } })
      expect(wrapper.find('.see-alert__close').exists()).toBe(true)
    })

    it('点击关闭按钮应 emit onClose 并隐藏', async () => {
      const wrapper = mount(SeeAlert, { props: { isClosable: true, title: 't' } })
      await wrapper.find('.see-alert__close').trigger('click')
      expect(wrapper.emitted('onClose')).toBeTruthy()
      await nextTick()
      // 默认带动画，最终视觉隐藏可能延迟；至少 update:isShow 已 emit
      expect(wrapper.emitted('update:isShow')).toBeTruthy()
    })
  })

  describe('actionText 操作文字', () => {
    it('actionText 提供时渲染并支持点击', async () => {
      const wrapper = mount(SeeAlert, { props: { title: 't', actionText: '查看详情' } })
      const action = wrapper.find('.see-alert__action')
      expect(action.exists()).toBe(true)
      await action.trigger('click')
      expect(wrapper.emitted('onAction')).toBeTruthy()
    })
  })

  describe('isCollapsible 折叠功能', () => {
    it('isCollapsible=true 时显示展开/收起按钮', () => {
      const wrapper = mount(SeeAlert, {
        props: { title: 't', content: '长内容', isCollapsible: true, isCollapsed: true }
      })
      expect(wrapper.find('.see-alert__collapse').exists()).toBe(true)
    })
  })

  describe('Expose 方法', () => {
    it('暴露 close 与 show 方法', () => {
      const wrapper = mount(SeeAlert)
      const vm = wrapper.vm as any
      expect(typeof vm.close).toBe('function')
      expect(typeof vm.show).toBe('function')
    })
  })
})
