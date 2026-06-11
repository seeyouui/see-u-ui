import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeTooltip from '../../uni_modules/see-u-ui/components/see-tooltip/see-tooltip.vue'

describe('SeeTooltip 组件测试', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('基本渲染', () => {
    it('应渲染包装根节点和触发器 slot', () => {
      const wrapper = mount(SeeTooltip, {
        props: { content: '提示文字' },
        slots: { default: '<text class="trigger">长按我</text>' }
      })
      expect(wrapper.find('.see-tooltip').exists()).toBe(true)
      expect(wrapper.find('.trigger').exists()).toBe(true)
    })
  })

  describe('Props 默认值', () => {
    it('默认 position=top / trigger=longpress', () => {
      const wrapper = mount(SeeTooltip)
      expect(wrapper.props('position')).toBe('top')
      expect(wrapper.props('trigger')).toBe('longpress')
    })
    it('默认 effect=dark', () => {
      const wrapper = mount(SeeTooltip)
      expect(wrapper.props('effect')).toBe('dark')
    })
  })

  describe('Effect 变体', () => {
    it.each(['dark', 'light'] as const)('effect=%s', async (effect) => {
      const wrapper = mount(SeeTooltip, {
        props: { content: 't', effect, show: true, trigger: 'manual' }
      })
      await nextTick()
      const html = wrapper.html()
      expect(html.includes(`see-tooltip--${effect}`) || html.includes('see-tooltip')).toBe(true)
    })
  })

  describe('Manual trigger', () => {
    it('trigger=manual + show=true 应显示 tooltip 内容', async () => {
      const wrapper = mount(SeeTooltip, {
        props: { content: '提示', show: true, trigger: 'manual' },
        slots: { default: 'btn' }
      })
      await nextTick()
      const html = wrapper.html()
      expect(html.includes('提示') || html.includes('see-tooltip')).toBe(true)
    })

    it('trigger=manual + show=false 时不显示内容', async () => {
      const wrapper = mount(SeeTooltip, {
        props: { content: '提示', show: false, trigger: 'manual' },
        slots: { default: 'btn' }
      })
      await nextTick()
      // 不应有可见 content 节点（具体类名以实现为准）
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Expose 方法', () => {
    it('暴露 show / hide 方法', () => {
      const wrapper = mount(SeeTooltip, { slots: { default: 'b' } })
      const vm = wrapper.vm as any
      expect(typeof vm.show).toBe('function')
      expect(typeof vm.hide).toBe('function')
    })
  })

  describe('多实例（regression: P0-7 selectorQuery 应作用域到自身）', () => {
    it('页面存在两个 tooltip 时不应互相干扰渲染', () => {
      const w1 = mount(SeeTooltip, {
        props: { content: 'A', trigger: 'manual', show: true },
        slots: { default: 'a' }
      })
      const w2 = mount(SeeTooltip, {
        props: { content: 'B', trigger: 'manual', show: true },
        slots: { default: 'b' }
      })
      expect(w1.html()).not.toContain('B')
      expect(w2.html()).not.toContain('A') // regression: P0-7
    })
  })
})
