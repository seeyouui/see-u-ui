import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useTableTree } from '@/uni_modules/see-u-ui/components/see-table/hooks/useTableTree'

interface TreeNode {
  id: number
  name: string
  children?: TreeNode[]
}

describe('useTableTree', () => {
  it('tree without rowKey uses JSON.stringify to avoid key conflicts', () => {
    const data = ref<TreeNode[]>([
      { id: 1, name: 'A', children: [{ id: 11, name: 'A1' }] },
      { id: 2, name: 'B', children: [{ id: 21, name: 'B1' }] }
    ])

    const { flatRows, toggleExpand, isNodeExpanded } = useTableTree({
      data,
      childrenField: ref('children'),
      defaultExpandAll: ref(false),
      rowKey: ref('')
    })

    // Initially both collapsed: only root rows visible
    expect(flatRows.value.length).toBe(2)

    // Toggle first root node
    toggleExpand(data.value[0], 0)
    expect(isNodeExpanded(data.value[0], 0)).toBe(true)
    expect(isNodeExpanded(data.value[1], 0)).toBe(false)

    // flatRows should now include A's child
    expect(flatRows.value.length).toBe(3)

    // Toggle second root node
    toggleExpand(data.value[1], 0)
    expect(isNodeExpanded(data.value[1], 0)).toBe(true)
    expect(flatRows.value.length).toBe(4)

    // Collapse first — should not affect second
    toggleExpand(data.value[0], 0)
    expect(isNodeExpanded(data.value[0], 0)).toBe(false)
    expect(isNodeExpanded(data.value[1], 0)).toBe(true)
    expect(flatRows.value.length).toBe(3)
  })

  it('tree with rowKey uses the key field', () => {
    const data = ref<TreeNode[]>([
      { id: 1, name: 'A', children: [{ id: 11, name: 'A1' }] },
      { id: 2, name: 'B' }
    ])

    const { flatRows, toggleExpand, isNodeExpanded } = useTableTree({
      data,
      childrenField: ref('children'),
      defaultExpandAll: ref(false),
      rowKey: ref('id')
    })

    expect(flatRows.value.length).toBe(2)

    toggleExpand(data.value[0], 0)
    expect(isNodeExpanded(data.value[0], 0)).toBe(true)
    expect(flatRows.value.length).toBe(3)
  })

  it('defaultExpandAll expands all nodes', () => {
    const data = ref<TreeNode[]>([
      { id: 1, name: 'A', children: [{ id: 11, name: 'A1', children: [{ id: 111, name: 'A11' }] }] },
      { id: 2, name: 'B', children: [{ id: 21, name: 'B1' }] }
    ])

    const { flatRows } = useTableTree({
      data,
      childrenField: ref('children'),
      defaultExpandAll: ref(true),
      rowKey: ref('id')
    })

    // All nodes expanded: A, A1, A11, B, B1
    expect(flatRows.value.length).toBe(5)
  })
})
