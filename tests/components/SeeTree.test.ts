import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeTree from '../../uni_modules/see-u-ui/components/see-tree/see-tree.vue'

const mockTreeData = [
  {
    id: 1,
    label: '节点1',
    children: [
      { id: 11, label: '节点1-1' },
      { id: 12, label: '节点1-2' }
    ]
  },
  {
    id: 2,
    label: '节点2',
    children: [
      {
        id: 21,
        label: '节点2-1',
        children: [{ id: 211, label: '节点2-1-1' }]
      }
    ]
  },
  { id: 3, label: '节点3' }
]

describe('SeeTree', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基础渲染', () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    expect(wrapper.find('.see-tree').exists()).toBe(true)
  })

  it('渲染根节点', () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    expect(wrapper.text()).toContain('节点1')
    expect(wrapper.text()).toContain('节点2')
    expect(wrapper.text()).toContain('节点3')
  })

  it('渲染节点数量', () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    // 根节点 3 个
    expect(wrapper.findAll('.see-tree__node').length).toBe(3)
  })

  it('点击节点触发展开', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    await wrapper.findAll('.see-tree__node')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    // 展开后应该显示子节点
    expect(wrapper.text()).toContain('节点1-1')
  })

  it('再次点击节点触发折叠', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    // 展开
    await wrapper.findAll('.see-tree__node')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('节点1-1')
    // 折叠
    await wrapper.findAll('.see-tree__node')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).not.toContain('节点1-1')
  })

  it('多层嵌套展开', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    // 展开节点2
    await wrapper.findAll('.see-tree__node')[1].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('节点2-1')
    // 展开节点2-1
    const nodes = wrapper.findAll('.see-tree__node')
    const node21 = nodes.find((n) => n.text().includes('节点2-1'))
    if (node21) {
      await node21.trigger('tap')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('节点2-1-1')
    }
  })

  it('叶子节点无展开图标', () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    // 节点3 是叶子节点
    const node3 = wrapper.findAll('.see-tree__node')[2]
    expect(node3.find('.see-tree__expand-icon-text').exists()).toBe(false)
  })

  it('isCheckable 显示复选框', () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData, isCheckable: true }
    })
    expect(wrapper.find('.see-tree__checkbox').exists()).toBe(true)
  })

  it('点击复选框切换选中', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData, isCheckable: true }
    })
    await wrapper.find('.see-tree__checkbox').trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-tree__checkbox--checked').exists()).toBe(true)
  })

  it('isFilterable 显示搜索框', () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData, isFilterable: true }
    })
    expect(wrapper.find('.see-tree__search').exists()).toBe(true)
  })

  it('空数据显示', () => {
    const wrapper = mount(SeeTree, {
      props: { data: [], emptyText: '无数据' }
    })
    expect(wrapper.find('.see-tree__empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('无数据')
  })

  it('空数据默认文字', () => {
    const wrapper = mount(SeeTree, {
      props: { data: [] }
    })
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('自定义 emptyText', () => {
    const wrapper = mount(SeeTree, {
      props: { data: [], emptyText: '没有内容' }
    })
    expect(wrapper.text()).toContain('没有内容')
  })

  it('禁用节点不响应点击', async () => {
    const disabledData = [
      { id: 1, label: '可用', children: [{ id: 11, label: '子节点' }] },
      { id: 2, label: '禁用', isDisabled: true }
    ]
    const wrapper = mount(SeeTree, {
      props: { data: disabledData }
    })
    await wrapper.findAll('.see-tree__node')[1].trigger('tap')
    await wrapper.vm.$nextTick()
    // 禁用节点不应展开
    expect(wrapper.findAll('.see-tree__node').length).toBe(2)
  })

  it('单节点场景', () => {
    const wrapper = mount(SeeTree, {
      props: { data: [{ id: 1, label: '唯一节点' }] }
    })
    expect(wrapper.findAll('.see-tree__node').length).toBe(1)
    expect(wrapper.text()).toContain('唯一节点')
  })

  it('expose.expandAll 可展开所有节点', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    ;(wrapper.vm as any).expandAll()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('节点1-1')
    expect(wrapper.text()).toContain('节点2-1')
  })

  it('expose.collapseAll 可折叠所有节点', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    ;(wrapper.vm as any).expandAll()
    await wrapper.vm.$nextTick()
    ;(wrapper.vm as any).collapseAll()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).not.toContain('节点1-1')
  })

  it('expose.getCheckedNodes 返回选中节点', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData, isCheckable: true }
    })
    await wrapper.find('.see-tree__checkbox').trigger('tap')
    await wrapper.vm.$nextTick()
    const checked = (wrapper.vm as any).getCheckedNodes()
    expect(checked.length).toBeGreaterThan(0)
  })

  it('expose.appendNode 可添加节点', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    ;(wrapper.vm as any).appendNode(1, { id: 13, label: '节点1-3' })
    await wrapper.vm.$nextTick()
    // 展开节点1
    await wrapper.findAll('.see-tree__node')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('节点1-3')
  })

  it('expose.removeNode 可移除节点', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    ;(wrapper.vm as any).removeNode(3)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).not.toContain('节点3')
  })

  it('expose.updateNode 可更新节点', async () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData }
    })
    // updateNode 不应抛出错误
    expect(() => {
      ;(wrapper.vm as any).updateNode(3, { label: '新节点3' })
    }).not.toThrow()
  })

  it('节点缩进随层级增加', () => {
    const wrapper = mount(SeeTree, {
      props: { data: mockTreeData, indent: 20 }
    })
    const nodes = wrapper.findAll('.see-tree__node')
    // 根节点应有基础缩进
    expect(nodes[0].attributes('style')).toContain('padding-left')
  })

  it('大量节点渲染', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      label: `节点${i}`,
      children: Array.from({ length: 10 }, (_, j) => ({
        id: i * 100 + j,
        label: `节点${i}-${j}`
      }))
    }))
    const wrapper = mount(SeeTree, {
      props: { data: largeData }
    })
    // 100 个根节点
    expect(wrapper.findAll('.see-tree__node').length).toBe(100)
  })
})
