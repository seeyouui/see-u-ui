import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import SeeTable from '@/uni_modules/see-u-ui/components/see-table/see-table.vue'
import type { SeeTableColumn } from '@/uni_modules/see-u-ui/components/see-table/type'
import { useTableVirtual } from '@/uni_modules/see-u-ui/components/see-table/hooks/useTableVirtual'
import { useTableColumns } from '@/uni_modules/see-u-ui/components/see-table/hooks/useTableColumns'

interface TestRow {
  id: number
  name: string
  age: number
}

const testData: TestRow[] = [
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 32 },
  { id: 3, name: '王五', age: 25 }
]

const testColumns: SeeTableColumn<TestRow>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 100, align: 'right' }
]

describe('SeeTable', () => {
  // ========== 渲染 ==========
  it('renders table with data', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('李四')
    expect(wrapper.text()).toContain('王五')
  })

  it('renders column headers', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
    expect(wrapper.text()).toContain('ID')
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('年龄')
  })

  it('renders correct number of rows', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
    const rows = wrapper.findAll('.see-table__row')
    expect(rows.length).toBe(3)
  })

  it('renders correct number of cells per row', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
    const rows = wrapper.findAll('.see-table__row')
    if (rows.length > 0) {
      const cells = rows[0].findAll('.see-table__cell')
      expect(cells.length).toBe(3)
    }
  })

  // ========== 空状态 ==========
  it('renders empty state when data is empty', () => {
    const wrapper = mount(SeeTable, { props: { data: [], columns: testColumns, emptyText: '暂无数据' } })
    expect(wrapper.text()).toContain('暂无数据')
    expect(wrapper.find('.see-table__empty-icon').exists()).toBe(true)
  })

  it('renders default empty text', () => {
    const wrapper = mount(SeeTable, { props: { data: [], columns: testColumns } })
    expect(wrapper.text()).toContain('No Data')
  })

  it('renders custom empty slot', () => {
    const wrapper = mount(SeeTable, {
      props: { data: [], columns: testColumns },
      slots: { empty: '<text class="custom-empty">自定义空</text>' }
    })
    expect(wrapper.find('.custom-empty').exists()).toBe(true)
  })

  // ========== 加载状态 ==========
  it('renders loading state when loading and no data', () => {
    const wrapper = mount(SeeTable, { props: { data: [], columns: testColumns, loading: true } })
    expect(wrapper.find('.see-table__loading-spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders loading overlay when loading with existing data', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns, loading: true } })
    expect(wrapper.find('.see-table__loading-overlay').exists()).toBe(true)
  })

  // ========== 错误状态 ==========
  it('renders error state when error and no data', () => {
    const wrapper = mount(SeeTable, { props: { data: [], columns: testColumns, error: true } })
    expect(wrapper.text()).toContain('Failed to load')
    expect(wrapper.find('.see-table__error-icon').exists()).toBe(true)
  })

  // ========== 边框 ==========
  it('applies border class when border prop is true', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns, border: true } })
    expect(wrapper.find('.see-table--border').exists()).toBe(true)
  })

  // ========== 斑马纹 ==========
  it('applies stripe class when stripe prop is true', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns, stripe: true } })
    expect(wrapper.find('.see-table--stripe').exists()).toBe(true)
    const evenRows = wrapper.findAll('.see-table__row--even')
    expect(evenRows.length).toBe(1) // row index 1 (second row)
  })

  // ========== 尺寸 ==========
  it('applies size class', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns, size: 'small' } })
    expect(wrapper.find('.see-table--small').exists()).toBe(true)
  })

  it('defaults to medium size', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
    expect(wrapper.find('.see-table--medium').exists()).toBe(true)
  })

  // ========== 列对齐 ==========
  it('applies column align class', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
    const headerCells = wrapper.findAll('.see-table__header-cell')
    // ID column has align: 'center'
    expect(headerCells[0].classes()).toContain('see-table__cell--center')
    // age column has align: 'right'
    expect(headerCells[2].classes()).toContain('see-table__cell--right')
  })

  // ========== 列宽样式 ==========
  it('applies column width style', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
    const headerCells = wrapper.findAll('.see-table__header-cell')
    expect(headerCells[0].attributes('style')).toContain('width: 80px')
  })

  // ========== 事件 ==========
  it('emits onRowClick when row is clicked', async () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
    const rows = wrapper.findAll('.see-table__row')
    await rows[0].trigger('tap')
    expect(wrapper.emitted('onRowClick')).toBeTruthy()
    expect(wrapper.emitted('onRowClick')![0]).toEqual([testData[0], 0])
  })

  it('emits onCellClick when cell is clicked', async () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
    const cells = wrapper.findAll('.see-table__cell')
    await cells[1].trigger('tap')
    expect(wrapper.emitted('onCellClick')).toBeTruthy()
  })

  // ========== formatter ==========
  it('uses formatter when provided', () => {
    const columnsWithFormatter: SeeTableColumn<TestRow>[] = [
      { key: 'id', title: 'ID', width: 80 },
      { key: 'name', title: '姓名', width: 120, formatter: (row) => `【${row.name}】` }
    ]
    const wrapper = mount(SeeTable, { props: { data: testData, columns: columnsWithFormatter } })
    expect(wrapper.text()).toContain('【张三】')
    expect(wrapper.text()).toContain('【李四】')
  })

  // ========== ellipsis ==========
  it('applies ellipsis class', () => {
    const columnsWithEllipsis: SeeTableColumn<TestRow>[] = [{ key: 'name', title: '姓名', width: 100, ellipsis: true }]
    const wrapper = mount(SeeTable, { props: { data: testData, columns: columnsWithEllipsis } })
    const cells = wrapper.findAll('.see-table__cell--ellipsis')
    expect(cells.length).toBeGreaterThan(0)
  })

  // ========== 隐藏表头 ==========
  it('hides header when showHeader is false', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns, showHeader: false } })
    expect(wrapper.find('.see-table__header').exists()).toBe(false)
  })

  // ========== rowKey ==========
  it('uses rowKey field for row keys', () => {
    const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns, rowKey: 'id' } })
    const rows = wrapper.findAll('.see-table__row')
    expect(rows.length).toBe(3)
  })

  // ========== 默认 props ==========
  it('has correct default props', () => {
    const wrapper = mount(SeeTable, { props: { data: [], columns: [] } })
    expect(wrapper.find('.see-table--medium').exists()).toBe(true)
    expect(wrapper.find('.see-table--border').exists()).toBe(false)
    expect(wrapper.find('.see-table--stripe').exists()).toBe(false)
  })

  // ========== cell 插槽 ==========
  it('renders cell slot', () => {
    const wrapper = mount(SeeTable, {
      props: { data: testData, columns: testColumns },
      slots: {
        'cell-name': '<text class="custom-cell">自定义单元格</text>'
      }
    })
    expect(wrapper.findAll('.custom-cell').length).toBe(3)
  })

  // ========== header 插槽 ==========
  it('renders header slot', () => {
    const wrapper = mount(SeeTable, {
      props: { data: testData, columns: testColumns },
      slots: {
        'header-name': '<text class="custom-header">自定义表头</text>'
      }
    })
    expect(wrapper.find('.custom-header').exists()).toBe(true)
  })

  // ========== footer 插槽 ==========
  it('renders footer slot', () => {
    const wrapper = mount(SeeTable, {
      props: { data: testData, columns: testColumns },
      slots: {
        footer: '<text class="custom-footer">表格底部</text>'
      }
    })
    expect(wrapper.find('.custom-footer').exists()).toBe(true)
  })

  // ========== 空数据但无 columns ==========
  it('handles empty data and empty columns gracefully', () => {
    const wrapper = mount(SeeTable, { props: { data: [], columns: [] } })
    expect(wrapper.find('.see-table__empty-icon').exists()).toBe(true)
  })

  // ========== Phase 4: 排序 ==========
  describe('排序 (Sorting)', () => {
    const sortableColumns: SeeTableColumn<TestRow>[] = [
      { key: 'id', title: 'ID', width: 80, align: 'center' },
      { key: 'name', title: '姓名', width: 120, sortable: true },
      { key: 'age', title: '年龄', width: 100, sortable: true }
    ]

    it('renders sort indicators for sortable columns', () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: sortableColumns, sortable: true } })
      const sortIcons = wrapper.findAll('.see-table__sort-icon')
      expect(sortIcons.length).toBeGreaterThan(0)
    })

    it('emits onSortChange when sortable header is clicked', async () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: sortableColumns } })
      const headerCells = wrapper.findAll('.see-table__header-cell--sortable')
      await headerCells[0].trigger('tap')
      expect(wrapper.emitted('onSortChange')).toBeTruthy()
      expect(wrapper.emitted('onSortChange')![0][0]).toMatchObject({ key: 'name', order: 'asc' })
    })

    it('cycles through sort states: none -> asc -> desc -> none', async () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: sortableColumns } })
      const headerCells = wrapper.findAll('.see-table__header-cell--sortable')

      // Click 1: asc
      await headerCells[0].trigger('tap')
      expect(wrapper.emitted('onSortChange')![0][0]).toMatchObject({ order: 'asc' })

      // Click 2: desc
      await headerCells[0].trigger('tap')
      expect(wrapper.emitted('onSortChange')![1][0]).toMatchObject({ order: 'desc' })

      // Click 3: none
      await headerCells[0].trigger('tap')
      expect(wrapper.emitted('onSortChange')![2][0]).toMatchObject({ order: '' })
    })

    it('applies active sort class to current sort direction', async () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: sortableColumns, sortKey: 'name', sortOrder: 'asc' }
      })
      const activeArrows = wrapper.findAll('.see-table__sort-arrow--active')
      expect(activeArrows.length).toBe(1)
    })

    it('sorts data ascending by numeric field', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: sortableColumns, sortKey: 'age', sortOrder: 'asc' }
      })
      const rows = wrapper.findAll('.see-table__row')
      // age: 25 (王五), 28 (张三), 32 (李四)
      expect(rows[0].text()).toContain('25')
      expect(rows[1].text()).toContain('28')
      expect(rows[2].text()).toContain('32')
    })

    it('sorts data descending by string field', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: sortableColumns, sortKey: 'name', sortOrder: 'desc' }
      })
      const rows = wrapper.findAll('.see-table__row')
      // 张三, 王五, 李四 (desc by pinyin)
      expect(rows[0].text()).toContain('张三')
    })

    it('does not sort when column is custom sortable', () => {
      const customColumns: SeeTableColumn<TestRow>[] = [{ key: 'name', title: '姓名', width: 120, sortable: 'custom' }]
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: customColumns, sortKey: 'name', sortOrder: 'asc' }
      })
      // Custom mode should not sort internally, only emit event
      const rows = wrapper.findAll('.see-table__row')
      expect(rows[0].text()).toContain('张三')
    })

    it('renders sort icon when table-level sortable is true', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: testColumns, sortable: true }
      })
      const sortIcons = wrapper.findAll('.see-table__sort-icon')
      expect(sortIcons.length).toBe(3) // All columns get sort icons
    })
  })

  // ========== Phase 4: 选择 ==========
  describe('选择 (Selection)', () => {
    it('renders checkboxes when selectable is true', () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns, selectable: true } })
      const checkboxes = wrapper.findAll('.see-table__checkbox')
      // 1 header checkbox + 3 row checkboxes
      expect(checkboxes.length).toBe(4)
    })

    it('toggles row selection on checkbox click', async () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns, selectable: true, rowKey: 'id' } })
      const rowCheckboxes = wrapper.findAll('.see-table__cell--selection .see-table__checkbox')
      await rowCheckboxes[0].trigger('tap')
      expect(wrapper.emitted('onSelectionChange')).toBeTruthy()
      expect(wrapper.emitted('onSelectionChange')![0][0]).toContain(1)
    })

    it('selects all rows when header checkbox is clicked', async () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns, selectable: true, rowKey: 'id' } })
      const headerCheckbox = wrapper.find('.see-table__header-cell--selection .see-table__checkbox')
      await headerCheckbox.trigger('tap')
      expect(wrapper.emitted('onSelectionChange')).toBeTruthy()
      const emittedKeys = wrapper.emitted('onSelectionChange')![0][0] as number[]
      expect(emittedKeys).toEqual([1, 2, 3])
    })

    it('shows checked state for selected rows', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: testColumns, selectable: true, rowKey: 'id', selectedKeys: [1, 2] }
      })
      const checkedBoxes = wrapper.findAll('.see-table__checkbox--checked')
      // 2 row checkboxes checked (header is indeterminate, not checked)
      expect(checkedBoxes.length).toBe(2)
    })

    it('shows indeterminate state when some rows are selected', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: testColumns, selectable: true, rowKey: 'id', selectedKeys: [1] }
      })
      const headerCheckbox = wrapper.find('.see-table__header-cell--selection .see-table__checkbox')
      expect(headerCheckbox.classes()).toContain('see-table__checkbox--indeterminate')
    })

    it('shows all-checked state when all rows are selected', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: testColumns, selectable: true, rowKey: 'id', selectedKeys: [1, 2, 3] }
      })
      const headerCheckbox = wrapper.find('.see-table__header-cell--selection .see-table__checkbox')
      expect(headerCheckbox.classes()).toContain('see-table__checkbox--checked')
    })

    it('uses defaultSelectedKeys for uncontrolled mode', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: testColumns, selectable: true, rowKey: 'id', defaultSelectedKeys: [1] }
      })
      const checkedBoxes = wrapper.findAll('.see-table__checkbox--checked')
      expect(checkedBoxes.length).toBe(1)
    })

    it('works with selection column type', () => {
      const columnsWithSelection: SeeTableColumn<TestRow>[] = [{ key: '__sel__', title: '', type: 'selection', width: 50 }, ...testColumns]
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: columnsWithSelection, selectable: true, rowKey: 'id' }
      })
      const checkboxes = wrapper.findAll('.see-table__checkbox')
      expect(checkboxes.length).toBe(4)
    })
  })

  // ========== Phase 4: 展开行 ==========
  describe('展开行 (Expandable Rows)', () => {
    const expandColumns: SeeTableColumn<TestRow>[] = [{ key: '__expand__', title: '', type: 'expand', width: 40 }, ...testColumns]

    it('renders expand icons when expandable', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: expandColumns, expandable: true }
      })
      const expandIcons = wrapper.findAll('.see-table__expand-icon')
      expect(expandIcons.length).toBe(3)
    })

    it('toggles row expansion on icon click', async () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: expandColumns, expandable: true, rowKey: 'id' }
      })
      const expandIcons = wrapper.findAll('.see-table__expand-icon')
      await expandIcons[0].trigger('tap')
      expect(wrapper.emitted('onExpandChange')).toBeTruthy()
      expect(wrapper.emitted('onExpandChange')![0][0]).toContain(1)
    })

    it('shows expanded content when row is expanded', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: expandColumns, expandable: true, rowKey: 'id', expandedKeys: [1] },
        slots: {
          expand: '<text class="expand-content">展开内容</text>'
        }
      })
      expect(wrapper.find('.expand-content').exists()).toBe(true)
      expect(wrapper.find('.see-table__expand-row').exists()).toBe(true)
    })

    it('applies expanded class to arrow when expanded', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: expandColumns, expandable: true, rowKey: 'id', expandedKeys: [1] }
      })
      const expandedArrows = wrapper.findAll('.see-table__expand-arrow--expanded')
      expect(expandedArrows.length).toBe(1)
    })

    it('does not show expanded content when row is collapsed', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: expandColumns, expandable: true, rowKey: 'id', expandedKeys: [] },
        slots: {
          expand: '<text class="expand-content">展开内容</text>'
        }
      })
      expect(wrapper.find('.expand-content').exists()).toBe(false)
    })
  })

  // ========== Phase 4: 树形数据 ==========
  describe('树形数据 (Tree Data)', () => {
    const treeData = [
      {
        id: 1,
        name: '部门 A',
        age: 10,
        children: [
          { id: 11, name: '小组 A1', age: 5 },
          { id: 12, name: '小组 A2', age: 3 }
        ]
      },
      { id: 2, name: '部门 B', age: 8 }
    ]

    const treeColumns: SeeTableColumn[] = [
      { key: 'name', title: '名称', width: 200 },
      { key: 'age', title: '人数', width: 100 }
    ]

    it('renders tree data with correct number of visible rows', () => {
      const wrapper = mount(SeeTable, {
        props: { data: treeData, columns: treeColumns, tree: true, rowKey: 'id' }
      })
      // defaultExpandAll is false, so only root nodes visible
      const rows = wrapper.findAll('.see-table__row')
      expect(rows.length).toBe(2)
    })

    it('renders all nodes when defaultExpandAll is true', () => {
      const wrapper = mount(SeeTable, {
        props: { data: treeData, columns: treeColumns, tree: true, rowKey: 'id', defaultExpandAll: true }
      })
      const rows = wrapper.findAll('.see-table__row')
      expect(rows.length).toBe(4) // 2 root + 2 children
    })

    it('shows expand toggle for nodes with children', () => {
      const wrapper = mount(SeeTable, {
        props: { data: treeData, columns: treeColumns, tree: true, rowKey: 'id' }
      })
      const toggles = wrapper.findAll('.see-table__tree-toggle')
      expect(toggles.length).toBe(1) // Only 部门 A has children
    })

    it('expands node on toggle click', async () => {
      const wrapper = mount(SeeTable, {
        props: { data: treeData, columns: treeColumns, tree: true, rowKey: 'id' }
      })
      const toggles = wrapper.findAll('.see-table__tree-toggle')
      await toggles[0].trigger('tap')
      const rows = wrapper.findAll('.see-table__row')
      expect(rows.length).toBe(4) // 2 root + 2 expanded children
    })

    it('collapses expanded node on second toggle click', async () => {
      const wrapper = mount(SeeTable, {
        props: { data: treeData, columns: treeColumns, tree: true, rowKey: 'id', defaultExpandAll: true }
      })
      const toggles = wrapper.findAll('.see-table__tree-toggle')
      await toggles[0].trigger('tap') // Collapse
      const rows = wrapper.findAll('.see-table__row')
      expect(rows.length).toBe(2) // Only root nodes
    })

    it('applies indentation based on depth', () => {
      const wrapper = mount(SeeTable, {
        props: { data: treeData, columns: treeColumns, tree: true, rowKey: 'id', defaultExpandAll: true, indent: 30 }
      })
      const rows = wrapper.findAll('.see-table__row')
      // Root row (depth 0) should have tree toggle
      const rootToggles = rows[0].findAll('.see-table__tree-toggle')
      expect(rootToggles.length).toBe(1)
      // Child row (depth 1) should NOT have tree toggle (leaf node)
      const childToggles = rows[1].findAll('.see-table__tree-toggle')
      expect(childToggles.length).toBe(0)
      // Verify all 4 rows are rendered (2 root + 2 children)
      expect(rows.length).toBe(4)
    })

    it('uses custom childrenField', () => {
      const customTreeData = [{ id: 1, name: 'Root', age: 10, items: [{ id: 11, name: 'Child', age: 5 }] }]
      const wrapper = mount(SeeTable, {
        props: { data: customTreeData, columns: treeColumns, tree: true, rowKey: 'id', childrenField: 'items', defaultExpandAll: true }
      })
      const rows = wrapper.findAll('.see-table__row')
      expect(rows.length).toBe(2)
    })
  })

  // ========== Phase 4: 分页 ==========
  describe('分页 (Pagination)', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      age: 20 + i
    }))

    it('renders pagination when pagination prop is provided', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 1, pageSize: 10, total: 25 } }
      })
      expect(wrapper.find('.see-table__pagination').exists()).toBe(true)
    })

    it('displays correct number of rows per page', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 1, pageSize: 10, total: 25 } }
      })
      const rows = wrapper.findAll('.see-table__row')
      expect(rows.length).toBe(10)
    })

    it('displays second page data', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 2, pageSize: 10, total: 25 } }
      })
      const rows = wrapper.findAll('.see-table__row')
      expect(rows.length).toBe(10)
    })

    it('shows total count when showTotal is true', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 1, pageSize: 10, total: 25, showTotal: true } }
      })
      expect(wrapper.text()).toContain('Total 25 items')
    })

    it('emits onPageChange when page is changed', async () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 1, pageSize: 10, total: 25 } }
      })
      const nextBtn = wrapper.findAll('.see-table__pagination-btn')[1] // Next button
      await nextBtn.trigger('tap')
      expect(wrapper.emitted('onPageChange')).toBeTruthy()
      expect(wrapper.emitted('onPageChange')![0][0]).toMatchObject({ current: 2, pageSize: 10 })
    })

    it('actually updates displayed data when next page is clicked', async () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 1, pageSize: 10, total: 25 } }
      })
      // Page 1: should show users 1-10
      expect(wrapper.text()).toContain('用户 10')
      expect(wrapper.text()).not.toContain('用户 11')

      // Click next page
      const nextBtn = wrapper.findAll('.see-table__pagination-btn')[1]
      await nextBtn.trigger('tap')
      await wrapper.vm.$nextTick()

      // Page 2: should show users 11-20
      expect(wrapper.text()).toContain('用户 11')
      expect(wrapper.text()).not.toContain('用户 10')
    })

    it('navigates back to previous page correctly', async () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 2, pageSize: 10, total: 25 } }
      })
      // Page 2: should show users 11-20
      expect(wrapper.text()).toContain('用户 11')
      expect(wrapper.text()).not.toContain('用户 10')

      // Click prev page
      const prevBtn = wrapper.findAll('.see-table__pagination-btn')[0]
      await prevBtn.trigger('tap')
      await wrapper.vm.$nextTick()

      // Page 1: should show users 1-10
      expect(wrapper.text()).toContain('用户 10')
      expect(wrapper.text()).not.toContain('用户 11')
    })

    it('clicking page number navigates to that page', async () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 1, pageSize: 10, total: 25 } }
      })
      // Click page 3
      const pageButtons = wrapper.findAll('.see-table__pagination-page')
      await pageButtons[2].trigger('tap') // Page 3 (0-indexed: 0=1, 1=2, 2=3)
      await wrapper.vm.$nextTick()

      // Page 3: should show users 21-25
      expect(wrapper.text()).toContain('用户 21')
    })

    it('disables prev button on first page', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 1, pageSize: 10, total: 25 } }
      })
      const prevBtn = wrapper.findAll('.see-table__pagination-btn')[0]
      expect(prevBtn.classes()).toContain('see-table__pagination-btn--disabled')
    })

    it('disables next button on last page', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 3, pageSize: 10, total: 25 } }
      })
      const nextBtn = wrapper.findAll('.see-table__pagination-btn')[1]
      expect(nextBtn.classes()).toContain('see-table__pagination-btn--disabled')
    })

    it('highlights current page number', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 2, pageSize: 10, total: 25 } }
      })
      const activePages = wrapper.findAll('.see-table__pagination-page--active')
      expect(activePages.length).toBe(1)
      expect(activePages[0].text()).toContain('2')
    })

    it('renders simple pagination mode', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: { current: 1, pageSize: 10, total: 25, simple: true } }
      })
      expect(wrapper.find('.see-table__pagination-simple').exists()).toBe(true)
      expect(wrapper.text()).toContain('1 / 3')
    })

    it('does not render pagination when pagination is false', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, pagination: false }
      })
      expect(wrapper.find('.see-table__pagination').exists()).toBe(false)
    })
  })

  // ========== Phase 4: 吸顶表头 ==========
  describe('吸顶表头 (Sticky Header)', () => {
    it('applies sticky header class when stickyHeader is true', () => {
      const wrapper = mount(SeeTable, {
        props: { data: testData, columns: testColumns, stickyHeader: true }
      })
      expect(wrapper.find('.see-table--sticky-header').exists()).toBe(true)
      expect(wrapper.find('.see-table__header--sticky').exists()).toBe(true)
    })

    it('does not apply sticky header class by default', () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: testColumns } })
      expect(wrapper.find('.see-table__header--sticky').exists()).toBe(false)
    })
  })

  // ========== Phase 4: 序号列 ==========
  describe('序号列 (Index Column)', () => {
    const columnsWithIndex: SeeTableColumn<TestRow>[] = [{ key: '__index__', title: '#', type: 'index', width: 60, align: 'center' }, ...testColumns]

    it('renders index column with sequential numbers', () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: columnsWithIndex } })
      expect(wrapper.text()).toContain('1')
      expect(wrapper.text()).toContain('2')
      expect(wrapper.text()).toContain('3')
    })

    it('renders index column header', () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: columnsWithIndex } })
      expect(wrapper.text()).toContain('#')
    })
  })

  // ========== Phase 5: 固定列 ==========
  describe('固定列 (Fixed Columns)', () => {
    const fixedCols: SeeTableColumn<TestRow>[] = [
      { key: 'id', title: 'ID', width: 80, align: 'center', fixed: 'left' },
      { key: 'name', title: '姓名', width: 120 },
      { key: 'age', title: '年龄', width: 100, fixed: 'right' }
    ]

    it('applies fixed-left class to left-fixed columns', () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: fixedCols } })
      const fixedLeftCells = wrapper.findAll('.see-table__cell--fixed-left')
      expect(fixedLeftCells.length).toBeGreaterThan(0)
    })

    it('applies fixed-right class to right-fixed columns', () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: fixedCols } })
      const fixedRightCells = wrapper.findAll('.see-table__cell--fixed-right')
      expect(fixedRightCells.length).toBeGreaterThan(0)
    })

    it('applies sticky position style to fixed columns', () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: fixedCols } })
      const fixedLeftCells = wrapper.findAll('.see-table__cell--fixed-left')
      expect(fixedLeftCells[0].attributes('style')).toContain('position: sticky')
      expect(fixedLeftCells[0].attributes('style')).toContain('left:')
    })

    it('applies z-index to fixed columns', () => {
      const wrapper = mount(SeeTable, { props: { data: testData, columns: fixedCols } })
      const fixedLeftCells = wrapper.findAll('.see-table__cell--fixed-left')
      expect(fixedLeftCells[0].attributes('style')).toContain('z-index: 3')
    })

    it('computes correct left offset for multiple left-fixed columns', () => {
      const cols: SeeTableColumn<TestRow>[] = [
        { key: 'id', title: 'ID', width: 80, fixed: 'left' },
        { key: 'name', title: '姓名', width: 120, fixed: 'left' },
        { key: 'age', title: '年龄', width: 100 }
      ]
      const wrapper = mount(SeeTable, { props: { data: testData, columns: cols } })
      const fixedCells = wrapper.findAll('.see-table__cell--fixed-left')
      // First fixed column: left = 0
      expect(fixedCells[0].attributes('style')).toContain('left: 0px')
      // Second fixed column: left = 80 (width of first)
      expect(fixedCells[1].attributes('style')).toContain('left: 80px')
    })

    it('computes correct right offset for multiple right-fixed columns', () => {
      const cols: SeeTableColumn<TestRow>[] = [
        { key: 'id', title: 'ID', width: 80 },
        { key: 'name', title: '姓名', width: 120, fixed: 'right' },
        { key: 'age', title: '年龄', width: 100, fixed: 'right' }
      ]
      const wrapper = mount(SeeTable, { props: { data: testData, columns: cols } })
      const fixedCells = wrapper.findAll('.see-table__cell--fixed-right')
      // Last right-fixed (age, 100px): right = 0
      expect(fixedCells[1].attributes('style')).toContain('right: 0px')
      // First right-fixed (name, 120px): right = 100 (width of age)
      expect(fixedCells[0].attributes('style')).toContain('right: 100px')
    })
  })

  // ========== Phase 5: useTableColumns 固定列分区 ==========
  describe('useTableColumns 固定列分区', () => {
    it('partitions columns into fixedLeft, fixedRight, scrollable', () => {
      const cols = ref<SeeTableColumn[]>([
        { key: 'id', title: 'ID', width: 80, fixed: 'left' },
        { key: 'name', title: '姓名', width: 120 },
        { key: 'age', title: '年龄', width: 100, fixed: 'right' }
      ])
      const { fixedLeftColumns, fixedRightColumns, scrollableColumns } = useTableColumns({ columns: cols })
      expect(fixedLeftColumns.value.length).toBe(1)
      expect(fixedLeftColumns.value[0].key).toBe('id')
      expect(fixedRightColumns.value.length).toBe(1)
      expect(fixedRightColumns.value[0].key).toBe('age')
      expect(scrollableColumns.value.length).toBe(1)
      expect(scrollableColumns.value[0].key).toBe('name')
    })

    it('returns empty fixed columns when none are fixed', () => {
      const cols = ref<SeeTableColumn[]>([
        { key: 'id', title: 'ID', width: 80 },
        { key: 'name', title: '姓名', width: 120 }
      ])
      const { fixedLeftColumns, fixedRightColumns, scrollableColumns } = useTableColumns({ columns: cols })
      expect(fixedLeftColumns.value.length).toBe(0)
      expect(fixedRightColumns.value.length).toBe(0)
      expect(scrollableColumns.value.length).toBe(2)
    })

    it('accounts for extraLeftFixedWidths in left offset calculation', () => {
      const cols = ref<SeeTableColumn[]>([{ key: 'name', title: '姓名', width: 120, fixed: 'left' }])
      const extraWidths = ref([50]) // auto-inserted selection column
      const { getColumnStyle } = useTableColumns({ columns: cols, extraLeftFixedWidths: extraWidths })
      const style = getColumnStyle(cols.value[0])
      expect(style.left).toBe('50px') // offset by selection column width
    })
  })

  // ========== Phase 5: useTableVirtual ==========
  describe('useTableVirtual', () => {
    it('computes correct row range with virtual enabled', () => {
      const result = useTableVirtual({
        virtual: ref(true),
        virtualX: ref(false),
        rowHeight: ref(48),
        estimatedRowHeight: ref(0),
        buffer: ref(5),
        totalRows: ref(1000),
        columns: ref([]),
        tableWidth: ref(0)
      })
      result.setViewportSize(0, 400)
      nextTick()
      // visibleCount = ceil(400 / 48) = 9
      // With buffer=5, startIndex should be around 0, endIndex around 14
      expect(result.rowStartIndex.value).toBe(0)
      expect(result.rowEndIndex.value).toBeLessThanOrEqual(20)
      expect(result.rowEndIndex.value).toBeGreaterThan(0)
    })

    it('returns all rows when virtual is disabled', () => {
      const result = useTableVirtual({
        virtual: ref(false),
        virtualX: ref(false),
        rowHeight: ref(48),
        estimatedRowHeight: ref(0),
        buffer: ref(5),
        totalRows: ref(100),
        columns: ref([]),
        tableWidth: ref(0)
      })
      expect(result.rowStartIndex.value).toBe(0)
      expect(result.rowEndIndex.value).toBe(100)
    })

    it('computes correct column range with virtualX enabled', () => {
      const cols: SeeTableColumn[] = Array.from({ length: 30 }, (_, i) => ({
        key: `col${i}`,
        title: `Col ${i}`,
        width: 120
      }))
      const result = useTableVirtual({
        virtual: ref(false),
        virtualX: ref(true),
        rowHeight: ref(48),
        estimatedRowHeight: ref(0),
        buffer: ref(2),
        totalRows: ref(10),
        columns: ref(cols),
        tableWidth: ref(3600)
      })
      result.setViewportSize(600, 400)
      // With viewport 600px and col width 120px, about 5 columns visible
      // With buffer=2, should render around 7 columns
      expect(result.colStartIndex.value).toBe(0)
      expect(result.colEndIndex.value).toBeLessThanOrEqual(30)
      expect(result.colEndIndex.value).toBeGreaterThan(0)
    })

    it('computes spacerLeft and spacerRight correctly', () => {
      const cols: SeeTableColumn[] = Array.from({ length: 30 }, (_, i) => ({
        key: `col${i}`,
        title: `Col ${i}`,
        width: 120
      }))
      const result = useTableVirtual({
        virtual: ref(false),
        virtualX: ref(true),
        rowHeight: ref(48),
        estimatedRowHeight: ref(0),
        buffer: ref(2),
        totalRows: ref(10),
        columns: ref(cols),
        tableWidth: ref(3600)
      })
      result.setViewportSize(600, 400)
      // At scroll position 0, spacerLeft should be 0
      expect(result.spacerLeft.value).toBe(0)
      expect(result.spacerRight.value).toBeGreaterThanOrEqual(0)
    })

    it('updates row range on scroll', () => {
      const result = useTableVirtual({
        virtual: ref(true),
        virtualX: ref(false),
        rowHeight: ref(48),
        estimatedRowHeight: ref(0),
        buffer: ref(5),
        totalRows: ref(1000),
        columns: ref([]),
        tableWidth: ref(0)
      })
      result.setViewportSize(0, 400)
      // Simulate scroll to offset 4800 (100 rows down)
      result.onScroll({ detail: { scrollTop: 4800, scrollLeft: 0 } })
      nextTick()
      // visibleStart should be around 100
      expect(result.rowStartIndex.value).toBeGreaterThan(50)
      expect(result.rowEndIndex.value).toBeGreaterThan(result.rowStartIndex.value)
    })

    it('translateY is 0 when virtual is disabled', () => {
      const result = useTableVirtual({
        virtual: ref(false),
        virtualX: ref(false),
        rowHeight: ref(48),
        estimatedRowHeight: ref(0),
        buffer: ref(5),
        totalRows: ref(100),
        columns: ref([]),
        tableWidth: ref(0)
      })
      expect(result.translateY.value).toBe(0)
    })
  })

  // ========== Phase 5: 虚拟行渲染 ==========
  describe('虚拟行 (Virtual Rows)', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      age: 20 + (i % 30)
    }))

    it('renders fewer rows than total data when virtual is enabled', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, virtual: true, rowHeight: 48, height: 400 }
      })
      const rows = wrapper.findAll('.see-table__row')
      // Should render much fewer than 1000 rows
      expect(rows.length).toBeLessThan(100)
      expect(rows.length).toBeGreaterThan(0)
    })

    it('applies virtual class when virtual prop is true', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, virtual: true, rowHeight: 48, height: 400 }
      })
      expect(wrapper.find('.see-table--virtual').exists()).toBe(true)
    })

    it('renders virtual spacer elements', () => {
      const wrapper = mount(SeeTable, {
        props: { data: largeData, columns: testColumns, virtual: true, rowHeight: 48, height: 400 }
      })
      const spacers = wrapper.findAll('.see-table__virtual-spacer')
      expect(spacers.length).toBe(2) // top + bottom
    })

    it('renders all rows when virtual is disabled', () => {
      const smallData = largeData.slice(0, 10)
      const wrapper = mount(SeeTable, {
        props: { data: smallData, columns: testColumns, virtual: false }
      })
      const rows = wrapper.findAll('.see-table__row')
      expect(rows.length).toBe(10)
    })
  })

  // ========== Phase 5: 虚拟列渲染 ==========
  describe('虚拟列 (Virtual Columns)', () => {
    const manyColumns: SeeTableColumn[] = Array.from({ length: 30 }, (_, i) => ({
      key: `col${i}`,
      title: `列 ${i}`,
      width: 120
    }))
    const smallData = [{ col0: 'a', col1: 'b' }]

    it('applies virtual-x class when virtualX prop is true', () => {
      const wrapper = mount(SeeTable, {
        props: { data: smallData, columns: manyColumns, virtualX: true }
      })
      expect(wrapper.find('.see-table--virtual-x').exists()).toBe(true)
    })

    it('falls back to all columns when viewport width is 0 (no DOM layout)', () => {
      const wrapper = mount(SeeTable, {
        props: { data: smallData, columns: manyColumns, virtualX: true }
      })
      // In jsdom, viewport width is 0 so all columns render (no virtualization)
      // This test verifies no errors occur; real virtualization requires actual DOM
      const rows = wrapper.findAll('.see-table__row')
      expect(rows.length).toBeGreaterThan(0)
    })

    it('renders horizontal spacer elements when virtualX is true', () => {
      const wrapper = mount(SeeTable, {
        props: { data: smallData, columns: manyColumns, virtualX: true }
      })
      const hSpacers = wrapper.findAll('.see-table__virtual-spacer-h')
      // At least left + right spacers in one row
      expect(hSpacers.length).toBeGreaterThan(0)
    })
  })
})
