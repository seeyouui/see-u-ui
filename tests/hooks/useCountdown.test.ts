import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCountdown, parseCountdownTime, formatCountdown } from '@/uni_modules/see-u-ui/utils/hooks/useCountdown'

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('parses time into days, hours, minutes, seconds and milliseconds', () => {
    const data = parseCountdownTime(90061007)
    expect(data.days).toBe(1)
    expect(data.hours).toBe(1)
    expect(data.minutes).toBe(1)
    expect(data.seconds).toBe(1)
    expect(data.milliseconds).toBe(7)
    expect(data.total).toBe(90061007)
  })

  it('formats countdown tokens', () => {
    const data = parseCountdownTime(90061007)
    expect(formatCountdown(data, 'DD 天 HH:mm:ss.SSS')).toBe('01 天 01:01:01.007')
  })

  it('starts, ticks, pauses and resets', () => {
    const onChange = vi.fn()
    const countdown = useCountdown({ time: 3000, interval: 1000, onChange })

    countdown.start()
    vi.advanceTimersByTime(1000)
    expect(countdown.current.value.total).toBe(2000)

    countdown.pause()
    vi.advanceTimersByTime(1000)
    expect(countdown.current.value.total).toBe(2000)

    countdown.reset(5000)
    expect(countdown.current.value.total).toBe(5000)
    expect(onChange).toHaveBeenCalled()
  })

  it('finishes at zero and calls onFinish once', () => {
    const onFinish = vi.fn()
    const countdown = useCountdown({ time: 1000, interval: 1000, onFinish })

    countdown.start()
    vi.advanceTimersByTime(1000)
    vi.advanceTimersByTime(1000)

    expect(countdown.current.value.total).toBe(0)
    expect(countdown.isRunning.value).toBe(false)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('supports endTime and serverTime', () => {
    const countdown = useCountdown({ time: 0, endTime: 5000, serverTime: 1000, interval: 1000 })
    expect(countdown.current.value.total).toBe(4000)
  })

  it('uses wall-clock time so background throttling does not slow countdown', () => {
    // Simulates: interval=16ms, but timer fires late (e.g. 5000ms gap as in background tab)
    const onFinish = vi.fn()
    const countdown = useCountdown({ time: 10000, interval: 16, onFinish })

    countdown.start()
    // Advance by 5000ms — with wall-clock, remaining should drop by ~5000
    vi.advanceTimersByTime(5000)
    expect(countdown.current.value.total).toBeLessThanOrEqual(5100)
    expect(countdown.current.value.total).toBeGreaterThanOrEqual(4900)

    // Advance another 5000ms — should finish
    vi.advanceTimersByTime(5000)
    expect(countdown.current.value.total).toBe(0)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('tick uses elapsed time from lastTickTime for accuracy', () => {
    // This test verifies the wall-clock mechanism exists.
    // The first test ("wall-clock time") already covers the main scenario.
    // Here we verify that after a full interval, remaining decreases correctly.
    const countdown = useCountdown({ time: 5000, interval: 1000 })

    countdown.start()
    vi.advanceTimersByTime(1000)
    expect(countdown.current.value.total).toBe(4000)

    vi.advanceTimersByTime(1000)
    expect(countdown.current.value.total).toBe(3000)

    // After pause and resume, timing should still be accurate
    countdown.pause()
    vi.advanceTimersByTime(1000)
    expect(countdown.current.value.total).toBe(3000) // paused, no change

    countdown.start()
    vi.advanceTimersByTime(1000)
    expect(countdown.current.value.total).toBe(2000)
  })
})
