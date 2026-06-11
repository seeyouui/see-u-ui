import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseTransitionOptions {
  /** 是否显示的响应式状态 */
  show: Ref<boolean>
  /** 动画时长(ms)，默认 300 */
  duration?: number
  /** 过渡动画名称，默认 'see' */
  name?: string
  /** 进入动画开始回调 */
  onBeforeEnter?: () => void
  /** 进入动画结束回调 */
  onAfterEnter?: () => void
  /** 离开动画开始回调 */
  onBeforeLeave?: () => void
  /** 离开动画结束回调 */
  onAfterLeave?: () => void
}

/** 动画状态 */
export type TransitionState = 'enter' | 'entering' | 'entered' | 'leave' | 'leaving' | 'left'

/**
 * 动画状态管理 Hook
 * @description 管理组件的进入/离开动画状态，返回动画 class 和状态
 * @param options 配置选项
 * @returns 返回动画相关的响应式状态和方法
 */
export function useTransition(options: UseTransitionOptions) {
  const { show, duration = 300, name = 'see' } = options

  /** 是否可见（动画结束后才变为 false） */
  const isVisible = ref(show.value)
  /** 是否正在动画中 */
  const isAnimating = ref(false)
  /** 当前动画状态 - 初始为中性状态，避免初始渲染时污染 */
  const state = ref<TransitionState>('entered')

  let enterTimer: ReturnType<typeof setTimeout> | null = null
  let leaveTimer: ReturnType<typeof setTimeout> | null = null
  let frameTimer: ReturnType<typeof setTimeout> | null = null

  const cleanup = () => {
    if (enterTimer) {
      clearTimeout(enterTimer)
      enterTimer = null
    }
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = null
    }
    if (frameTimer) {
      clearTimeout(frameTimer)
      frameTimer = null
    }
  }

  /**
   * 过渡动画 class
   * @description 根据当前状态返回对应的 CSS class
   */
  const transitionClass = computed(() => {
    switch (state.value) {
      case 'enter':
      case 'entering':
        return `${name}-enter ${name}-enter-active`
      case 'entered':
        return `${name}-enter-to`
      case 'leave':
      case 'leaving':
        return `${name}-leave ${name}-leave-active`
      case 'left':
        return `${name}-leave-to`
      default:
        return ''
    }
  })

  /**
   * 执行进入动画
   */
  const enter = () => {
    cleanup()
    isVisible.value = true
    isAnimating.value = true
    state.value = 'enter'
    options.onBeforeEnter?.()

    // 下一帧切换到 entering 状态（仅当仍在 enter 阶段时）
    frameTimer = setTimeout(() => {
      frameTimer = null
      if (state.value === 'enter') {
        state.value = 'entering'
      }
    }, 16)

    enterTimer = setTimeout(() => {
      state.value = 'entered'
      isAnimating.value = false
      options.onAfterEnter?.()
    }, duration)
  }

  /**
   * 执行离开动画
   */
  const leave = () => {
    cleanup()
    isAnimating.value = true
    state.value = 'leave'
    options.onBeforeLeave?.()

    // 下一帧切换到 leaving 状态（仅当仍在 leave 阶段时）
    frameTimer = setTimeout(() => {
      frameTimer = null
      if (state.value === 'leave') {
        state.value = 'leaving'
      }
    }, 16)

    leaveTimer = setTimeout(() => {
      state.value = 'left'
      isAnimating.value = false
      isVisible.value = false
      options.onAfterLeave?.()
    }, duration)
  }

  // 监听 show 变化触发动画
  watch(
    show,
    (newVal) => {
      if (newVal) {
        enter()
      } else {
        leave()
      }
    },
    { immediate: false }
  )

  // 如果初始为显示状态，触发动画
  onMounted(() => {
    if (show.value) {
      enter()
    }
  })

  // 组件销毁时清理定时器
  onUnmounted(() => {
    cleanup()
  })

  return {
    isVisible,
    isAnimating,
    state,
    transitionClass,
    enter,
    leave,
    cleanup
  }
}
