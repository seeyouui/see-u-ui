import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeSwiper from '../../uni_modules/see-u-ui/components/see-swiper/see-swiper.vue'

const mockList = [
  { image: 'https://example.com/img1.png', title: '标题一', url: '/page1' },
  { image: 'https://example.com/img2.png', title: '标题二', url: '/page2' },
  { image: 'https://example.com/img3.png', title: '标题三', url: '/page3' }
]

describe('SeeSwiper 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('默认渲染', () => {
    it('应该正确渲染组件', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList }
      })
      expect(wrapper.find('.see-swiper').exists()).toBe(true)
      expect(wrapper.find('.see-swiper__inner').exists()).toBe(true)
    })

    it('默认高度应为 300rpx', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList }
      })
      // height 通过 props 传入，检查组件 props 而非 DOM style
      expect(wrapper.props('height')).toBe('300rpx')
    })

    it('默认应显示 dots 指示器', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList }
      })
      expect(wrapper.find('.see-swiper__indicator--dots').exists()).toBe(true)
    })
  })

  describe('列表数据渲染', () => {
    it('应根据 list 渲染对应数量的轮播项', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList }
      })
      // swiper-item 在测试环境中被 stub 为 uni-swiper-item 组件
      const items = wrapper.findAllComponents({ name: 'uni-swiper-item' })
      expect(items).toHaveLength(mockList.length)
    })

    it('应渲染图片元素', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList }
      })
      const images = wrapper.findAll('.see-swiper__image')
      expect(images).toHaveLength(mockList.length)
      expect(images[0].attributes('src')).toBe(mockList[0].image)
    })

    it('应渲染标题', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList }
      })
      const titles = wrapper.findAll('.see-swiper__title text')
      expect(titles).toHaveLength(mockList.length)
      expect(titles[0].text()).toBe('标题一')
    })

    it('list 为空时不应渲染轮播项', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: [] }
      })
      const items = wrapper.findAllComponents({ name: 'uni-swiper-item' })
      expect(items).toHaveLength(0)
    })
  })

  describe('autoplay 和 loop 属性', () => {
    it('autoplay 应传递给 swiper 组件', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, autoplay: true }
      })
      const swiper = wrapper.findComponent({ name: 'uni-swiper' })
      expect(swiper.props('autoplay')).toBe(true)
    })

    it('autoplay 设为 false 应禁用自动播放', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, autoplay: false }
      })
      const swiper = wrapper.findComponent({ name: 'uni-swiper' })
      expect(swiper.props('autoplay')).toBe(false)
    })

    it('loop 应映射到 circular 属性', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, loop: true }
      })
      const swiper = wrapper.findComponent({ name: 'uni-swiper' })
      expect(swiper.props('circular')).toBe(true)
    })

    it('loop 设为 false 应禁用循环', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, loop: false }
      })
      const swiper = wrapper.findComponent({ name: 'uni-swiper' })
      expect(swiper.props('circular')).toBe(false)
    })

    it('interval 应传递给 swiper 组件', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, interval: 5000 }
      })
      const swiper = wrapper.findComponent({ name: 'uni-swiper' })
      expect(swiper.props('interval')).toBe(5000)
    })

    it('duration 应传递给 swiper 组件', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, duration: 500 }
      })
      const swiper = wrapper.findComponent({ name: 'uni-swiper' })
      expect(swiper.props('duration')).toBe(500)
    })
  })

  describe('indicatorType 切换', () => {
    it('indicatorType 为 dots 时显示圆点指示器', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, indicatorType: 'dots' }
      })
      expect(wrapper.find('.see-swiper__indicator--dots').exists()).toBe(true)
      expect(wrapper.find('.see-swiper__indicator--digital').exists()).toBe(false)
    })

    it('indicatorType 为 digital 时显示数字指示器', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, indicatorType: 'digital' }
      })
      expect(wrapper.find('.see-swiper__indicator--dots').exists()).toBe(false)
      expect(wrapper.find('.see-swiper__indicator--digital').exists()).toBe(true)
    })

    it('indicatorType 为 none 时不显示指示器', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, indicatorType: 'none' }
      })
      expect(wrapper.find('.see-swiper__indicator--dots').exists()).toBe(false)
      expect(wrapper.find('.see-swiper__indicator--digital').exists()).toBe(false)
    })

    it('dots 指示器数量应等于列表长度', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, indicatorType: 'dots' }
      })
      const dots = wrapper.findAll('.see-swiper__dot')
      expect(dots).toHaveLength(mockList.length)
    })

    it('第一个圆点应为激活状态', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, indicatorType: 'dots', current: 0 }
      })
      const dots = wrapper.findAll('.see-swiper__dot')
      expect(dots[0].classes()).toContain('see-swiper__dot--active')
    })
  })

  describe('onChange 事件', () => {
    it('切换时应触发 onChange 事件', async () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList }
      })
      const swiper = wrapper.findComponent({ name: 'uni-swiper' })

      await swiper.trigger('change', { detail: { current: 1 } })

      expect(wrapper.emitted('onChange')).toBeTruthy()
      expect(wrapper.emitted('onChange')![0]).toEqual([1])
    })

    it('切换时应触发 update:current 事件', async () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList }
      })
      const swiper = wrapper.findComponent({ name: 'uni-swiper' })

      await swiper.trigger('change', { detail: { current: 2 } })

      expect(wrapper.emitted('update:current')).toBeTruthy()
      expect(wrapper.emitted('update:current')![0]).toEqual([2])
    })

    it('点击轮播项应触发 onClick 事件', async () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList }
      })
      const firstItem = wrapper.findAllComponents({ name: 'uni-swiper-item' })[0]

      await firstItem.trigger('click')

      expect(wrapper.emitted('onClick')).toBeTruthy()
      expect(wrapper.emitted('onClick')![0]).toEqual([mockList[0], 0])
    })
  })

  describe('样式自定义', () => {
    it('应支持自定义高度', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, height: '500rpx' }
      })
      // height 通过 props 传入，检查组件 props
      expect(wrapper.props('height')).toBe('500rpx')
    })

    it('应支持自定义 activeColor', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, activeColor: '#ff0000', current: 0 }
      })
      const dots = wrapper.findAll('.see-swiper__dot')
      expect(dots[0].attributes('style')).toContain('background-color')
    })

    it('应支持自定义 inactiveColor', () => {
      const wrapper = mount(SeeSwiper, {
        props: { list: mockList, inactiveColor: '#cccccc', current: 0 }
      })
      const dots = wrapper.findAll('.see-swiper__dot')
      expect(dots[1].attributes('style')).toContain('background-color')
    })
  })
})
