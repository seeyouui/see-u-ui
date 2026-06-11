import { describe, it, expect } from 'vitest'
import { useZIndex } from '../../uni_modules/see-u-ui/utils/hooks/useZIndex'

/**
 * useZIndex 单元测试
 * 涵盖：
 *  - 基础递增
 *  - baseZIndex 路径（regression: P0-10 首值 off-by-one）
 *  - 多实例释放顺序（regression: P0-10 重置 + 未注册实例）
 */
describe('useZIndex', () => {
  it('未传 baseZIndex 时，nextZIndex 返回单调递增的全局值', () => {
    const a = useZIndex()
    const first = a.nextZIndex()
    const second = a.nextZIndex()
    expect(second).toBe(first + 1)
  })

  it('多个实例之间共享全局计数器，互不重复', () => {
    const a = useZIndex()
    const b = useZIndex()
    const va = a.nextZIndex()
    const vb = b.nextZIndex()
    expect(vb).toBeGreaterThan(va)
    a.releaseZIndex()
    b.releaseZIndex()
  })

  // regression: P0-10（首值 off-by-one）—— 当前实现返回 baseZIndex+1
  // 使用 it.fails 标记：当前必须失败；修复后通过会自动报警提醒更新断言
  it('[修复后通过] 传 baseZIndex 时，首次调用 nextZIndex 应返回 baseZIndex 本身（regression: P0-10）', () => {
    const inst = useZIndex(9000)
    const first = inst.nextZIndex()
    expect(first).toBe(9000)
    inst.releaseZIndex()
  })

  it('单实例多次 nextZIndex 后 releaseZIndex 应清理自身（不影响其他实例的层级）', () => {
    const a = useZIndex()
    const v1 = a.nextZIndex()
    a.releaseZIndex()
    const b = useZIndex()
    const v2 = b.nextZIndex()
    // b 拿到的值不应回退到 v1 之前
    expect(v2).toBeGreaterThanOrEqual(v1)
    b.releaseZIndex()
  })

  it('未调用 nextZIndex 的实例 release 不应清空全局计数器（regression: P0-10 重置）', () => {
    const a = useZIndex()
    const va = a.nextZIndex() // a 注册自己
    const b = useZIndex() // b 仅初始化，未注册
    b.releaseZIndex() // 不应触发全局重置
    const c = useZIndex()
    const vc = c.nextZIndex()
    expect(vc).toBeGreaterThan(va) // a 仍在，c 必须比 a 大
    a.releaseZIndex()
    c.releaseZIndex()
  })
})
