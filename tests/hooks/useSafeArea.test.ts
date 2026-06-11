import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSafeArea } from '../../uni_modules/see-u-ui/utils/hooks/useSafeArea'

describe('useSafeArea', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('top 应返回安全区顶部距离', () => {
    const area = useSafeArea()
    expect(area.top.value).toBe(20) // setup.ts 中 mock 的 safeAreaInsets.top
  })

  it('bottom 应返回安全区底部距离', () => {
    const area = useSafeArea()
    expect(area.bottom.value).toBe(20) // setup.ts 中 mock 的 safeAreaInsets.bottom
  })

  it('left 和 right 应返回安全区水平距离', () => {
    const area = useSafeArea()
    expect(area.left.value).toBe(0)
    expect(area.right.value).toBe(0)
  })

  it('结果应被缓存（多次调用返回同一实例）', () => {
    const area1 = useSafeArea()
    const area2 = useSafeArea()
    expect(area1).toBe(area2)
  })

  it('返回值应为响应式 Ref', () => {
    const area = useSafeArea()
    expect(area.top).toHaveProperty('value')
    expect(area.bottom).toHaveProperty('value')
    expect(area.left).toHaveProperty('value')
    expect(area.right).toHaveProperty('value')
  })
})
