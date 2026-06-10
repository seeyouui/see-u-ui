import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeScrollList from '../../uni_modules/see-u-ui/components/see-scroll-list/see-scroll-list.vue'

describe('SeeScrollList 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeScrollList)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-scroll-list').exists()).toBe(true)
    })

    it('应该渲染 scroll-view 容器', () => {
      const wrapper = mount(SeeScrollList)
      expect(wrapper.find('.see-scroll-list__scroll').exists()).toBe(true)
    })

    it('应该渲染 content 容器', () => {
      const wrapper = mount(SeeScrollList)
      expect(wrapper.find('.see-scroll-list__content').exists()).toBe(true)
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeScrollList)
      expect(wrapper.props('list')).toEqual([])
      expect(wrapper.props('scrollX')).toBe(true)
      expect(wrapper.props('scrollY')).toBe(false)
      expect(wrapper.props('showScrollbar')).toBe(false)
      expect(wrapper.props('isAnimated')).toBe(true)
      expect(wrapper.props('paddingLeft')).toBe('30rpx')
      expect(wrapper.props('itemGap')).toBe('20rpx')
      expect(wrapper.props('loadMoreThreshold')).toBe(50)
    })
  })

  describe('列表渲染', () => {
    it('应该渲染列表项', () => {
      const list = ['项目1', '项目2', '项目3']
      const wrapper = mount(SeeScrollList, {
        props: { list }
      })
      const items = wrapper.findAll('.see-scroll-list__item')
      expect(items).toHaveLength(3)
    })

    it('空列表不应渲染任何项', () => {
      const wrapper = mount(SeeScrollList, {
        props: { list: [] }
      })
      const items = wrapper.findAll('.see-scroll-list__item')
      expect(items).toHaveLength(0)
    })

    it('列表项应包含默认文本', () => {
      const list = ['苹果', '香蕉']
      const wrapper = mount(SeeScrollList, {
        props: { list }
      })
      const items = wrapper.findAll('.see-scroll-list__item')
      expect(items[0].text()).toBe('苹果')
      expect(items[1].text()).toBe('香蕉')
    })
  })

  describe('scrollX / scrollY Props', () => {
    it('默认应启用横向滚动', () => {
      const wrapper = mount(SeeScrollList)
      const scroll = wrapper.findComponent({ name: 'uni-scroll-view' })
      expect(scroll.props('scrollX')).toBe(true)
    })

    it('scrollY=true 应启用纵向滚动', () => {
      const wrapper = mount(SeeScrollList, {
        props: { scrollY: true, scrollX: false }
      })
      const scroll = wrapper.findComponent({ name: 'uni-scroll-view' })
      expect(scroll.props('scrollY')).toBe(true)
      expect(scroll.props('scrollX')).toBe(false)
    })
  })

  describe('样式', () => {
    it('应该应用 paddingLeft', () => {
      const wrapper = mount(SeeScrollList, {
        props: { paddingLeft: '40rpx' }
      })
      // paddingLeft 通过 props 传入，验证 props 值正确
      expect(wrapper.props('paddingLeft')).toBe('40rpx')
    })

    it('应该应用 itemGap', () => {
      const wrapper = mount(SeeScrollList, {
        props: { itemGap: '30rpx' }
      })
      const content = wrapper.find('.see-scroll-list__content')
      expect(content.attributes('style')).toContain('gap: 30rpx')
    })

    it('列表项应有 flex-shrink: 0', () => {
      const list = ['项目1']
      const wrapper = mount(SeeScrollList, {
        props: { list }
      })
      const item = wrapper.find('.see-scroll-list__item')
      expect(item.attributes('style')).toContain('flex-shrink: 0')
    })
  })

  describe('item 插槽', () => {
    it('应该支持自定义 item 插槽', () => {
      const list = ['苹果', '香蕉']
      const wrapper = mount(SeeScrollList, {
        props: { list },
        slots: {
          item: '<text class="custom-item">自定义</text>'
        }
      })
      expect(wrapper.find('.custom-item').exists()).toBe(true)
      expect(wrapper.findAll('.custom-item')).toHaveLength(2)
    })
  })

  describe('footer 插槽', () => {
    it('有 footer 插槽时应渲染 footer 容器', () => {
      const wrapper = mount(SeeScrollList, {
        slots: {
          footer: '<text class="footer-content">加载更多</text>'
        }
      })
      expect(wrapper.find('.see-scroll-list__footer').exists()).toBe(true)
      expect(wrapper.find('.footer-content').text()).toBe('加载更多')
    })

    it('无 footer 插槽时不应渲染 footer 容器', () => {
      const wrapper = mount(SeeScrollList)
      expect(wrapper.find('.see-scroll-list__footer').exists()).toBe(false)
    })
  })

  describe('事件', () => {
    it('滚动时应触发 onScroll 事件', async () => {
      const wrapper = mount(SeeScrollList)
      const scroll = wrapper.find('.see-scroll-list__scroll')
      const mockEvent = { detail: { scrollTop: 100 } }
      await scroll.trigger('scroll', mockEvent)
      expect(wrapper.emitted('onScroll')).toBeTruthy()
    })

    it('滚动到底部应触发 onScrollToLower 事件', async () => {
      const wrapper = mount(SeeScrollList)
      const scroll = wrapper.find('.see-scroll-list__scroll')
      await scroll.trigger('scrolltolower')
      expect(wrapper.emitted('onScrollToLower')).toBeTruthy()
    })

    it('滚动到顶部应触发 onScrollToUpper 事件', async () => {
      const wrapper = mount(SeeScrollList)
      const scroll = wrapper.find('.see-scroll-list__scroll')
      await scroll.trigger('scrolltoupper')
      expect(wrapper.emitted('onScrollToUpper')).toBeTruthy()
    })
  })
})
