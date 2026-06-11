import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useTransition } from '../../uni_modules/see-u-ui/utils/hooks/useTransition'

/**
 * useTransition 测试
 * 包括 P1-14 回归：初始状态 / immediate / 终态 leave-to 类不应污染初次渲染
 */

const mountTransition = (show: any, opts: any = {}) => {
  const Comp = defineComponent({
    setup() {
      const api = useTransition({ show, ...opts })
      return () => h('div', { class: ['box', api.transitionClass.value], 'data-state': api.state.value })
    }
  })
  return mount(Comp)
}

describe('useTransition', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('show=true 进入后 state 经过 enter/entering/entered 转移', async () => {
    const show = ref(true)
    const wrapper = mountTransition(show, { duration: 100 })
    // onMounted 触发 enter()，验证进入动画完成
    vi.advanceTimersByTime(200)
    await Promise.resolve()
    expect(wrapper.element.getAttribute('data-state')).toBe('entered')
    // 再验证 leave 链路也能正常完成
    show.value = false
    await Promise.resolve()
    vi.advanceTimersByTime(200)
    await Promise.resolve()
    expect(wrapper.element.getAttribute('data-state')).toBe('left')
  })

  it('[修复后通过] show=false 初次渲染时不应应用 leave-to 类（regression: P1-14）', () => {
    const show = ref(false)
    const wrapper = mountTransition(show, { name: 'fade' })
    const cls = wrapper.element.className
    expect(cls).not.toContain('fade-leave-to')
  })

  it('[修复后通过] show=true 初始化时应触发 enter()/onAfterEnter 回调（regression: P1-14 immediate）', async () => {
    const onAfterEnter = vi.fn()
    const show = ref(true)
    mountTransition(show, { duration: 50, onAfterEnter })
    vi.advanceTimersByTime(200)
    await Promise.resolve()
    expect(onAfterEnter).toHaveBeenCalled()
  })

  it('[修复后通过] duration=0 进入完成后不应再退回到 entering 状态（regression: P0 useTransition timer race）', async () => {
    const show = ref(false)
    const wrapper = mountTransition(show, { duration: 0 })
    show.value = true
    await Promise.resolve()
    vi.advanceTimersByTime(100)
    await Promise.resolve()
    const state = wrapper.element.getAttribute('data-state')
    // duration=0 时 enter timer 立即触发，应到达 'entered' 而非卡在 'entering'
    expect(state).toBe('entered')
  })
})
