import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, ref } from 'vue'
import SeeCollapse from '../../uni_modules/see-u-ui/components/see-collapse/see-collapse.vue'
import SeeCollapseItem from '../../uni_modules/see-u-ui/components/see-collapse/see-collapse-item.vue'

const mountTree = (props: any = {}) => {
  const Host = defineComponent({
    components: { SeeCollapse, SeeCollapseItem },
    props: {
      modelValue: { type: Array, default: () => [] },
      isAccordion: { type: Boolean, default: false }
    },
    emits: ['update:modelValue', 'onChange'],
    setup() {
      const collapseRef = ref<any>(null)
      return { collapseRef }
    },
    template: `
      <SeeCollapse
        ref="collapseRef"
        :modelValue="modelValue"
        :isAccordion="isAccordion"
        @update:modelValue="$emit('update:modelValue', $event)"
        @onChange="$emit('onChange', $event)"
      >
        <SeeCollapseItem name="a" title="A">a content</SeeCollapseItem>
        <SeeCollapseItem name="b" title="B">b content</SeeCollapseItem>
        <SeeCollapseItem name="c" title="C">c content</SeeCollapseItem>
      </SeeCollapse>
    `
  })
  return mount(Host, { props })
}

describe('SeeCollapse + SeeCollapseItem 组件测试', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('基本渲染', () => {
    it('父子容器都渲染', async () => {
      const wrapper = mountTree({ modelValue: [] })
      await nextTick()
      expect(wrapper.find('.see-collapse').exists()).toBe(true)
      expect(wrapper.findAll('.see-collapse-item').length).toBe(3)
    })

    it('默认 isShowBorder=true 应应用边框类', async () => {
      const wrapper = mountTree({ modelValue: [] })
      await nextTick()
      expect(wrapper.find('.see-collapse--border').exists()).toBe(true)
    })
  })

  describe('展开/折叠', () => {
    it('点击 item 标题应 emit update:modelValue', async () => {
      const wrapper = mountTree({ modelValue: [] })
      await nextTick()
      const firstHeader = wrapper.findAll('.see-collapse-item__header')[0]
      await firstHeader.trigger('click')
      await nextTick()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toContain('a')
    })

    it('再次点击同 item 应收起', async () => {
      const wrapper = mountTree({ modelValue: ['a'] })
      await nextTick()
      const firstHeader = wrapper.findAll('.see-collapse-item__header')[0]
      await firstHeader.trigger('click')
      await nextTick()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      // 最后一次 emit 应不包含 a
      const last = emitted![emitted!.length - 1][0] as any[]
      expect(last.includes('a')).toBe(false)
    })
  })

  describe('手风琴模式', () => {
    it('isAccordion=true 时只能展开一个 item', async () => {
      const wrapper = mountTree({ modelValue: ['a'], isAccordion: true })
      await nextTick()
      // 点 b
      const headers = wrapper.findAll('.see-collapse-item__header')
      await headers[1].trigger('click')
      await nextTick()
      const emitted = wrapper.emitted('update:modelValue')
      const last = emitted![emitted!.length - 1][0] as any[]
      expect(last.length).toBeLessThanOrEqual(1)
    })
  })

  describe('toggleAll（regression: P0-2 需补"展开"分支）', () => {
    it('[修复后通过] 全部折叠时调用 toggleAll() 应展开所有项（regression: P0-2）', async () => {
      const wrapper = mountTree({ modelValue: [] })
      await nextTick()
      const collapseVm = (wrapper.vm as any).collapseRef
      collapseVm.toggleAll()
      await nextTick()
      const emitted = wrapper.emitted('update:modelValue')
      const last = emitted ? (emitted[emitted.length - 1][0] as any[]) : []
      // 修复后应为 3 项 ['a','b','c']
      expect(last.length).toBe(3) // regression: P0-2
    })

    it('全部展开时调用 toggleAll() 应折叠所有项', async () => {
      const wrapper = mountTree({ modelValue: ['a', 'b', 'c'] })
      await nextTick()
      const collapseVm = (wrapper.vm as any).collapseRef
      collapseVm.toggleAll()
      await nextTick()
      const emitted = wrapper.emitted('update:modelValue')
      const last = emitted ? (emitted[emitted.length - 1][0] as any[]) : []
      expect(last.length).toBe(0)
    })
  })

  describe('expandAll / collapseAll', () => {
    it('expandAll 应展开所有已注册项', async () => {
      const wrapper = mountTree({ modelValue: [] })
      await nextTick()
      const collapseVm = (wrapper.vm as any).collapseRef
      collapseVm.expandAll()
      await nextTick()
      const emitted = wrapper.emitted('update:modelValue')!
      const last = emitted[emitted.length - 1][0] as any[]
      expect([...last].sort()).toEqual(['a', 'b', 'c'])
    })

    it('collapseAll 应清空', async () => {
      const wrapper = mountTree({ modelValue: ['a', 'b', 'c'] })
      await nextTick()
      const collapseVm = (wrapper.vm as any).collapseRef
      collapseVm.collapseAll()
      await nextTick()
      const emitted = wrapper.emitted('update:modelValue')!
      const last = emitted[emitted.length - 1][0] as any[]
      expect(last).toEqual([])
    })
  })

  describe('disabled item', () => {
    it('isDisabled item 应应用 disabled 类', () => {
      const wrapper = mount(SeeCollapseItem, {
        props: { name: 'x', title: 'X', isDisabled: true }
      })
      expect(wrapper.find('.see-collapse-item--disabled').exists()).toBe(true)
    })
  })
})
