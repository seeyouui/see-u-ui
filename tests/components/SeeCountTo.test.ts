import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import SeeCountTo from '@/uni_modules/see-u-ui/components/see-count-to/see-count-to.vue'

describe('SeeCountTo', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('renders formatted initial value', () => {
    const wrapper = mount(SeeCountTo, {
      props: { startVal: 1234, endVal: 5678, autoplay: false, separator: ',', prefix: '$', suffix: ' USD' }
    })
    expect(wrapper.text()).toContain('$1,234 USD')
  })

  it('renders prefix and suffix slots', () => {
    const wrapper = mount(SeeCountTo, {
      props: { startVal: 12, endVal: 12, autoplay: false },
      slots: { prefix: '<text class="prefix">P</text>', suffix: '<text class="suffix">S</text>' }
    })
    expect(wrapper.find('.prefix').exists()).toBe(true)
    expect(wrapper.find('.suffix').exists()).toBe(true)
  })

  it('exposes controls and emits events', async () => {
    const wrapper = mount(SeeCountTo, { props: { startVal: 0, endVal: 100, duration: 32, autoplay: false } })
    const vm = wrapper.vm as unknown as {
      start: () => void
      pause: () => void
      resume: () => void
      reset: () => void
      update: (value: number) => void
    }

    vm.start()
    expect(wrapper.emitted('onStart')).toBeTruthy()
    vi.advanceTimersByTime(64)
    await nextTick()
    expect(wrapper.emitted('onFinish')).toBeTruthy()

    vm.update(200)
    vi.advanceTimersByTime(64)
    await nextTick()
    expect(wrapper.text()).toContain('200')

    vm.pause()
    vm.resume()
    vm.reset()
    expect(wrapper.emitted('onReset')).toBeTruthy()
  })
})
