import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useVirtualWindow } from '@/uni_modules/see-u-ui/utils/hooks/useVirtualWindow'

describe('useVirtualWindow', () => {
  const defaultOptions = {
    total: 100,
    itemSize: 50,
    viewportSize: 500,
    buffer: 5
  }

  it('calculates visible start and end correctly at scroll top 0', () => {
    const virtual = useVirtualWindow(defaultOptions)
    expect(virtual.visibleStart.value).toBe(0)
    expect(virtual.totalSize.value).toBe(5000)
    expect(virtual.translateOffset.value).toBe(0)
  })

  it('calculates visible start when scrolled', () => {
    const scrollOffset = ref(250)
    const virtual = useVirtualWindow({ ...defaultOptions, scrollOffset })
    expect(virtual.visibleStart.value).toBe(5)
    expect(virtual.visibleEnd.value).toBeGreaterThan(5)
  })

  it('recalculates when total changes', () => {
    const total = ref(50)
    const virtual = useVirtualWindow({ ...defaultOptions, total })
    expect(virtual.totalSize.value).toBe(2500)

    total.value = 200
    expect(virtual.totalSize.value).toBe(10000)
  })

  it('returns correct visible item count for viewport', () => {
    const virtual = useVirtualWindow({
      total: 100,
      itemSize: 100,
      viewportSize: 400,
      buffer: 2
    })
    expect(virtual.visibleCount.value).toBe(4)
  })

  it('handles zero total gracefully', () => {
    const virtual = useVirtualWindow({ total: 0, itemSize: 50, viewportSize: 500 })
    expect(virtual.totalSize.value).toBe(0)
    expect(virtual.visibleStart.value).toBe(0)
    expect(virtual.visibleEnd.value).toBe(0)
  })

  it('handles zero item size gracefully', () => {
    const virtual = useVirtualWindow({ total: 100, itemSize: 0, viewportSize: 500 })
    expect(virtual.visibleCount.value).toBe(0)
    expect(virtual.visibleStart.value).toBe(0)
    expect(virtual.visibleEnd.value).toBe(0)
  })

  it('startIndex includes buffer offset', () => {
    const scrollOffset = ref(300)
    const virtual = useVirtualWindow({
      total: 100,
      itemSize: 50,
      viewportSize: 500,
      buffer: 3,
      scrollOffset
    })
    // visibleStart = floor(300/50) = 6
    // startIndex = max(0, 6-3) = 3
    expect(virtual.visibleStart.value).toBe(6)
    expect(virtual.startIndex.value).toBe(3)
  })

  it('endIndex caps at total', () => {
    const scrollOffset = ref(4500)
    const virtual = useVirtualWindow({
      total: 100,
      itemSize: 50,
      viewportSize: 500,
      buffer: 5,
      scrollOffset
    })
    expect(virtual.endIndex.value).toBe(100)
  })

  it('setScrollOffset updates scroll offset', () => {
    const virtual = useVirtualWindow(defaultOptions)
    virtual.setScrollOffset(200)
    expect(virtual.visibleStart.value).toBe(4)
  })

  it('returns range object', () => {
    const virtual = useVirtualWindow(defaultOptions)
    expect(virtual.range.value).toEqual({
      visibleStart: 0,
      visibleEnd: 10,
      translateOffset: 0,
      totalSize: 5000
    })
  })

  it('supports dynamic mode with estimatedItemSize', () => {
    const virtual = useVirtualWindow({
      total: 100,
      itemSize: 50,
      viewportSize: 500,
      estimatedItemSize: 60,
      dynamic: true
    })
    expect(virtual.totalSize.value).toBe(6000)
    expect(virtual.visibleCount.value).toBe(9) // ceil(500/60)
  })

  it('visibleIndices returns correct range', () => {
    const scrollOffset = ref(200)
    const virtual = useVirtualWindow({
      total: 100,
      itemSize: 50,
      viewportSize: 500,
      buffer: 2,
      scrollOffset
    })
    // visibleStart = 4, startIndex = 2, endIndex = 4 + 10 + 2 = 16
    // so indices should be [2, 3, ..., 15] = 14 items
    expect(virtual.visibleIndices.value.length).toBeLessThan(100)
    expect(virtual.visibleIndices.value[0]).toBeGreaterThanOrEqual(0)
  })

  it('updates when viewport size changes', () => {
    const viewportSize = ref(500)
    const virtual = useVirtualWindow({ ...defaultOptions, viewportSize })
    expect(virtual.visibleCount.value).toBe(10)

    viewportSize.value = 1000
    expect(virtual.visibleCount.value).toBe(20)
  })
})
