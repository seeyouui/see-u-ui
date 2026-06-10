import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeCell from '../../uni_modules/see-u-ui/components/see-cell/see-cell.vue'

describe('SeeCell', () => {
  const originalUni = (globalThis as any).uni

  afterEach(() => {
    // 恢复原始 uni 对象，避免污染其他测试
    ;(globalThis as any).uni = originalUni
  })
  // ==================== Basic Rendering ====================

  describe('basic rendering', () => {
    it('renders without crashing', () => {
      const wrapper = mount(SeeCell)
      expect(wrapper.find('.see-cell').exists()).toBe(true)
    })

    it('applies default props correctly', () => {
      const wrapper = mount(SeeCell)
      expect(wrapper.find('.see-cell--border').exists()).toBe(true)
      expect(wrapper.find('.see-cell--link').exists()).toBe(false)
      expect(wrapper.find('.see-cell--required').exists()).toBe(false)
      expect(wrapper.find('.see-cell--center').exists()).toBe(false)
    })
  })

  // ==================== Title & Value ====================

  describe('title and value rendering', () => {
    it('renders title text', () => {
      const wrapper = mount(SeeCell, {
        props: { title: 'My Title' }
      })
      expect(wrapper.find('.see-cell__title-text').text()).toBe('My Title')
    })

    it('renders value text', () => {
      const wrapper = mount(SeeCell, {
        props: { value: 'My Value' }
      })
      expect(wrapper.find('.see-cell__value-text').text()).toBe('My Value')
    })

    it('renders both title and value', () => {
      const wrapper = mount(SeeCell, {
        props: { title: 'Name', value: 'Alice' }
      })
      expect(wrapper.find('.see-cell__title-text').text()).toBe('Name')
      expect(wrapper.find('.see-cell__value-text').text()).toBe('Alice')
    })

    it('does not render value area when value is empty and no value slot', () => {
      const wrapper = mount(SeeCell, {
        props: { title: 'Title' }
      })
      expect(wrapper.find('.see-cell__value').exists()).toBe(false)
    })
  })

  // ==================== Label ====================

  describe('label rendering', () => {
    it('renders label text', () => {
      const wrapper = mount(SeeCell, {
        props: { title: 'Title', label: 'Description' }
      })
      expect(wrapper.find('.see-cell__label').text()).toBe('Description')
    })

    it('does not render label when not provided', () => {
      const wrapper = mount(SeeCell, {
        props: { title: 'Title' }
      })
      expect(wrapper.find('.see-cell__label').exists()).toBe(false)
    })
  })

  // ==================== isLink / Arrow ====================

  describe('isLink', () => {
    it('shows arrow when isLink is true', () => {
      const wrapper = mount(SeeCell, {
        props: { isLink: true }
      })
      expect(wrapper.find('.see-cell--link').exists()).toBe(true)
      expect(wrapper.find('.see-cell__arrow').exists()).toBe(true)
      expect(wrapper.find('.see-cell__arrow-icon').text()).toBe('›')
    })

    it('shows arrow when to is set', () => {
      const wrapper = mount(SeeCell, {
        props: { to: '/pages/index/index' }
      })
      expect(wrapper.find('.see-cell--link').exists()).toBe(true)
      expect(wrapper.find('.see-cell__arrow').exists()).toBe(true)
    })

    it('does not show arrow when isLink is false and to is not set', () => {
      const wrapper = mount(SeeCell, {
        props: { isLink: false }
      })
      expect(wrapper.find('.see-cell--link').exists()).toBe(false)
      expect(wrapper.find('.see-cell__arrow').exists()).toBe(false)
    })
  })

  // ==================== isRequired ====================

  describe('isRequired', () => {
    it('shows asterisk when isRequired is true', () => {
      const wrapper = mount(SeeCell, {
        props: { isRequired: true }
      })
      expect(wrapper.find('.see-cell--required').exists()).toBe(true)
      expect(wrapper.find('.see-cell__required').exists()).toBe(true)
      expect(wrapper.find('.see-cell__required').text()).toBe('*')
    })

    it('does not show asterisk when isRequired is false', () => {
      const wrapper = mount(SeeCell, {
        props: { isRequired: false }
      })
      expect(wrapper.find('.see-cell--required').exists()).toBe(false)
      expect(wrapper.find('.see-cell__required').exists()).toBe(false)
    })
  })

  // ==================== border ====================

  describe('border', () => {
    it('has border by default', () => {
      const wrapper = mount(SeeCell)
      expect(wrapper.find('.see-cell--border').exists()).toBe(true)
    })

    it('removes border when border is false', () => {
      const wrapper = mount(SeeCell, {
        props: { border: false }
      })
      expect(wrapper.find('.see-cell--border').exists()).toBe(false)
    })
  })

  // ==================== icon ====================

  describe('icon rendering', () => {
    it('renders icon from prop', () => {
      const wrapper = mount(SeeCell, {
        props: { icon: '⚙️' }
      })
      expect(wrapper.find('.see-cell__icon').exists()).toBe(true)
      expect(wrapper.find('.see-cell__icon-text').text()).toBe('⚙️')
    })

    it('does not render icon when not provided', () => {
      const wrapper = mount(SeeCell)
      expect(wrapper.find('.see-cell__icon').exists()).toBe(false)
    })

    it('applies custom iconSize', () => {
      const wrapper = mount(SeeCell, {
        props: { icon: '⚙️', iconSize: '60rpx' }
      })
      const iconText = wrapper.find('.see-cell__icon-text')
      expect(iconText.attributes('style')).toContain('font-size: 60rpx')
    })
  })

  // ==================== Slots ====================

  describe('slots', () => {
    it('renders title slot', () => {
      const wrapper = mount(SeeCell, {
        slots: {
          title: '<span class="custom-title">Custom Title</span>'
        }
      })
      expect(wrapper.find('.custom-title').exists()).toBe(true)
      expect(wrapper.find('.custom-title').text()).toBe('Custom Title')
    })

    it('renders value slot', () => {
      const wrapper = mount(SeeCell, {
        slots: {
          value: '<span class="custom-value">Custom Value</span>'
        }
      })
      expect(wrapper.find('.custom-value').exists()).toBe(true)
      expect(wrapper.find('.custom-value').text()).toBe('Custom Value')
    })

    it('renders icon slot', () => {
      const wrapper = mount(SeeCell, {
        slots: {
          icon: '<span class="custom-icon">ICON</span>'
        }
      })
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
      expect(wrapper.find('.custom-icon').text()).toBe('ICON')
    })

    it('renders right slot', () => {
      const wrapper = mount(SeeCell, {
        slots: {
          right: '<span class="custom-right">RIGHT</span>'
        }
      })
      expect(wrapper.find('.custom-right').exists()).toBe(true)
      expect(wrapper.find('.custom-right').text()).toBe('RIGHT')
    })

    it('does not render right area when slot is absent', () => {
      const wrapper = mount(SeeCell)
      expect(wrapper.find('.see-cell__right').exists()).toBe(false)
    })
  })

  // ==================== Click Event ====================

  describe('click event', () => {
    it('emits onClick when clicked', async () => {
      const wrapper = mount(SeeCell, {
        props: { title: 'Click me' }
      })
      await wrapper.find('.see-cell').trigger('click')
      expect(wrapper.emitted('onClick')).toBeTruthy()
      expect(wrapper.emitted('onClick')!.length).toBe(1)
    })

    it('calls uni.navigateTo when to is set', async () => {
      const navigateTo = vi.fn()
      ;(globalThis as any).uni = { navigateTo }

      const wrapper = mount(SeeCell, {
        props: { to: '/pages/index/index' }
      })
      await wrapper.find('.see-cell').trigger('click')
      expect(navigateTo).toHaveBeenCalledWith({ url: '/pages/index/index' })
    })

    it('does not call uni.navigateTo when to is not set', async () => {
      const navigateTo = vi.fn()
      ;(globalThis as any).uni = { navigateTo }

      const wrapper = mount(SeeCell, {
        props: { title: 'No nav' }
      })
      await wrapper.find('.see-cell').trigger('click')
      expect(navigateTo).not.toHaveBeenCalled()
    })
  })

  // ==================== clickEffect ====================

  describe('clickEffect', () => {
    it('applies background hover class by default', () => {
      const wrapper = mount(SeeCell)
      expect(wrapper.find('.see-cell').attributes('hover-class')).toBe('see-cell--hover-bg')
    })

    it('applies opacity hover class', () => {
      const wrapper = mount(SeeCell, {
        props: { clickEffect: 'opacity' }
      })
      expect(wrapper.find('.see-cell').attributes('hover-class')).toBe('see-cell--hover-opacity')
    })

    it('applies empty hover class when clickEffect is none', () => {
      const wrapper = mount(SeeCell, {
        props: { clickEffect: 'none' }
      })
      expect(wrapper.find('.see-cell').attributes('hover-class')).toBe('')
    })
  })

  // ==================== isCenter ====================

  describe('isCenter', () => {
    it('applies center class when isCenter is true', () => {
      const wrapper = mount(SeeCell, {
        props: { isCenter: true }
      })
      expect(wrapper.find('.see-cell--center').exists()).toBe(true)
    })

    it('does not apply center class by default', () => {
      const wrapper = mount(SeeCell)
      expect(wrapper.find('.see-cell--center').exists()).toBe(false)
    })
  })

  // ==================== height ====================

  describe('height', () => {
    it('applies custom height', () => {
      const wrapper = mount(SeeCell, {
        props: { height: '120rpx' }
      })
      const style = wrapper.find('.see-cell').attributes('style')
      expect(style).toContain('min-height: 120rpx')
      expect(style).toContain('height: 120rpx')
    })
  })

  // ==================== titleWidth ====================

  describe('titleWidth', () => {
    it('applies custom title width', () => {
      const wrapper = mount(SeeCell, {
        props: { titleWidth: '200rpx' }
      })
      const titleEl = wrapper.find('.see-cell__title')
      const style = titleEl.attributes('style')
      expect(style).toContain('width: 200rpx')
      expect(style).toContain('min-width: 200rpx')
    })

    it('does not set title width when auto', () => {
      const wrapper = mount(SeeCell, {
        props: { titleWidth: 'auto' }
      })
      const titleEl = wrapper.find('.see-cell__title')
      const style = titleEl.attributes('style')
      expect(style).toBeUndefined()
    })
  })
})
