import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useTablePagination } from '@/uni_modules/see-u-ui/components/see-table/hooks/useTablePagination'

interface TestRow {
  id: number
  name: string
}

describe('useTablePagination', () => {
  it('client-side pagination slices data correctly', () => {
    const data = ref<TestRow[]>([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
      { id: 5, name: 'E' }
    ])
    const pagination = ref({ current: 1, pageSize: 2, total: 5 })
    const onPageChange = () => {}

    const { pagedData, currentPage } = useTablePagination({ data, pagination: pagination as any, onPageChange })
    expect(pagedData.value.length).toBe(2)
    expect(pagedData.value[0].id).toBe(1)

    currentPage.value = 2
    expect(pagedData.value.length).toBe(2)
    expect(pagedData.value[0].id).toBe(3)
  })

  it('server-side pagination does not double-slice when total !== data.length', () => {
    // Simulates server-side: data is already the current page, total is the full dataset size
    const data = ref<TestRow[]>([
      { id: 11, name: 'K' },
      { id: 12, name: 'L' },
      { id: 13, name: 'M' }
    ])
    const pagination = ref({ current: 2, pageSize: 10, total: 100 })
    const onPageChange = () => {}

    const { pagedData } = useTablePagination({ data, pagination: pagination as any, onPageChange })
    // Should return all 3 items (no slicing), because total(100) !== data.length(3)
    expect(pagedData.value.length).toBe(3)
    expect(pagedData.value[0].id).toBe(11)
    expect(pagedData.value[2].id).toBe(13)
  })

  it('server-side pagination with data matching pageSize still returns full data', () => {
    const data = ref<TestRow[]>(Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `R${i}` })))
    const pagination = ref({ current: 3, pageSize: 10, total: 100 })
    const onPageChange = () => {}

    const { pagedData } = useTablePagination({ data, pagination: pagination as any, onPageChange })
    // total(100) !== data.length(10), so no slice
    expect(pagedData.value.length).toBe(10)
    expect(pagedData.value[0].id).toBe(1)
  })

  it('returns full data when pagination is false', () => {
    const data = ref<TestRow[]>([{ id: 1, name: 'A' }])
    const pagination = ref(false) as any
    const onPageChange = () => {}

    const { pagedData, showPagination } = useTablePagination({ data, pagination, onPageChange })
    expect(showPagination.value).toBe(false)
    expect(pagedData.value.length).toBe(1)
  })
})
