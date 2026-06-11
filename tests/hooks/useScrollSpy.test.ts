import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useScrollSpy } from '../../uni_modules/see-u-ui/utils/hooks/useScrollSpy'

describe('useScrollSpy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('scrollTop 初始值应为 0', () => {
    const { scrollTop } = useScrollSpy()
    expect(scrollTop.value).toBe(0)
  })

  it('isScrolling 初始值应为 false', () => {
    const { isScrolling } = useScrollSpy()
    expect(isScrolling.value).toBe(false)
  })

  it('scrollDirection 初始值应为 down', () => {
    const { scrollDirection } = useScrollSpy()
    expect(scrollDirection.value).toBe('down')
  })

  it('页面滚动时 scrollTop 应更新', () => {
    const { scrollTop } = useScrollSpy()

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))

    // 推进超过节流间隔（默认 16ms）
    vi.advanceTimersByTime(20)

    expect(scrollTop.value).toBe(100)
  })

  it('向下滚动时 scrollDirection 应为 down', () => {
    const { scrollDirection } = useScrollSpy()

    // 先设置初始位置
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(20)

    // 向下滚动
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(20)

    expect(scrollDirection.value).toBe('down')
  })

  it('向上滚动时 scrollDirection 应为 up', () => {
    const { scrollDirection } = useScrollSpy()

    // 先滚动到 200
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(20)

    // 向上滚动到 100
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(20)

    expect(scrollDirection.value).toBe('up')
  })

  it('滚动时 isScrolling 应切换为 true', () => {
    const { isScrolling } = useScrollSpy()

    Object.defineProperty(window, 'scrollY', { value: 50, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(20)

    expect(isScrolling.value).toBe(true)
  })

  it('停止滚动后 isScrolling 应在 150ms 后恢复为 false', () => {
    const { isScrolling } = useScrollSpy()

    Object.defineProperty(window, 'scrollY', { value: 50, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(20)

    expect(isScrolling.value).toBe(true)

    // 快进 150ms（isScrolling 超时）
    vi.advanceTimersByTime(150)

    expect(isScrolling.value).toBe(false)
  })

  it('短时间多次滚动应被节流（节流间隔内只触发一次）', () => {
    const { scrollTop } = useScrollSpy()

    // 连续触发多次滚动事件（都在节流间隔内）
    Object.defineProperty(window, 'scrollY', { value: 10, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    Object.defineProperty(window, 'scrollY', { value: 20, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    Object.defineProperty(window, 'scrollY', { value: 30, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))

    // 推进超过节流间隔
    vi.advanceTimersByTime(20)

    // 节流期间后续事件被忽略，只有第一次的 scrollTop 生效
    expect(scrollTop.value).toBe(10)
  })

  it('指定 throttle 参数应生效', () => {
    const { scrollTop } = useScrollSpy({ throttle: 50 })

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))

    // 推进 30ms（不到 50ms），不应更新
    vi.advanceTimersByTime(30)
    expect(scrollTop.value).toBe(0)

    // 再推进 30ms（总计 60ms，超过 50ms）
    vi.advanceTimersByTime(30)
    expect(scrollTop.value).toBe(100)
  })
})
