import { ref, onMounted, onUnmounted } from 'vue'
// #ifndef H5
import { onPageScroll } from '@dcloudio/uni-app'
// #endif

/**
 * 滚动监听配置选项
 */
export interface UseScrollSpyOptions {
  /** 滚动容器选择器（H5 专用，传入后监听该元素的 scroll 事件；缺省时监听页面/window） */
  target?: string
  /** 节流间隔（ms），默认使用 rAF。仅在传入 > 0 的值时切换为 setTimeout 节流 */
  throttle?: number
}

/**
 * 滚动监听 Hook 返回值
 */
export interface UseScrollSpyReturn {
  /** 当前滚动距离（px） */
  scrollTop: import('vue').Ref<number>
  /** 是否正在滚动 */
  isScrolling: import('vue').Ref<boolean>
  /** 滚动方向 */
  scrollDirection: import('vue').Ref<'up' | 'down' | 'idle'>
}

/**
 * 滚动位置监听 Hook
 * @description 监听页面或指定容器的滚动位置，支持节流和方向判断。
 *
 * 跨端说明：
 * - H5：监听 window 或指定容器的 scroll 事件，rAF 节流
 * - 小程序 / App：使用 @dcloudio/uni-app 的 onPageScroll 生命周期（页面级 API），
 *   只能在页面组件中使用，否则不会触发
 */
export function useScrollSpy(options: UseScrollSpyOptions = {}): UseScrollSpyReturn {
  const { target = '', throttle = 0 } = options

  const scrollTop = ref(0)
  const isScrolling = ref(false)
  const scrollDirection = ref<'up' | 'down' | 'idle'>('idle')

  let lastScrollTop = 0
  let pendingScrollTop: number | null = null
  let rafId = 0
  let throttleTimer: ReturnType<typeof setTimeout> | null = null
  let scrollingTimer: ReturnType<typeof setTimeout> | null = null
  let disposed = false

  /**
   * 立即应用最新的滚动位置（不被节流影响方向判断）
   */
  const applyScrollTop = (newScrollTop: number) => {
    if (disposed) return
    scrollDirection.value = newScrollTop > lastScrollTop ? 'down' : newScrollTop < lastScrollTop ? 'up' : scrollDirection.value
    lastScrollTop = newScrollTop
    scrollTop.value = newScrollTop

    isScrolling.value = true
    if (scrollingTimer) clearTimeout(scrollingTimer)
    scrollingTimer = setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }

  /**
   * 节流处理：保留最新值，rAF / setTimeout 触发时应用
   */
  const scheduleScroll = (newScrollTop: number) => {
    pendingScrollTop = newScrollTop
    if (throttle > 0) {
      // 自定义节流：使用 setTimeout，leading + trailing
      if (throttleTimer !== null) return
      // leading: 立即应用第一次
      applyScrollTop(newScrollTop)
      pendingScrollTop = null
      throttleTimer = setTimeout(() => {
        throttleTimer = null
        // trailing: 节流期间若有更新的值，在窗口结束时再应用一次
        if (pendingScrollTop !== null) {
          applyScrollTop(pendingScrollTop)
          pendingScrollTop = null
        }
      }, throttle)
    } else {
      // 默认 rAF 节流
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        if (pendingScrollTop !== null) {
          applyScrollTop(pendingScrollTop)
          pendingScrollTop = null
        }
      })
    }
  }

  // #ifdef H5
  let scrollEl: EventTarget | null = null
  const h5ScrollHandler = () => {
    let st = 0
    if (scrollEl && scrollEl !== window) {
      st = (scrollEl as HTMLElement).scrollTop
    } else {
      st = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
    }
    scheduleScroll(st)
  }
  // #endif

  // #ifndef H5
  // 注册页面级滚动生命周期（仅在页面组件中有效）
  // 这里不持有引用、不需要手动注销 —— onPageScroll 在组件 unmount 时由
  // uni-app 自动清理，配合下面的 disposed 标志保证回调不会再操作已销毁的 ref
  onPageScroll((res) => {
    if (disposed) return
    scheduleScroll(res.scrollTop)
  })
  // #endif

  onMounted(() => {
    // #ifdef H5
    if (typeof window === 'undefined') return
    if (target) {
      const el = document.querySelector(target)
      if (el) {
        scrollEl = el
        el.addEventListener('scroll', h5ScrollHandler, { passive: true } as any)
        return
      }
    }
    scrollEl = window
    window.addEventListener('scroll', h5ScrollHandler, { passive: true })
    // #endif
  })

  onUnmounted(() => {
    disposed = true
    // #ifdef H5
    if (typeof window !== 'undefined') {
      if (scrollEl && scrollEl !== window) {
        ;(scrollEl as HTMLElement).removeEventListener('scroll', h5ScrollHandler)
      } else {
        window.removeEventListener('scroll', h5ScrollHandler)
      }
      scrollEl = null
    }
    // #endif
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
    if (throttleTimer !== null) {
      clearTimeout(throttleTimer)
      throttleTimer = null
    }
    if (scrollingTimer) {
      clearTimeout(scrollingTimer)
      scrollingTimer = null
    }
  })

  return {
    scrollTop,
    isScrolling,
    scrollDirection
  }
}
