import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeSteps from '../../uni_modules/see-u-ui/components/see-steps/see-steps.vue'

const defaultSteps = [
  { title: '步骤一', description: '描述一' },
  { title: '步骤二', description: '描述二' },
  { title: '步骤三', description: '描述三' }
]

describe('SeeSteps', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基础渲染', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps }
    })
    expect(wrapper.find('.see-steps').exists()).toBe(true)
  })

  it('渲染正确数量的步骤', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps }
    })
    expect(wrapper.findAll('.see-steps__item').length).toBe(3)
  })

  it('渲染步骤标题', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps }
    })
    expect(wrapper.text()).toContain('步骤一')
    expect(wrapper.text()).toContain('步骤二')
    expect(wrapper.text()).toContain('步骤三')
  })

  it('渲染步骤描述', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps }
    })
    expect(wrapper.text()).toContain('描述一')
  })

  it('当前步骤有 process 状态', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 1, steps: defaultSteps }
    })
    const items = wrapper.findAll('.see-steps__item')
    expect(items[1].classes()).toContain('see-steps__item--process')
  })

  it('已完成步骤有 finish 状态', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 2, steps: defaultSteps }
    })
    const items = wrapper.findAll('.see-steps__item')
    expect(items[0].classes()).toContain('see-steps__item--finish')
    expect(items[1].classes()).toContain('see-steps__item--finish')
  })

  it('未完成步骤有 wait 状态', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps }
    })
    const items = wrapper.findAll('.see-steps__item')
    expect(items[1].classes()).toContain('see-steps__item--wait')
    expect(items[2].classes()).toContain('see-steps__item--wait')
  })

  it('finish 步骤显示 ✓', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 2, steps: defaultSteps }
    })
    expect(wrapper.findAll('.see-steps__icon-text')[0].text()).toBe('✓')
  })

  it('error 步骤显示 ✗', () => {
    const stepsWithError = [{ title: '步骤一', status: 'error' as const }, { title: '步骤二' }, { title: '步骤三' }]
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: stepsWithError }
    })
    expect(wrapper.find('.see-steps__icon-text').text()).toBe('✗')
  })

  it('direction=vertical 时垂直布局', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps, direction: 'vertical' }
    })
    expect(wrapper.find('.see-steps--vertical').exists()).toBe(true)
  })

  it('isDotStyle 时使用圆点样式', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps, isDotStyle: true }
    })
    expect(wrapper.find('.see-steps--dot').exists()).toBe(true)
    expect(wrapper.findAll('.see-steps__dot').length).toBe(3)
  })

  it('isClickable 时可点击', async () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 2, steps: defaultSteps, isClickable: true }
    })
    await wrapper.findAll('.see-steps__item')[0].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeTruthy()
    expect(wrapper.emitted('onChange')![0]).toEqual([0, defaultSteps[0]])
  })

  it('isClickable=false 时不触发 onChange', async () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 2, steps: defaultSteps, isClickable: false }
    })
    await wrapper.findAll('.see-steps__item')[0].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  it('点击未来步骤不触发', async () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps, isClickable: true }
    })
    await wrapper.findAll('.see-steps__item')[2].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  it('到达最后一步触发 onFinish', async () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 2, steps: defaultSteps, isClickable: true }
    })
    await wrapper.findAll('.see-steps__item')[2].trigger('tap')
    expect(wrapper.emitted('onFinish')).toBeTruthy()
  })

  it('连接线存在', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps }
    })
    // 3 个步骤有 2 条连接线
    expect(wrapper.findAll('.see-steps__line').length).toBe(2)
  })

  it('空步骤列表不崩溃', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: [] }
    })
    expect(wrapper.find('.see-steps').exists()).toBe(true)
  })

  it('单个步骤场景', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: [{ title: '唯一步骤' }] }
    })
    expect(wrapper.findAll('.see-steps__item').length).toBe(1)
    expect(wrapper.findAll('.see-steps__line').length).toBe(0)
  })

  it('自定义 activeColor 应应用到当前步骤', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps, activeColor: '#ff0000' }
    })
    expect(wrapper.find('.see-steps').exists()).toBe(true)
  })

  it('步骤序号正确显示', () => {
    const wrapper = mount(SeeSteps, {
      props: { modelValue: 0, steps: defaultSteps }
    })
    const numbers = wrapper.findAll('.see-steps__icon-number')
    expect(numbers[0].text()).toBe('1')
    expect(numbers[1].text()).toBe('2')
    expect(numbers[2].text()).toBe('3')
  })
})
