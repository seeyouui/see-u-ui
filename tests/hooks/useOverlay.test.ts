import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useOverlay } from '../../uni_modules/see-u-ui/utils/hooks/useOverlay'

const mountOverlay = (show: any, opts: any = {}) => {
  const Comp = defineComponent({
    setup() {
      const api = useOverlay({ show, ...opts })
      return () =>
        h('div', {
          class: 'mask',
          style: { display: api.visible.value ? 'block' : 'none' }
        })
    }
  })
  return mount(Comp)
}

describe('useOverlay', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('show=true 时 visible 立即为 true', () => {
    const show = ref(true)
    const wrapper = mountOverlay(show)
    expect((wrapper.element as HTMLElement).style.display).toBe('block')
  })

  it('show 由 true→false，visible 在 duration 后变 false', async () => {
    const show = ref(true)
    const wrapper = mountOverlay(show, { duration: 200 })
    show.value = false
    await Promise.resolve()
    // 立即检查 display 仍为 block
    expect((wrapper.element as HTMLElement).style.display).toBe('block')
    vi.advanceTimersByTime(250)
    await Promise.resolve()
    expect((wrapper.element as HTMLElement).style.display).toBe('none')
  })

  it('挂载时 show=false 不应产生残留 visible=true', () => {
    const show = ref(false)
    const wrapper = mountOverlay(show)
    expect((wrapper.element as HTMLElement).style.display).toBe('none')
  })
})
