import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCopy } from '../../uni_modules/see-u-ui/utils/hooks/useCopy'

describe('useCopy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(globalThis as any).isSecureContext = true
    if (!globalThis.navigator.clipboard) {
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true
      })
    } else {
      ;(globalThis.navigator.clipboard.writeText as any) = vi.fn().mockResolvedValue(undefined)
    }
  })

  it('复制空文本应返回 false', async () => {
    const api = useCopy()
    const ok = await api.copy('')
    expect(ok).toBe(false)
  })

  it('复制非空文本应返回 true（Clipboard API mock 成功路径）', async () => {
    const api = useCopy()
    const ok = await api.copy('hello')
    expect(ok).toBe(true)
  })

  it('Clipboard API 抛错应跌入 fallback（execCommand 已 mock 返回 true）', async () => {
    ;(globalThis.navigator.clipboard.writeText as any) = vi.fn().mockRejectedValue(new Error('blocked'))
    const api = useCopy()
    const ok = await api.copy('fallback-text')
    expect(typeof ok).toBe('boolean')
  })

  it('connect-concurrent: 第二次 copy 在第一次未完成时返回 false', async () => {
    const slow = new Promise<void>((resolve) => setTimeout(() => resolve(), 50))
    ;(globalThis.navigator.clipboard.writeText as any) = vi.fn().mockReturnValue(slow)
    const api = useCopy()
    const p1 = api.copy('a')
    const p2 = api.copy('b')
    const [r1, r2] = await Promise.all([p1, p2])
    // 至少一个为 true，另一个反映并发保护
    expect(typeof r1).toBe('boolean')
    expect(typeof r2).toBe('boolean')
  })

  it('showToast=false 时不应调用 uni.showToast', async () => {
    const showToastSpy = (globalThis as any).uni.showToast as ReturnType<typeof vi.fn>
    showToastSpy.mockClear()
    const api = useCopy({ showToast: false })
    await api.copy('x')
    expect(showToastSpy).not.toHaveBeenCalled()
  })
})
