import { ref, watch, onUnmounted, type Ref } from 'vue'

export interface UsePopupOptions {
  /** 是否显示的响应式状态 */
  show: Ref<boolean>
  /** 关闭前钩子，返回 false 可阻止关闭 */
  beforeClose?: Ref<(() => boolean | Promise<boolean>) | null>
  /** 动画时长(ms)，默认 300 */
  duration?: number
  /** 打开回调 */
  onOpen?: () => void
  /** 打开动画结束回调 */
  onOpened?: () => void
  /** 关闭回调 */
  onClose?: () => void
  /** 关闭动画结束回调 */
  onClosed?: () => void
  /** 更新 show 值的回调 */
  onUpdateShow?: (value: boolean) => void
}

/**
 * 弹出层生命周期管理 Hook
 * @description 管理弹出层的打开/关闭生命周期，支持 beforeClose 异步钩子
 * @param options 配置选项
 * @returns 返回弹出层相关的响应式状态和方法
 */
export function usePopup(options: UsePopupOptions) {
  const { show, beforeClose, duration = 300, onOpen, onOpened, onClose, onClosed, onUpdateShow } = options

  /** 是否正在显示中 */
  const isVisible = ref(show.value)
  /** 是否正在动画中 */
  const isAnimating = ref(false)

  let closeTimer: ReturnType<typeof setTimeout> | null = null

  const cleanup = () => {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  /**
   * 打开弹出层
   */
  const open = async (): Promise<void> => {
    if (isVisible.value) return

    cleanup()
    isVisible.value = true
    isAnimating.value = true
    onUpdateShow?.(true)
    onOpen?.()

    // 等待动画结束
    closeTimer = setTimeout(() => {
      isAnimating.value = false
      onOpened?.()
    }, duration)
  }

  /**
   * 关闭弹出层
   * @description 支持 beforeClose 异步钩子拦截
   */
  const close = async (): Promise<void> => {
    if (!isVisible.value) return

    // 执行 beforeClose 钩子
    if (beforeClose?.value) {
      try {
        const canClose = await beforeClose.value()
        if (canClose === false) return
      } catch {
        // beforeClose 抛出异常时阻止关闭
        return
      }
    }

    cleanup()
    isAnimating.value = true
    onUpdateShow?.(false)
    onClose?.()

    // 等待动画结束
    closeTimer = setTimeout(() => {
      isAnimating.value = false
      isVisible.value = false
      onClosed?.()
    }, duration)
  }

  /**
   * 切换显示状态
   */
  const toggle = async (): Promise<void> => {
    if (isVisible.value) {
      await close()
    } else {
      await open()
    }
  }

  // 监听 show 变化
  watch(
    show,
    async (newVal) => {
      if (newVal && !isVisible.value) {
        await open()
      } else if (!newVal && isVisible.value) {
        await close()
      }
    },
    { immediate: false }
  )

  // 组件销毁时清理
  onUnmounted(() => {
    cleanup()
  })

  return {
    isVisible,
    isAnimating,
    open,
    close,
    toggle,
    cleanup
  }
}
