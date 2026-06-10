import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeSkeleton from '../../uni_modules/see-u-ui/components/see-skeleton/see-skeleton.vue'

describe('SeeSkeleton 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeSkeleton)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-skeleton').exists()).toBe(true)
    })

    it('默认应该显示骨架占位', () => {
      const wrapper = mount(SeeSkeleton)
      expect(wrapper.find('.see-skeleton__placeholder').exists()).toBe(true)
      expect(wrapper.find('.see-skeleton__content').exists()).toBe(false)
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeSkeleton)
      expect(wrapper.props('loading')).toBe(true)
      expect(wrapper.props('rows')).toBe(3)
      expect(wrapper.props('rowHeight')).toBe('32rpx')
      expect(wrapper.props('rowGap')).toBe('20rpx')
      expect(wrapper.props('avatar')).toBe(false)
      expect(wrapper.props('avatarSize')).toBe('80rpx')
      expect(wrapper.props('avatarShape')).toBe('circle')
      expect(wrapper.props('title')).toBe(false)
      expect(wrapper.props('isAnimate')).toBe(true)
      expect(wrapper.props('skeletonBgColor')).toBe('var(--see-info)')
      expect(wrapper.props('highlightColor')).toBe('var(--see-bg-color)')
    })
  })

  describe('loading 切换', () => {
    it('loading=true 时应该显示骨架占位', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { loading: true }
      })
      expect(wrapper.find('.see-skeleton__placeholder').exists()).toBe(true)
      expect(wrapper.find('.see-skeleton__content').exists()).toBe(false)
    })

    it('loading=false 时应该显示实际内容', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { loading: false },
        slots: { default: '<text>实际内容</text>' }
      })
      expect(wrapper.find('.see-skeleton__placeholder').exists()).toBe(false)
      expect(wrapper.find('.see-skeleton__content').exists()).toBe(true)
      expect(wrapper.text()).toContain('实际内容')
    })

    it('loading 从 true 切换为 false 应该显示内容', async () => {
      const wrapper = mount(SeeSkeleton, {
        props: { loading: true },
        slots: { default: '<text>内容</text>' }
      })
      expect(wrapper.find('.see-skeleton__placeholder').exists()).toBe(true)

      await wrapper.setProps({ loading: false })
      expect(wrapper.find('.see-skeleton__content').exists()).toBe(true)
      expect(wrapper.text()).toContain('内容')
    })
  })

  describe('rows 行数', () => {
    it('默认应该渲染 3 行', () => {
      const wrapper = mount(SeeSkeleton)
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows).toHaveLength(3)
    })

    it('rows=5 应该渲染 5 行', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { rows: 5 }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows).toHaveLength(5)
    })

    it('rows=1 应该渲染 1 行', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { rows: 1 }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows).toHaveLength(1)
    })

    it('rows=0 应该不渲染任何行', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { rows: 0 }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows).toHaveLength(0)
    })
  })

  describe('头像 avatar', () => {
    it('avatar=false 时不应该显示头像', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { avatar: false }
      })
      expect(wrapper.find('.see-skeleton__avatar').exists()).toBe(false)
    })

    it('avatar=true 时应该显示头像', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { avatar: true }
      })
      expect(wrapper.find('.see-skeleton__avatar').exists()).toBe(true)
    })

    it('头像默认应该是圆形', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { avatar: true }
      })
      expect(wrapper.find('.see-skeleton__avatar--circle').exists()).toBe(true)
    })

    it('avatarShape=square 时应该显示方形头像', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { avatar: true, avatarShape: 'square' }
      })
      expect(wrapper.find('.see-skeleton__avatar--square').exists()).toBe(true)
    })

    it('头像应该有正确的尺寸样式', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { avatar: true, avatarSize: '100rpx' }
      })
      const style = wrapper.find('.see-skeleton__avatar').attributes('style')
      expect(style).toContain('width: 100rpx')
      expect(style).toContain('height: 100rpx')
    })
  })

  describe('标题 title', () => {
    it('title=false 时第一行不应该有标题样式', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { title: false }
      })
      expect(wrapper.find('.see-skeleton__row--title').exists()).toBe(false)
    })

    it('title=true 时第一行应该有标题样式', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { title: true }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows[0].classes()).toContain('see-skeleton__row--title')
    })

    it('title=true 时只有第一行有标题样式', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { title: true, rows: 3 }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows[0].classes()).toContain('see-skeleton__row--title')
      expect(rows[1].classes()).not.toContain('see-skeleton__row--title')
      expect(rows[2].classes()).not.toContain('see-skeleton__row--title')
    })
  })

  describe('动画 isAnimate', () => {
    it('isAnimate=true 时应该添加动画类', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { isAnimate: true }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      rows.forEach((row) => {
        expect(row.classes()).toContain('see-skeleton--animate')
      })
    })

    it('isAnimate=false 时不应该添加动画类', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { isAnimate: false }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      rows.forEach((row) => {
        expect(row.classes()).not.toContain('see-skeleton--animate')
      })
    })

    it('头像也应该受 isAnimate 控制', () => {
      const wrapperAnimate = mount(SeeSkeleton, {
        props: { avatar: true, isAnimate: true }
      })
      expect(wrapperAnimate.find('.see-skeleton__avatar').classes()).toContain('see-skeleton--animate')

      const wrapperNoAnimate = mount(SeeSkeleton, {
        props: { avatar: true, isAnimate: false }
      })
      expect(wrapperNoAnimate.find('.see-skeleton__avatar').classes()).not.toContain('see-skeleton--animate')
    })
  })

  describe('自定义 rowWidth', () => {
    it('统一宽度应该应用到所有行', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { rowWidth: '80%' }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      rows.forEach((row) => {
        expect(row.attributes('style')).toContain('width: 80%')
      })
    })

    it('数组宽度应该按顺序应用到各行', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { rowWidth: ['100%', '80%', '60%'], rows: 3 }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows[0].attributes('style')).toContain('width: 100%')
      expect(rows[1].attributes('style')).toContain('width: 80%')
      expect(rows[2].attributes('style')).toContain('width: 60%')
    })

    it('数组宽度超过行数时应该循环使用', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { rowWidth: ['100%', '80%'], rows: 4 }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows[0].attributes('style')).toContain('width: 100%')
      expect(rows[1].attributes('style')).toContain('width: 80%')
      expect(rows[2].attributes('style')).toContain('width: 100%')
      expect(rows[3].attributes('style')).toContain('width: 80%')
    })

    it('未设置 rowWidth 时最后一行应该是 60%', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { rows: 3 }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows[0].attributes('style')).toContain('width: 100%')
      expect(rows[1].attributes('style')).toContain('width: 100%')
      expect(rows[2].attributes('style')).toContain('width: 60%')
    })
  })

  describe('自定义样式', () => {
    it('应该应用自定义行高', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { rowHeight: '48rpx' }
      })
      const row = wrapper.find('.see-skeleton__row')
      expect(row.attributes('style')).toContain('height: 48rpx')
    })

    it('应该应用自定义行间距', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { rowGap: '30rpx', rows: 3 }
      })
      const rows = wrapper.findAll('.see-skeleton__row')
      // 前面的行有 marginBottom
      expect(rows[0].attributes('style')).toContain('margin-bottom: 30rpx')
      expect(rows[1].attributes('style')).toContain('margin-bottom: 30rpx')
      // 最后一行没有 marginBottom
      expect(rows[2].attributes('style')).toContain('margin-bottom: 0')
    })
  })

  describe('头像 + 标题组合', () => {
    it('同时开启 avatar 和 title 应该正常渲染', () => {
      const wrapper = mount(SeeSkeleton, {
        props: { avatar: true, title: true, rows: 3 }
      })
      expect(wrapper.find('.see-skeleton__avatar').exists()).toBe(true)
      expect(wrapper.find('.see-skeleton__row--title').exists()).toBe(true)
      const rows = wrapper.findAll('.see-skeleton__row')
      expect(rows).toHaveLength(3)
    })
  })
})
