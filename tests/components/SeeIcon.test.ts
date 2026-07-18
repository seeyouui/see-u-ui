import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeIcon from '../../uni_modules/see-u-ui/components/see-icon/see-icon.vue'

describe('SeeIcon 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeIcon)
      expect(wrapper.exists()).toBe(true)
    })

    it('应该渲染默认的图标结构', () => {
      const wrapper = mount(SeeIcon)
      const icon = wrapper.find('.see-icon')
      expect(icon.exists()).toBe(true)
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeIcon)

      expect(wrapper.props('name')).toBe('')
      expect(wrapper.props('size')).toBeUndefined()
      expect(wrapper.props('color')).toBe('')
      expect(wrapper.props('customPrefix')).toBe('')
      expect(wrapper.props('customFont')).toBe('')
    })
  })

  describe('Name 属性', () => {
    it('应该根据 name 显示对应的图标字符', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark'
        }
      })
      const icon = wrapper.find('.see-icon')
      expect(icon.exists()).toBe(true)
    })

    it('应该支持 Unicode 字符作为图标', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: '✓'
        }
      })
      const icon = wrapper.find('.see-icon')
      expect(icon.text()).toContain('✓')
    })

    it('应该支持图片路径作为图标', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: '/static/logo.png'
        }
      })
      const img = wrapper.find('.see-icon__image')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('/static/logo.png')
    })
  })

  describe('Size 属性', () => {
    it('应该应用默认大小', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark'
        }
      })
      const icon = wrapper.find('.see-icon')
      // 没有设置 size 时，样式应该为空或不包含 font-size
      expect(icon.exists()).toBe(true)
    })

    it('应该应用自定义大小（数字）', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark',
          size: 24
        }
      })
      const icon = wrapper.find('.see-icon')
      const styles = icon.attributes('style') || ''
      expect(styles).toContain('font-size: 24px')
    })

    it('应该应用自定义大小（字符串）', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark',
          size: '24px'
        }
      })
      const icon = wrapper.find('.see-icon')
      const styles = icon.attributes('style') || ''
      expect(styles).toContain('font-size: 24px')
    })
  })

  describe('Color 属性', () => {
    it('应该应用自定义颜色', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark',
          color: '#ff0000'
        }
      })
      const icon = wrapper.find('.see-icon')
      const styles = icon.attributes('style') || ''
      // 浏览器可能会将十六进制颜色转换为 RGB 格式
      expect(styles).toMatch(/color:\s*(#ff0000|rgb\(255,\s*0,\s*0\))/)
    })

    it('没有 color 时不应该设置颜色样式', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark'
        }
      })
      const icon = wrapper.find('.see-icon')
      const styles = icon.attributes('style') || ''
      expect(styles).not.toContain('color:')
    })
  })

  describe('图片图标', () => {
    it('应该渲染图片元素', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: '/static/icon.png'
        }
      })
      const img = wrapper.find('.see-icon__image')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('/static/icon.png')
    })

    it('图片图标应该应用自定义大小', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: '/static/icon.png',
          size: 32
        }
      })
      const img = wrapper.find('.see-icon__image')
      expect(img.exists()).toBe(true)
      const styles = wrapper.find('.see-icon').attributes('style')
      expect(styles).toContain('width: 32px')
      expect(styles).toContain('height: 32px')
    })

    it('图片图标应该支持 alt 属性', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: '/static/icon.png',
          alt: '图标'
        }
      })
      const img = wrapper.find('.see-icon__image')
      expect(img.attributes('alt')).toBe('图标')
    })
  })

  describe('自定义图标', () => {
    it('应该支持自定义图标前缀', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'home',
          customPrefix: 'custom-icon'
        }
      })
      const icon = wrapper.find('.see-icon')
      expect(icon.classes()).toContain('custom-icon')
      expect(icon.classes()).toContain('custom-icon-home')
    })

    it('应该支持自定义图标字体', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'home',
          customFont: 'MyIconFont'
        }
      })
      const icon = wrapper.find('.see-icon')
      const styles = icon.attributes('style') || ''
      // 浏览器可能会将单引号转换为双引号
      expect(styles).toMatch(/font-family:\s*['"]MyIconFont['"]/)
    })
  })

  describe('点击事件', () => {
    it('应该能够响应点击事件', async () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark'
        }
      })
      const icon = wrapper.find('.see-icon')
      await icon.trigger('click')
      expect(wrapper.emitted('onClick')).toBeTruthy()
    })

    it('应该在点击时传递事件对象', async () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark'
        }
      })
      const icon = wrapper.find('.see-icon')
      await icon.trigger('click')
      expect(wrapper.emitted('onClick')![0]).toBeDefined()
    })
  })

  describe('Slots', () => {
    it('应该支持默认插槽', () => {
      const wrapper = mount(SeeIcon, {
        slots: {
          default: '<text class="custom-icon">自定义图标</text>'
        }
      })
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })
  })

  describe('Methods', () => {
    it('应该暴露 getName 方法', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark'
        }
      })
      expect(wrapper.vm.getName()).toBe('checkmark')
    })

    it('应该暴露 isImage 方法', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: '/static/icon.png'
        }
      })
      expect(wrapper.vm.isImage()).toBe(true)
    })

    it('非图片路径时 isImage 应该返回 false', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'checkmark'
        }
      })
      expect(wrapper.vm.isImage()).toBe(false)
    })
  })

  describe('综合场景', () => {
    it('应该正确处理所有属性组合', () => {
      const wrapper = mount(SeeIcon, {
        props: {
          name: 'home',
          size: 32,
          color: '#7232dd',
          customPrefix: 'my-icon',
          customFont: 'MyFont'
        }
      })

      const icon = wrapper.find('.see-icon')
      expect(icon.classes()).toContain('my-icon')
      expect(icon.classes()).toContain('my-icon-home')

      const styles = icon.attributes('style') || ''
      expect(styles).toContain('font-size: 32px')
      // 浏览器可能会将十六进制颜色转换为 RGB 格式
      expect(styles).toMatch(/color:\s*(#7232dd|rgb\(114,\s*50,\s*221\))/)
      // 浏览器可能会将单引号转换为双引号
      expect(styles).toMatch(/font-family:\s*['"]MyFont['"]/)
    })
  })
})
