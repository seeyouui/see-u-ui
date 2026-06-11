import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRoute } from '../../uni_modules/see-u-ui/utils/hooks/useRoute'

describe('useRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 确保 uni API 存在（setup.ts 已 mock navigateTo/redirectTo，补充其余）
    if (!(uni as any).switchTab) {
      ;(uni as any).switchTab = vi.fn().mockImplementation((opts: any) => {
        opts?.success?.()
        opts?.complete?.()
        return Promise.resolve({ errMsg: 'switchTab:ok' })
      })
    }
    if (!(uni as any).reLaunch) {
      ;(uni as any).reLaunch = vi.fn().mockImplementation((opts: any) => {
        opts?.success?.()
        opts?.complete?.()
        return Promise.resolve({ errMsg: 'reLaunch:ok' })
      })
    }
    if (!(uni as any).navigateBack) {
      ;(uni as any).navigateBack = vi.fn().mockImplementation((opts: any) => {
        opts?.success?.()
        opts?.complete?.()
        return Promise.resolve({ errMsg: 'navigateBack:ok' })
      })
    }
  })

  it('navigateTo 应调用 uni.navigateTo', async () => {
    const route = useRoute()
    await route.navigateTo({ url: '/pages/detail/index' })
    expect(uni.navigateTo).toHaveBeenCalled()
  })

  it('navigateTo 应将 params 编码到 url 中', async () => {
    const route = useRoute()
    const params = { id: '123', name: 'test' }
    await route.navigateTo({ url: '/pages/detail/index', params })
    const callArgs = (uni.navigateTo as any).mock.calls[0][0]
    expect(callArgs.url).toContain('/pages/detail/index?params=')
    const encoded = callArgs.url.split('params=')[1]
    expect(JSON.parse(decodeURIComponent(encoded))).toEqual(params)
  })

  it('redirectTo 应调用 uni.redirectTo', async () => {
    const route = useRoute()
    await route.redirectTo({ url: '/pages/home/index' })
    expect(uni.redirectTo).toHaveBeenCalled()
  })

  it('redirectTo 应将 params 编码到 url 中', async () => {
    const route = useRoute()
    await route.redirectTo({ url: '/pages/home/index', params: { tab: '2' } })
    const callArgs = (uni.redirectTo as any).mock.calls[0][0]
    expect(callArgs.url).toContain('params=')
  })

  it('switchTab 应调用 uni.switchTab', async () => {
    const route = useRoute()
    await route.switchTab({ url: '/pages/index/index' })
    expect((uni as any).switchTab).toHaveBeenCalled()
  })

  it('switchTab 不应附加 params（tab 页不支持参数）', async () => {
    const route = useRoute()
    await route.switchTab({ url: '/pages/index/index', params: { a: '1' } })
    const callArgs = (uni as any).switchTab.mock.calls[0][0]
    expect(callArgs.url).toBe('/pages/index/index')
  })

  it('reLaunch 应调用 uni.reLaunch', async () => {
    const route = useRoute()
    await route.reLaunch({ url: '/pages/index/index' })
    expect((uni as any).reLaunch).toHaveBeenCalled()
  })

  it('navigateBack 应调用 uni.navigateBack，默认 delta=1', async () => {
    const route = useRoute()
    await route.navigateBack()
    expect((uni as any).navigateBack).toHaveBeenCalledWith(expect.objectContaining({ delta: 1 }))
  })

  it('navigateBack 应支持自定义 delta', async () => {
    const route = useRoute()
    await route.navigateBack(3)
    expect((uni as any).navigateBack).toHaveBeenCalledWith(expect.objectContaining({ delta: 3 }))
  })

  it('params 无值时 url 不应附加查询字符串', async () => {
    const route = useRoute()
    await route.navigateTo({ url: '/pages/detail/index' })
    const callArgs = (uni.navigateTo as any).mock.calls[0][0]
    expect(callArgs.url).toBe('/pages/detail/index')
  })

  it('url 已有查询参数时应使用 & 拼接', async () => {
    const route = useRoute()
    await route.navigateTo({ url: '/pages/detail/index?type=1', params: { id: '5' } })
    const callArgs = (uni.navigateTo as any).mock.calls[0][0]
    expect(callArgs.url).toContain('/pages/detail/index?type=1&params=')
  })

  it('navigateTo 成功后 currentRoute 应更新', async () => {
    const route = useRoute()
    await route.navigateTo({ url: '/pages/detail/index', params: { id: '1' } })
    expect(route.currentRoute.value.path).toBe('/pages/detail/index')
    expect(route.currentRoute.value.params).toEqual({ id: '1' })
  })

  it('navigateTo 失败时应 reject', async () => {
    const error = new Error('navigate failed')
    ;(uni.navigateTo as any).mockImplementationOnce((opts: any) => {
      opts?.fail?.(error)
      return Promise.reject(error)
    })
    const route = useRoute()
    await expect(route.navigateTo({ url: '/fail' })).rejects.toThrow('navigate failed')
  })
})
