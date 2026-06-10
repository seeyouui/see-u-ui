import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { easeOutExpo, formatCountToValue, useCountTo } from '@/uni_modules/see-u-ui/utils/hooks/useCountTo'

describe('useCountTo', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('formats decimals, separator, prefix and suffix', () => {
    expect(formatCountToValue(12345.678, { decimals: 2, decimal: '.', separator: ',', prefix: '¥', suffix: ' 元' })).toBe('¥12,345.68 元')
  })

  it('keeps trailing zeros when decimals are configured', () => {
    expect(formatCountToValue(12.3, { decimals: 2, decimal: '.', separator: ',' })).toBe('12.30')
  })

  it('easeOutExpo returns start and end boundaries', () => {
    expect(easeOutExpo(0, 10, 90, 1000)).toBe(10)
    expect(easeOutExpo(1000, 10, 90, 1000)).toBe(100)
  })

  it('starts and finishes animation', () => {
    const onFinish = vi.fn()
    const counter = useCountTo({ startVal: 0, endVal: 100, duration: 32, onFinish })
    counter.start()
    vi.advanceTimersByTime(64)
    expect(counter.displayValue.value).toBe('100')
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('pauses, resumes, resets and updates target', () => {
    const counter = useCountTo({ startVal: 0, endVal: 100, duration: 100 })
    counter.start()
    vi.advanceTimersByTime(16)
    counter.pause()
    const paused = counter.currentValue.value
    vi.advanceTimersByTime(48)
    expect(counter.currentValue.value).toBe(paused)

    counter.resume()
    vi.advanceTimersByTime(160)
    expect(counter.currentValue.value).toBe(100)

    counter.update(200)
    vi.advanceTimersByTime(160)
    expect(counter.currentValue.value).toBe(200)

    counter.reset()
    expect(counter.currentValue.value).toBe(0)
  })

  it('resume works for decrement animation (startVal > endVal)', () => {
    const counter = useCountTo({ startVal: 100, endVal: 0, duration: 100 })
    counter.start()
    vi.advanceTimersByTime(32)
    counter.pause()
    const paused = counter.currentValue.value
    // Should be somewhere between 0 and 100
    expect(paused).toBeGreaterThan(0)
    expect(paused).toBeLessThan(100)

    // Resume should continue decrementing toward 0
    counter.resume()
    vi.advanceTimersByTime(160)
    expect(counter.currentValue.value).toBe(0)
  })

  it('formatCountToValue does not collide prefix/suffix with digits', () => {
    // prefix='12' should not strip digits from the number
    const result = formatCountToValue(12345.67, { decimals: 2, prefix: '12', suffix: '' })
    expect(result).toBe('1212,345.67')

    // suffix='1' should not strip the leading 1
    const result2 = formatCountToValue(101, { decimals: 0, prefix: '', suffix: '1' })
    expect(result2).toBe('1011')
  })
})
