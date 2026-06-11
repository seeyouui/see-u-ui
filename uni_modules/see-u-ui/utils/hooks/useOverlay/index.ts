import { ref, computed, watch, onUnmounted, type Ref, type CSSProperties } from 'vue'

export interface UseOverlayOptions {
  /** 是否显示遮罩的响应式状态 */
  show: Ref<boolean>
  /** 遮罩层级 */
  zIndex?: Ref<number>
  /** 遮罩背景色，默认 'var(--see-overlay-bg)' */
  background?: string
  /** 遮罩透明度，默认 1 */
  opacity?: Ref<number>
  /** 动画时长(ms)，默认 300 */
  duration?: number
  /** 是否启用动画，默认 true */
  isAnimated?: Ref<boolean>
  /** 遮罩点击回调 */
  onClick?: () => void
}

/**
 * 遮罩层状态管理 Hook
 * @description 管理遮罩层的显示状态、样式和动画
 * @param options 配置选项
 * @returns 返回遮罩层相关的响应式状态和方法
 */
export function useOverlay(options: UseOverlayOptions) {
  const { show, zIndex, background = 'var(--see-overlay-bg)', opacity, duration = 300, isAnimated, onClick } = options

  /** 当前可见状态（动画结束后才变为 false） */
  const visible = ref(show.value)

  /** 遮罩层级 */
  const overlayZIndex = computed(() => {
    return zIndex?.value ?? 1000
  })

  /** 遮罩样式 */
  const overlayStyle = computed<CSSProperties>(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: overlayZIndex.value,
    background: background,
    opacity: opacity?.value ?? 1,
    transition: isAnimated?.value !== false ? `opacity ${duration}ms ease` : 'none'
  }))

  /** 动画进入结束 */
  const onAfterEnter = () => {
    // 动画进入完成
  }

  let leaveTimer: ReturnType<typeof setTimeout> | null = null

  /** 动画离开结束 */
  const onAfterLeave = () => {
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = null
    }
    visible.value = false
  }

  /** 遮罩点击处理 */
  const handleClick = () => {
    onClick?.()
  }

  // 监听 show 变化
  watch(
    show,
    (newVal) => {
      if (newVal) {
        if (leaveTimer) {
          clearTimeout(leaveTimer)
          leaveTimer = null
        }
        visible.value = true
      } else {
        // 延迟设置 visible=false，给动画留出时间
        // 如果消费者调用了 onAfterLeave，会提前清除定时器
        leaveTimer = setTimeout(() => {
          visible.value = false
          leaveTimer = null
        }, duration)
      }
    },
    { immediate: true }
  )

  // 组件销毁时清理定时器
  onUnmounted(() => {
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = null
    }
  })

  return {
    visible,
    overlayZIndex,
    overlayStyle,
    onAfterEnter,
    onAfterLeave,
    handleClick
  }
}
