import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeCountDown from '@/uni_modules/see-u-ui/components/see-count-down/see-count-down.vue'

describe('SeeCountDown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('renders default formatted countdown', () => {
    const wrapper = mount(SeeCountDown, { props: { time: 3661000, autoStart: false } })
    expect(wrapper.text()).toContain('01:01:01')
  })

  it('renders custom slot data', () => {
    const wrapper = mount(SeeCountDown, {
      props: { time: 61000, autoStart: false },
      slots: { default: '<template #default="scope"><text class="slot-count">{{ scope.minutes }}m{{ scope.seconds }}s</text></template>' }
    })
    expect(wrapper.find('.slot-count').text()).toBe('1m1s')
  })

  it('emits start, pause, reset and finish events through exposed methods', () => {
    const wrapper = mount(SeeCountDown, { props: { time: 1000, autoStart: false } })
    const vm = wrapper.vm as unknown as { start: () => void; pause: () => void; reset: (time?: number) => void; finish: () => void }

    vm.start()
    expect(wrapper.emitted('onStart')).toBeTruthy()

    vm.pause()
    expect(wrapper.emitted('onPause')).toBeTruthy()

    vm.reset(2000)
    expect(wrapper.emitted('onReset')).toBeTruthy()

    vm.finish()
    expect(wrapper.emitted('onFinish')).toBeTruthy()
  })

  it('auto starts and finishes', () => {
    const wrapper = mount(SeeCountDown, { props: { time: 1000, autoStart: true } })
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('onFinish')).toBeTruthy()
  })
})
