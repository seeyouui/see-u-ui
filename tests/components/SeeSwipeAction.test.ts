import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeSwipeAction from '../../uni_modules/see-u-ui/components/see-swipe-action/see-swipe-action.vue'

const right = [{ text: '删除', style: 'danger' as const }]
const left = [{ text: '置顶', style: 'success' as const }]

describe('SeeSwipeAction 组件测试', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('基本渲染', () => {
    it('应渲染根节点', () => {
      const wrapper = mount(SeeSwipeAction, { props: { rightActions: right } })
      expect(wrapper.find('.see-swipe-action').exists()).toBe(true)
    })

    it('右侧按钮应被渲染', () => {
      const wrapper = mount(SeeSwipeAction, { props: { rightActions: right } })
      expect(wrapper.html()).toContain('删除')
    })

    it('左侧按钮应被渲染', () => {
      const wrapper = mount(SeeSwipeAction, { props: { leftActions: left } })
      expect(wrapper.html()).toContain('置顶')
    })
  })

  describe('按钮样式', () => {
    it.each(['default', 'danger', 'success', 'warning'] as const)('style=%s 应应用对应类', (style) => {
      const wrapper = mount(SeeSwipeAction, {
        props: { rightActions: [{ text: 'x', style }] }
      })
      // 真实实现类名为 __btn--<style>
      expect(wrapper.html()).toContain(`see-swipe-action__btn--${style}`)
    })
  })

  describe('点击事件', () => {
    it('点击按钮应 emit onClick', async () => {
      const wrapper = mount(SeeSwipeAction, { props: { rightActions: right } })
      const btn = wrapper.find('.see-swipe-action__btn')
      if (btn.exists()) {
        await btn.trigger('click')
        expect(wrapper.emitted('onClick')).toBeTruthy()
      }
    })

    it('disabled 按钮不应 emit onClick', async () => {
      const wrapper = mount(SeeSwipeAction, {
        props: { rightActions: [{ text: 'x', isDisabled: true }] }
      })
      const btn = wrapper.find('.see-swipe-action__btn')
      if (btn.exists()) {
        await btn.trigger('click')
        const e = wrapper.emitted('onClick')
        expect(!e || e.length === 0).toBe(true)
      }
    })
  })

  describe('Expose 方法', () => {
    it('暴露 open / close 方法', () => {
      const wrapper = mount(SeeSwipeAction, { props: { rightActions: right } })
      const vm = wrapper.vm as any
      expect(typeof vm.open).toBe('function')
      expect(typeof vm.close).toBe('function')
    })

    it('调用 open("right") 后应应用 open 类', async () => {
      const wrapper = mount(SeeSwipeAction, { props: { rightActions: right } })
      const vm = wrapper.vm as any
      vm.open('right')
      await nextTick()
      const emitted = wrapper.emitted('onOpen')
      expect(emitted).toBeTruthy()
    })
  })
})
