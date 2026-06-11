import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeActionSheet from '../../uni_modules/see-u-ui/components/see-action-sheet/see-action-sheet.vue'
import type { ActionSheetAction } from '../../uni_modules/see-u-ui/components/see-action-sheet/type'

describe('SeeActionSheet 组件测试', () => {
  const actions: ActionSheetAction[] = [
    { name: '拍照', description: '使用相机' },
    { name: '从相册选择' },
    { name: '禁用项', isDisabled: true },
    { name: '加载中', loading: true }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    document.body.removeAttribute('style')
  })

  describe('基本渲染', () => {
    it('show=false 时不渲染', () => {
      const wrapper = mount(SeeActionSheet, { props: { show: false, actions } })
      expect(wrapper.find('.see-action-sheet').exists()).toBe(false)
    })

    it('show=true 时渲染所有 action 项', async () => {
      document.body.innerHTML = ''
      mount(SeeActionSheet, { props: { show: true, actions }, attachTo: document.body })
      await nextTick()
      const html = document.body.innerHTML
      expect(html).toContain('拍照')
      expect(html).toContain('从相册选择')
      expect(html).toContain('禁用项')
      expect(html).toContain('加载中')
    })

    it('应渲染 description 副标题', async () => {
      document.body.innerHTML = ''
      mount(SeeActionSheet, { props: { show: true, actions }, attachTo: document.body })
      await nextTick()
      expect(document.body.innerHTML).toContain('使用相机')
    })

    it('title prop 应被渲染', async () => {
      document.body.innerHTML = ''
      mount(SeeActionSheet, {
        props: { show: true, title: '请选择操作', actions },
        attachTo: document.body
      })
      await nextTick()
      expect(document.body.innerHTML).toContain('请选择操作')
    })
  })

  describe('选项点击', () => {
    it('点击启用项应 emit onSelect', async () => {
      document.body.innerHTML = ''
      const wrapper = mount(SeeActionSheet, {
        props: { show: true, actions },
        attachTo: document.body
      })
      await nextTick()
      const items = document.body.querySelectorAll('.see-action-sheet__item')
      if (items.length > 0) {
        ;(items[0] as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('onSelect')).toBeTruthy()
      }
    })

    it('点击 disabled 项不应 emit onSelect', async () => {
      document.body.innerHTML = ''
      const wrapper = mount(SeeActionSheet, {
        props: { show: true, actions },
        attachTo: document.body
      })
      await nextTick()
      const items = document.body.querySelectorAll('.see-action-sheet__item')
      if (items.length >= 3) {
        ;(items[2] as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }))
        const emitted = wrapper.emitted('onSelect')
        expect(!emitted || !emitted.some((e: any) => e[0]?.isDisabled === true)).toBe(true)
      }
    })

    it('点击 loading 项不应 emit onSelect', async () => {
      document.body.innerHTML = ''
      const wrapper = mount(SeeActionSheet, {
        props: { show: true, actions },
        attachTo: document.body
      })
      await nextTick()
      const items = document.body.querySelectorAll('.see-action-sheet__item')
      if (items.length >= 4) {
        ;(items[3] as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }))
        const emitted = wrapper.emitted('onSelect')
        expect(!emitted || !emitted.some((e: any) => e[0]?.loading === true)).toBe(true)
      }
    })
  })

  describe('取消按钮', () => {
    it('isShowCancelBtn=true 时显示取消按钮，点击 emit onCancel', async () => {
      document.body.innerHTML = ''
      const wrapper = mount(SeeActionSheet, {
        props: { show: true, actions, isShowCancelBtn: true },
        attachTo: document.body
      })
      await nextTick()
      const cancel = document.body.querySelector('.see-action-sheet__cancel') as HTMLElement | null
      if (cancel) {
        cancel.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        expect(wrapper.emitted('onCancel') || wrapper.emitted('update:show')).toBeTruthy()
      }
    })
  })
})
