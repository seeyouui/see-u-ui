import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeCard from '../../uni_modules/see-u-ui/components/see-card/see-card.vue'

describe('SeeCard 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeCard, {
        slots: { default: '<text>卡片内容</text>' }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-card').exists()).toBe(true)
    })

    it('应该显示插槽内容', () => {
      const wrapper = mount(SeeCard, {
        slots: { default: '<text>测试内容</text>' }
      })
      expect(wrapper.html()).toContain('测试内容')
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeCard)
      expect(wrapper.props('padding')).toBe('30rpx')
      expect(wrapper.props('shadow')).toBe('always')
      expect(wrapper.props('radius')).toBe('16rpx')
      expect(wrapper.props('margin')).toBe('30rpx')
      expect(wrapper.props('border')).toBe(true)
      expect(wrapper.props('width')).toBe('100%')
    })
  })

  describe('标题', () => {
    it('应该渲染 title', () => {
      const wrapper = mount(SeeCard, {
        props: { title: '卡片标题' }
      })
      expect(wrapper.find('.see-card__title').text()).toBe('卡片标题')
    })

    it('应该渲染 subTitle', () => {
      const wrapper = mount(SeeCard, {
        props: { title: '标题', subTitle: '副标题' }
      })
      expect(wrapper.find('.see-card__sub-title').text()).toBe('副标题')
    })

    it('没有 title 时不应该渲染 header', () => {
      const wrapper = mount(SeeCard)
      expect(wrapper.find('.see-card__header').exists()).toBe(false)
    })
  })

  describe('阴影', () => {
    it('shadow=always 应该应用阴影样式', () => {
      const wrapper = mount(SeeCard, {
        props: { shadow: 'always' }
      })
      const style = wrapper.find('.see-card').attributes('style')
      expect(style).toContain('box-shadow')
    })

    it('shadow=never 不应该有阴影', () => {
      const wrapper = mount(SeeCard, {
        props: { shadow: 'never' }
      })
      const style = wrapper.find('.see-card').attributes('style')
      expect(style).toContain('box-shadow: none')
    })

    it('shadow=hover 应该有 hover 类', () => {
      const wrapper = mount(SeeCard, {
        props: { shadow: 'hover' }
      })
      expect(wrapper.find('.see-card--shadow-hover').exists()).toBe(true)
    })
  })

  describe('边框', () => {
    it('border=true 应该显示边框', () => {
      const wrapper = mount(SeeCard, {
        props: { border: true }
      })
      expect(wrapper.find('.see-card--border').exists()).toBe(true)
      const style = wrapper.find('.see-card').attributes('style')
      expect(style).toContain('border-style: solid')
    })

    it('border=false 不应该显示边框', () => {
      const wrapper = mount(SeeCard, {
        props: { border: false }
      })
      const style = wrapper.find('.see-card').attributes('style')
      expect(style).not.toContain('border-style: solid')
    })
  })

  describe('样式属性', () => {
    it('应该应用自定义 padding', () => {
      const wrapper = mount(SeeCard, {
        props: { padding: '20rpx' }
      })
      const style = wrapper.find('.see-card').attributes('style')
      expect(style).toContain('padding: 20rpx')
    })

    it('应该应用自定义 radius', () => {
      const wrapper = mount(SeeCard, {
        props: { radius: '20rpx' }
      })
      const style = wrapper.find('.see-card').attributes('style')
      expect(style).toContain('border-radius: 20rpx')
    })

    it('应该应用自定义 margin', () => {
      const wrapper = mount(SeeCard, {
        props: { margin: '40rpx' }
      })
      const style = wrapper.find('.see-card').attributes('style')
      expect(style).toContain('margin: 40rpx')
    })

    it('应该应用自定义 width', () => {
      const wrapper = mount(SeeCard, {
        props: { width: '80%' }
      })
      const style = wrapper.find('.see-card').attributes('style')
      expect(style).toContain('width: 80%')
    })
  })

  describe('插槽', () => {
    it('应该渲染 default 插槽', () => {
      const wrapper = mount(SeeCard, {
        slots: { default: '<text>默认插槽</text>' }
      })
      expect(wrapper.html()).toContain('默认插槽')
    })

    it('应该渲染 header 插槽', () => {
      const wrapper = mount(SeeCard, {
        slots: { header: '<text>自定义头部</text>' }
      })
      expect(wrapper.html()).toContain('自定义头部')
    })

    it('应该渲染 footer 插槽', () => {
      const wrapper = mount(SeeCard, {
        slots: { footer: '<text>自定义底部</text>' }
      })
      expect(wrapper.find('.see-card__footer').exists()).toBe(true)
      expect(wrapper.html()).toContain('自定义底部')
    })
  })

  describe('事件', () => {
    it('点击卡片应该触发 onClick', async () => {
      const wrapper = mount(SeeCard)
      await wrapper.find('.see-card').trigger('click')
      expect(wrapper.emitted('onClick')).toBeTruthy()
    })

    it('点击头部应该触发 onHeaderClick', async () => {
      const wrapper = mount(SeeCard, {
        props: { title: '标题' }
      })
      await wrapper.find('.see-card__header').trigger('click')
      expect(wrapper.emitted('onHeaderClick')).toBeTruthy()
    })
  })
})
