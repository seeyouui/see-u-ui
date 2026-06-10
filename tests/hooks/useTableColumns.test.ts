import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useTableColumns } from '@/uni_modules/see-u-ui/components/see-table/hooks/useTableColumns'
import type { SeeTableColumn } from '@/uni_modules/see-u-ui/components/see-table/type'

interface TestRow {
  id: number
  name: string
  age: number
}

const flatColumns: SeeTableColumn<TestRow>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 100, align: 'right' }
]

describe('useTableColumns', () => {
  it('returns dataColumns for flat columns', () => {
    const columns = ref(flatColumns)
    const { dataColumns } = useTableColumns({ columns })
    expect(dataColumns.value.length).toBe(3)
    expect(dataColumns.value[0].key).toBe('id')
    expect(dataColumns.value[1].key).toBe('name')
    expect(dataColumns.value[2].key).toBe('age')
  })

  it('returns maxDepth 1 for flat columns', () => {
    const columns = ref(flatColumns)
    const { maxDepth } = useTableColumns({ columns })
    expect(maxDepth.value).toBe(1)
  })

  it('returns headerRows with single row for flat columns', () => {
    const columns = ref(flatColumns)
    const { headerRows } = useTableColumns({ columns })
    expect(headerRows.value.length).toBe(1)
    expect(headerRows.value[0].length).toBe(3)
  })

  it('handles grouped columns (nested children)', () => {
    const groupedColumns: SeeTableColumn<TestRow>[] = [
      {
        key: 'info',
        title: '基本信息',
        children: [
          { key: 'name', title: '姓名', width: 120 },
          { key: 'age', title: '年龄', width: 100 }
        ]
      },
      { key: 'id', title: 'ID', width: 80 }
    ]
    const columns = ref(groupedColumns)
    const { dataColumns, maxDepth, headerRows } = useTableColumns({ columns })

    // dataColumns should be leaf columns only
    expect(dataColumns.value.length).toBe(3)
    expect(dataColumns.value[0].key).toBe('name')
    expect(dataColumns.value[1].key).toBe('age')
    expect(dataColumns.value[2].key).toBe('id')

    // maxDepth should be 2
    expect(maxDepth.value).toBe(2)

    // headerRows should have 2 rows
    expect(headerRows.value.length).toBe(2)
    expect(headerRows.value[0][0].key).toBe('info') // first row: parent
    expect(headerRows.value[1].length).toBe(3) // second row: children + id
  })

  it('getColumnStyle returns width and align', () => {
    const columns = ref(flatColumns)
    const { getColumnStyle } = useTableColumns({ columns })

    const idStyle = getColumnStyle(flatColumns[0])
    expect(idStyle.width).toBe('80px')
    expect(idStyle.textAlign).toBe('center')

    const nameStyle = getColumnStyle(flatColumns[1])
    expect(nameStyle.width).toBe('120px')
    expect(nameStyle.textAlign).toBeUndefined() // no align set
  })

  it('getColumnStyle handles string width', () => {
    const columns = ref<SeeTableColumn<TestRow>[]>([{ key: 'test', title: 'Test', width: '200rpx' }])
    const { getColumnStyle } = useTableColumns({ columns })
    const style = getColumnStyle(columns.value[0])
    expect(style.width).toBe('200rpx')
  })

  it('getColumnStyle handles minWidth', () => {
    const columns = ref<SeeTableColumn<TestRow>[]>([{ key: 'test', title: 'Test', minWidth: 100 }])
    const { getColumnStyle } = useTableColumns({ columns })
    const style = getColumnStyle(columns.value[0])
    expect(style.minWidth).toBe('100px')
  })

  it('getColumnClass returns ellipsis class', () => {
    const columns = ref<SeeTableColumn<TestRow>[]>([{ key: 'test', title: 'Test', ellipsis: true, align: 'center' }])
    const { getColumnClass } = useTableColumns({ columns })
    const cls = getColumnClass(columns.value[0])
    expect(cls['see-table__cell--ellipsis']).toBe(true)
    expect(cls['see-table__cell--center']).toBe(true)
  })

  it('handles empty columns', () => {
    const columns = ref<SeeTableColumn<TestRow>[]>([])
    const { dataColumns, maxDepth, headerRows } = useTableColumns({ columns })
    expect(dataColumns.value.length).toBe(0)
    expect(maxDepth.value).toBe(1)
    expect(headerRows.value.length).toBe(1)
  })
})
