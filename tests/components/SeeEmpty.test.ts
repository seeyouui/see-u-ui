import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeEmpty from '../../uni_modules/see-u-ui/components/see-empty/see-empty.vue'

describe('SeeEmpty', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基础渲染', () => {
    const wrapper = mount(SeeEmpty)
    expect(wrapper.find('.see-empty').exists()).toBe(true)
  })

  it('默认类型显示暂无数据', () => {
    const wrapper = mount(SeeEmpty, { props: { type: 'default' } })
    expect(wrapper.text()).toContain('No Data')
  })

  it('search 类型显示正确文字', () => {
    const wrapper = mount(SeeEmpty, { props: { type: 'search' } })
    expect(wrapper.text()).toContain('No Results Found')
    expect(wrapper.text()).toContain('Please try modifying your search')
  })

  it('network 类型显示正确文字', () => {
    const wrapper = mount(SeeEmpty, { props: { type: 'network' } })
    expect(wrapper.text()).toContain('Network Error')
    expect(wrapper.text()).toContain('Please check your connection and retry')
  })

  it('error 类型显示正确文字', () => {
    const wrapper = mount(SeeEmpty, { props: { type: 'error' } })
    expect(wrapper.text()).toContain('Page Error')
    expect(wrapper.text()).toContain('Please try again later')
  })

  it('404 类型显示正确文字', () => {
    const wrapper = mount(SeeEmpty, { props: { type: '404' } })
    expect(wrapper.text()).toContain('Page Not Found')
    expect(wrapper.text()).toContain('The page you visited does not exist')
  })

  it('自定义标题', () => {
    const wrapper = mount(SeeEmpty, { props: { title: '自定义标题' } })
    expect(wrapper.text()).toContain('自定义标题')
  })

  it('自定义描述', () => {
    const wrapper = mount(SeeEmpty, { props: { description: '自定义描述' } })
    expect(wrapper.text()).toContain('自定义描述')
  })

  it('显示操作按钮', () => {
    const wrapper = mount(SeeEmpty, {
      props: { isShowAction: true, actionText: '重试' }
    })
    expect(wrapper.find('.see-empty__action').exists()).toBe(true)
    expect(wrapper.text()).toContain('重试')
  })

  it('隐藏操作按钮', () => {
    const wrapper = mount(SeeEmpty, {
      props: { isShowAction: false, actionText: '重试' }
    })
    expect(wrapper.find('.see-empty__action').exists()).toBe(false)
  })

  it('点击操作按钮触发 onAction', async () => {
    const wrapper = mount(SeeEmpty, {
      props: { isShowAction: true, actionText: '重试' }
    })
    await wrapper.find('.see-empty__action').trigger('tap')
    expect(wrapper.emitted('onAction')).toBeTruthy()
  })

  it('自定义图片', () => {
    const wrapper = mount(SeeEmpty, {
      props: { image: 'https://example.com/empty.png' }
    })
    expect(wrapper.find('.see-empty__image').exists()).toBe(true)
  })

  it('自定义图片尺寸', () => {
    const wrapper = mount(SeeEmpty, {
      props: { imageSize: '200px' }
    })
    const image = wrapper.find('.see-empty__image')
    const style = image.attributes('style') || ''
    expect(style).toContain('200px')
  })

  it('icon 显示', () => {
    const wrapper = mount(SeeEmpty, { props: { type: 'default' } })
    expect(wrapper.find('.see-empty__icon').exists()).toBe(true)
  })

  it('custom 类型无默认内容', () => {
    const wrapper = mount(SeeEmpty, { props: { type: 'custom' } })
    // custom 类型没有默认标题
    expect(wrapper.text()).not.toContain('No Data')
  })

  it('image 插槽', () => {
    const wrapper = mount(SeeEmpty, {
      slots: {
        image: '<text class="custom-image">自定义图片</text>'
      }
    })
    expect(wrapper.find('.custom-image').exists()).toBe(true)
  })

  it('action 插槽', () => {
    const wrapper = mount(SeeEmpty, {
      props: { isShowAction: true, actionText: '按钮' },
      slots: {
        action: '<text class="custom-action">自定义按钮</text>'
      }
    })
    expect(wrapper.find('.custom-action').exists()).toBe(true)
  })

  it('无描述时不渲染描述区域', () => {
    const wrapper = mount(SeeEmpty, { props: { type: 'default' } })
    // default 类型没有默认描述
    expect(wrapper.find('.see-empty__description').exists()).toBe(false)
  })

  it('有描述时渲染描述区域', () => {
    const wrapper = mount(SeeEmpty, { props: { type: 'search' } })
    expect(wrapper.find('.see-empty__description').exists()).toBe(true)
  })
})
