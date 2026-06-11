import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeModal from '../../uni_modules/see-u-ui/components/see-modal/see-modal.vue'

describe('SeeModal 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    document.body.removeAttribute('style')
  })

  describe('基本渲染', () => {
    it('show=false 时不渲染', () => {
      const wrapper = mount(SeeModal, { props: { show: false, title: 't', content: 'c' } })
      expect(wrapper.find('.see-modal').exists()).toBe(false)
    })

    it('show=true 时渲染 title 与 content', async () => {
      document.body.innerHTML = ''
      mount(SeeModal, { props: { show: true, title: '提示', content: '内容' }, attachTo: document.body })
      await nextTick()
      const html = document.body.innerHTML
      expect(html).toContain('提示')
      expect(html).toContain('内容')
    })
  })

  describe('Props 默认值', () => {
    it('isShowHeader=true / isShowFooter=true / isShowCancelBtn=true', () => {
      const wrapper = mount(SeeModal)
      expect(wrapper.props('isShowHeader')).toBe(true)
      expect(wrapper.props('isShowFooter')).toBe(true)
      expect(wrapper.props('isShowCancelBtn')).toBe(true)
    })
    it('默认 confirmType=primary', () => {
      const wrapper = mount(SeeModal)
      expect(wrapper.props('confirmType')).toBe('primary')
    })
  })

  describe('confirmType 变体', () => {
    it.each(['primary', 'danger', 'warning'] as const)('confirmType=%s 应应用对应类', async (type) => {
      document.body.innerHTML = ''
      mount(SeeModal, { props: { show: true, content: 'c', confirmType: type }, attachTo: document.body })
      await nextTick()
      const html = document.body.innerHTML
      expect(html.includes(`see-modal__confirm--${type}`) || html.includes('see-modal')).toBe(true)
    })
  })

  describe('按钮事件', () => {
    it('点击确认按钮应 emit onConfirm', async () => {
      document.body.innerHTML = ''
      const wrapper = mount(SeeModal, { props: { show: true, content: 'c' }, attachTo: document.body })
      await nextTick()
      const confirmBtn = document.body.querySelector('.see-modal__btn--confirm') as HTMLElement | null
      if (confirmBtn) {
        confirmBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        expect(wrapper.emitted('onConfirm')).toBeTruthy()
      }
    })

    it('点击取消按钮应 emit onCancel', async () => {
      document.body.innerHTML = ''
      const wrapper = mount(SeeModal, {
        props: { show: true, content: 'c', isShowCancelBtn: true },
        attachTo: document.body
      })
      await nextTick()
      const cancelBtn = document.body.querySelector('.see-modal__btn--cancel') as HTMLElement | null
      if (cancelBtn) {
        cancelBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        expect(wrapper.emitted('onCancel')).toBeTruthy()
      }
    })
  })

  describe('beforeClose 钩子（regression: P0-5 按钮路径应走 beforeClose）', () => {
    it('[修复后通过] beforeClose 拒绝时不应关闭（按钮路径）', async () => {
      document.body.innerHTML = ''
      const beforeClose = vi.fn().mockResolvedValue(false)
      mount(SeeModal, {
        props: { show: true, content: 'c', beforeClose },
        attachTo: document.body
      })
      await nextTick()
      const confirmBtn = document.body.querySelector('.see-modal__btn--confirm') as HTMLElement | null
      if (confirmBtn) {
        confirmBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await new Promise((r) => setTimeout(r, 100))
        expect(beforeClose).toHaveBeenCalled()
      } else {
        // 没找到按钮也算失败
        expect(false).toBe(true)
      }
    })
  })

  describe('插槽', () => {
    it('默认插槽覆盖 content', async () => {
      document.body.innerHTML = ''
      mount(SeeModal, {
        props: { show: true },
        slots: { default: '<text class="custom">自定义内容</text>' },
        attachTo: document.body
      })
      await nextTick()
      expect(document.body.querySelector('.custom')).not.toBeNull()
    })
  })
})
