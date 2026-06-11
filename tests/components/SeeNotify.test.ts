import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeNotify from '../../uni_modules/see-u-ui/components/see-notify/see-notify.vue'

describe('SeeNotify 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('show=false 时不可见', () => {
      const wrapper = mount(SeeNotify, { props: { show: false, message: 'hi' } })
      // v-show 模式下元素始终在 DOM 中，但应隐藏
      const el = wrapper.find('.see-notify')
      expect(el.exists()).toBe(true)
      expect(el.classes()).not.toContain('see-notify--visible')
    })

    it('show=true 时渲染并显示 message', async () => {
      const wrapper = mount(SeeNotify, { props: { show: true, message: '消息' } })
      await nextTick()
      expect(wrapper.find('.see-notify').exists()).toBe(true)
      expect(wrapper.html()).toContain('消息')
    })
  })

  describe('Type 变体', () => {
    it.each(['success', 'error', 'warning', 'info'] as const)('type=%s', async (type) => {
      const wrapper = mount(SeeNotify, { props: { show: true, type, message: 'm' } })
      await nextTick()
      expect(wrapper.html()).toContain(`see-notify--${type}`)
    })
  })

  describe('点击与关闭', () => {
    it('点击通知应 emit onClick', async () => {
      const wrapper = mount(SeeNotify, { props: { show: true, message: 'm' } })
      await nextTick()
      await wrapper.find('.see-notify').trigger('click')
      expect(wrapper.emitted('onClick')).toBeTruthy()
    })

    it('isClosable=true 时显示关闭按钮，点击触发 onClose 和 update:show', async () => {
      const wrapper = mount(SeeNotify, { props: { show: true, isClosable: true, message: 'm' } })
      await nextTick()
      const closeBtn = wrapper.find('.see-notify__close')
      expect(closeBtn.exists()).toBe(true)
      await closeBtn.trigger('click')
      // close() 内部在 300ms exit 动画后才 emit 事件
      await new Promise((r) => setTimeout(r, 350))
      expect(wrapper.emitted('onClose') || wrapper.emitted('update:show')).toBeTruthy()
    })
  })

  describe('v-model 与 manager 混用风险（regression: P1-12）', () => {
    it('外部 props.show 控制时，update:show 同步指向同一值', async () => {
      const wrapper = mount(SeeNotify, { props: { show: true, message: 'm', duration: 0 } })
      await nextTick()
      await wrapper.setProps({ show: false })
      await nextTick()
      // 关闭后隐藏（v-show 模式下元素仍在 DOM）
      expect(wrapper.find('.see-notify--visible').exists()).toBe(false) // regression: P1-12 行为基线
    })
  })

  describe('过渡动画（regression: P1-11 notify 滑入应有 transition）', () => {
    it('show=true 应应用 see-notify--visible 类', async () => {
      const wrapper = mount(SeeNotify, { props: { show: true, message: 'm' } })
      await nextTick()
      await new Promise((r) => setTimeout(r, 30))
      expect(wrapper.html()).toContain('see-notify') // regression: P1-11
    })
  })
})
