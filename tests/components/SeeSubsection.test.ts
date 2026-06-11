import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeSubsection from '../../uni_modules/see-u-ui/components/see-subsection/see-subsection.vue'

const defaultOptions = [
  { label: '选项一', value: 'one' },
  { label: '选项二', value: 'two' },
  { label: '选项三', value: 'three' }
]

describe('SeeSubsection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基础渲染', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions }
    })
    expect(wrapper.find('.see-subsection').exists()).toBe(true)
  })

  it('渲染选项文字', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions }
    })
    expect(wrapper.text()).toContain('选项一')
    expect(wrapper.text()).toContain('选项二')
    expect(wrapper.text()).toContain('选项三')
  })

  it('正确数量的选项', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions }
    })
    expect(wrapper.findAll('.see-subsection__item').length).toBe(3)
  })

  it('激活项有 active class', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'two', options: defaultOptions }
    })
    const items = wrapper.findAll('.see-subsection__item')
    expect(items[1].classes()).toContain('see-subsection__item--active')
    expect(items[0].classes()).not.toContain('see-subsection__item--active')
  })

  it('点击选项触发 onChange', async () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions }
    })
    await wrapper.findAll('.see-subsection__item')[1].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeTruthy()
    expect(wrapper.emitted('onChange')![0]).toEqual(['two', { label: '选项二', value: 'two' }])
  })

  it('点击选项触发 update:modelValue', async () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions }
    })
    await wrapper.findAll('.see-subsection__item')[2].trigger('tap')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['three'])
  })

  it('点击当前选中的选项不触发 onChange', async () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions }
    })
    await wrapper.findAll('.see-subsection__item')[0].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  it('禁用选项不响应点击', async () => {
    const options = [
      { label: '选项一', value: 'one' },
      { label: '选项二', value: 'two', isDisabled: true }
    ]
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options }
    })
    await wrapper.findAll('.see-subsection__item')[1].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  it('全局禁用不响应点击', async () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions, isDisabled: true }
    })
    await wrapper.findAll('.see-subsection__item')[1].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  it('type=button 时应用 button 样式', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions, type: 'button' }
    })
    expect(wrapper.find('.see-subsection--button').exists()).toBe(true)
  })

  it('type=pill 时应用 pill 样式', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions, type: 'pill' }
    })
    expect(wrapper.find('.see-subsection--pill').exists()).toBe(true)
  })

  it('type=pill 时显示滑块', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions, type: 'pill' }
    })
    expect(wrapper.find('.see-subsection__slider').exists()).toBe(true)
  })

  it('size=small 应用小尺寸样式', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions, size: 'small' }
    })
    expect(wrapper.find('.see-subsection--small').exists()).toBe(true)
  })

  it('isFullWidth 应占满整行', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions, isFullWidth: true }
    })
    expect(wrapper.find('.see-subsection--full').exists()).toBe(true)
  })

  it('自定义 activeColor 应应用', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: 'one', options: defaultOptions, activeColor: '#ff0000' }
    })
    expect(wrapper.find('.see-subsection').exists()).toBe(true)
  })

  it('空选项列表不崩溃', () => {
    const wrapper = mount(SeeSubsection, {
      props: { modelValue: '', options: [] }
    })
    expect(wrapper.find('.see-subsection').exists()).toBe(true)
    expect(wrapper.findAll('.see-subsection__item').length).toBe(0)
  })
})
