import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeCountDown from '@/uni_modules/see-u-ui/components/see-count-down/see-count-down.vue'
import SeeCountTo from '@/uni_modules/see-u-ui/components/see-count-to/see-count-to.vue'

describe('SeeCountDown regressions', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  // Issue 12: time prop change should reset countdown
  it('changing time prop resets the countdown', async () => {
    const wrapper = mount(SeeCountDown, {
      props: {
        time: 10000,
        autoStart: true,
        millisecond: false,
        interval: 1000
      }
    })

    vi.advanceTimersByTime(2000)

    // Change time to 5000
    await wrapper.setProps({ time: 5000 })
    await wrapper.vm.$nextTick()

    // The countdown should have reset — text should reflect new time
    const after = wrapper.text()
    // After reset to 5000, should show ~00:05
    expect(after).toContain('05')
    wrapper.unmount()
  })

  // Issue 12: endTime prop change should reset countdown
  it('changing endTime prop resets the countdown', async () => {
    const now = Date.now()
    vi.setSystemTime(now)

    const wrapper = mount(SeeCountDown, {
      props: {
        time: 0,
        endTime: now + 30000,
        autoStart: true,
        interval: 1000
      }
    })

    vi.advanceTimersByTime(2000)
    const beforeText = wrapper.text()

    // Change endTime to a much larger value to clearly see the reset
    await wrapper.setProps({ endTime: now + 60000 })

    // The countdown should have reset — remaining should be much larger now
    const afterText = wrapper.text()
    // After reset, the seconds should be different from before
    // (before was ~28s, after should be ~58s)
    expect(afterText).not.toBe(beforeText)
    wrapper.unmount()
  })
})

describe('SeeCountTo regressions', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  // Issue 14b: prefix/suffix display should use props directly
  it('prefix and suffix are displayed from props, not from hook displayValue', () => {
    const wrapper = mount(SeeCountTo, {
      props: {
        startVal: 0,
        endVal: 100,
        duration: 100,
        autoplay: true,
        prefix: '¥',
        suffix: '%',
        decimals: 0
      }
    })

    vi.advanceTimersByTime(200)

    // Check that prefix and suffix slots render correctly
    expect(wrapper.text()).toContain('¥')
    expect(wrapper.text()).toContain('%')
    wrapper.unmount()
  })

  // Issue 14b: prefix and suffix are rendered in separate slots from the number
  it('prefix and suffix are rendered in dedicated slots', () => {
    const wrapper = mount(SeeCountTo, {
      props: {
        startVal: 0,
        endVal: 50,
        duration: 100,
        autoplay: true,
        prefix: '¥',
        suffix: '%',
        decimals: 0
      }
    })

    // Even before animation completes, prefix and suffix slots should render
    const text = wrapper.text()
    // The text should contain the prefix and suffix from their named slots
    expect(text).toContain('¥')
    expect(text).toContain('%')
    // The full text format should be: prefix + number + suffix
    expect(text).toMatch(/¥.*%/)
    wrapper.unmount()
  })

  // Issue 12: changing decimals prop updates display
  it('changing decimals prop updates the displayed format', async () => {
    const wrapper = mount(SeeCountTo, {
      props: {
        startVal: 0,
        endVal: 100,
        duration: 100,
        autoplay: true,
        decimals: 0
      }
    })

    vi.advanceTimersByTime(200)

    // Change decimals to 2
    await wrapper.setProps({ decimals: 2 })
    await wrapper.vm.$nextTick()

    // displayText should now show decimals
    const text = wrapper.text()
    expect(text).toMatch(/\d+\.\d{2}/)
    wrapper.unmount()
  })
})
