import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeWaterfall from '../../uni_modules/see-u-ui/components/see-waterfall/see-waterfall.vue'

describe('SeeWaterfall 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockList = [
    { id: 1, title: 'Item 1', image: '/img/1.jpg' },
    { id: 2, title: 'Item 2', image: '/img/2.jpg' },
    { id: 3, title: 'Item 3', image: '/img/3.jpg' },
    { id: 4, title: 'Item 4', image: '/img/4.jpg' }
  ]

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-waterfall').exists()).toBe(true)
    })

    it('空列表时应该渲染空容器', () => {
      const wrapper = mount(SeeWaterfall)
      expect(wrapper.find('.see-waterfall__columns').exists()).toBe(true)
      expect(wrapper.findAll('.see-waterfall__item')).toHaveLength(0)
    })
  })

  describe('默认 2 列', () => {
    it('默认应该渲染 2 列', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList }
      })
      const columns = wrapper.findAll('.see-waterfall__column')
      expect(columns).toHaveLength(2)
    })

    it('默认列间距应该是 16rpx', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList }
      })
      const style = wrapper.find('.see-waterfall__columns').attributes('style')
      expect(style).toContain('gap: 16rpx')
    })
  })

  describe('columns=3 渲染 3 列', () => {
    it('columns=3 时应该渲染 3 列', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList, columns: 3 }
      })
      const columns = wrapper.findAll('.see-waterfall__column')
      expect(columns).toHaveLength(3)
    })
  })

  describe('列表数据分配', () => {
    it('2 列时应按索引轮询分配数据', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList, columns: 2 }
      })
      const columns = wrapper.findAll('.see-waterfall__column')
      // 列 0: item 0, 2 -> 2 个
      // 列 1: item 1, 3 -> 2 个
      expect(columns[0].findAll('.see-waterfall__item')).toHaveLength(2)
      expect(columns[1].findAll('.see-waterfall__item')).toHaveLength(2)
    })

    it('3 列时应按索引轮询分配数据', () => {
      const list = [
        { id: 1, title: 'A' },
        { id: 2, title: 'B' },
        { id: 3, title: 'C' },
        { id: 4, title: 'D' },
        { id: 5, title: 'E' }
      ]
      const wrapper = mount(SeeWaterfall, {
        props: { list, columns: 3 }
      })
      const columns = wrapper.findAll('.see-waterfall__column')
      // 列 0: item 0, 3 -> 2 个
      // 列 1: item 1, 4 -> 2 个
      // 列 2: item 2 -> 1 个
      expect(columns[0].findAll('.see-waterfall__item')).toHaveLength(2)
      expect(columns[1].findAll('.see-waterfall__item')).toHaveLength(2)
      expect(columns[2].findAll('.see-waterfall__item')).toHaveLength(1)
    })

    it('应正确渲染项的标题', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList, columns: 2 }
      })
      const titles = wrapper.findAll('.see-waterfall__title')
      expect(titles[0].text()).toBe('Item 1')
    })

    it('应正确渲染项的图片', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList, columns: 2 }
      })
      const images = wrapper.findAll('.see-waterfall__image')
      expect(images[0].attributes('src')).toBe('/img/1.jpg')
    })
  })

  describe('自定义 item 插槽', () => {
    it('应该渲染自定义 item 插槽', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList },
        slots: {
          item: '<text class="custom-slot">自定义内容</text>'
        }
      })
      expect(wrapper.find('.custom-slot').exists()).toBe(true)
      expect(wrapper.find('.custom-slot').text()).toBe('自定义内容')
    })
  })

  describe('加载更多', () => {
    it('hasMore=false 时不显示 footer', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList, hasMore: false }
      })
      expect(wrapper.find('.see-waterfall__footer').exists()).toBe(false)
    })

    it('hasMore=true 时显示 footer', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList, hasMore: true }
      })
      expect(wrapper.find('.see-waterfall__footer').exists()).toBe(true)
    })

    it('应该支持自定义 footer 插槽', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList, hasMore: true },
        slots: {
          footer: '<text class="custom-footer">加载中...</text>'
        }
      })
      expect(wrapper.find('.custom-footer').exists()).toBe(true)
      expect(wrapper.find('.custom-footer').text()).toBe('加载中...')
    })
  })

  describe('onClick 事件', () => {
    it('点击项应该触发 onClick 事件', async () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList }
      })
      const firstItem = wrapper.find('.see-waterfall__item')
      await firstItem.trigger('click')
      expect(wrapper.emitted('onClick')).toBeTruthy()
      expect(wrapper.emitted('onClick')![0][0]).toEqual(mockList[0])
    })

    it('onClick 回调应包含正确的 item 和 index', async () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList, columns: 2 }
      })
      // 第二列的第一个 item (index=1 in column)
      const columns = wrapper.findAll('.see-waterfall__column')
      const secondColFirstItem = columns[1].find('.see-waterfall__item')
      await secondColFirstItem.trigger('click')
      expect(wrapper.emitted('onClick')).toBeTruthy()
      expect(wrapper.emitted('onClick')![0][0]).toEqual(mockList[1])
    })
  })

  describe('Props', () => {
    it('应该支持自定义 gap', () => {
      const wrapper = mount(SeeWaterfall, {
        props: { list: mockList, gap: '20rpx' }
      })
      const style = wrapper.find('.see-waterfall__columns').attributes('style')
      expect(style).toContain('gap: 20rpx')
    })
  })
})
