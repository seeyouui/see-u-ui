import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useGesture } from '../../uni_modules/see-u-ui/utils/hooks/useGesture'

/**
 * useGesture 测试（H5 路径）
 * 涵盖：bindEvents、清理、长按 + 滑动不应同时触发
 */
describe('useGesture (H5)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('elementRef 为 null 时调用 bindEvents 不应抛错', () => {
    const elRef = ref<HTMLElement | null>(null)
    const api = useGesture(elRef, { onTap: vi.fn() })
    expect(() => api.bindEvents()).not.toThrow()
  })

  it('挂载后 bindEvents 绑定 touch 监听', async () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const elRef = ref<HTMLElement | null>(el)
    const spy = vi.spyOn(el, 'addEventListener')
    const api = useGesture(elRef, {})
    api.bindEvents()
    expect(spy).toHaveBeenCalled()
    api.unbindEvents()
    document.body.removeChild(el)
  })

  it('unbindEvents 应移除已绑定监听', () => {
    const el = document.createElement('div')
    const elRef = ref<HTMLElement | null>(el)
    const removeSpy = vi.spyOn(el, 'removeEventListener')
    const api = useGesture(elRef, {})
    api.bindEvents()
    api.unbindEvents()
    expect(removeSpy).toHaveBeenCalled()
  })

  it('长按计时未到时若手指释放，不应触发 onLongPress（regression: 长按取消）', () => {
    const onLongPress = vi.fn()
    const el = document.createElement('div')
    const elRef = ref<HTMLElement | null>(el)
    const api = useGesture(elRef, { onLongPress, longPressThreshold: 300 })
    api.bindEvents()
    // 手工构造一个带 touches 的 TouchEvent 替身（jsdom TouchEvent.touches 为空数组）
    const tStart: any = new Event('touchstart', { bubbles: true })
    tStart.touches = [{ clientX: 0, clientY: 0 }]
    el.dispatchEvent(tStart)
    vi.advanceTimersByTime(100)
    const tEnd: any = new Event('touchend', { bubbles: true })
    tEnd.touches = []
    tEnd.changedTouches = [{ clientX: 0, clientY: 0 }]
    el.dispatchEvent(tEnd)
    vi.advanceTimersByTime(500)
    expect(onLongPress).not.toHaveBeenCalled()
  })
})
