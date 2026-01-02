import { ref, onBeforeUnmount } from 'vue'

export interface TextUpConfig {
  speed?: number
  showCursor?: boolean
  autoStart?: boolean
}

export interface TextUpEmits {
  onComplete?: () => void
  onTyping?: (currentText: string) => void
}

export function useTextUp(config: TextUpConfig = {}, emits?: TextUpEmits) {
  const defaultConfig = {
    speed: 100,
    showCursor: true,
    autoStart: true,
    ...config
  }

  const displayText = ref('')
  const currentIndex = ref(0)
  let textUpTimer: number | null = null

  /**
   * 开始打字动画
   */
  const startTyping = (text: string) => {
    stopTyping()
    currentIndex.value = 0
    displayText.value = ''

    const textStr = String(text || '')

    const type = () => {
      if (currentIndex.value < textStr.length) {
        displayText.value += textStr[currentIndex.value]
        currentIndex.value++

        // 触发打字中回调
        if (emits?.onTyping) {
          emits.onTyping(displayText.value)
        }

        textUpTimer = setTimeout(type, defaultConfig.speed) as unknown as number
      } else {
        // 触发完成回调
        if (emits?.onComplete) {
          emits.onComplete()
        }
      }
    }

    type()
  }

  /**
   * 停止打字动画
   */
  const stopTyping = () => {
    if (textUpTimer) {
      clearTimeout(textUpTimer)
      textUpTimer = null
    }
  }

  /**
   * 重置打字机
   */
  const resetTyping = () => {
    stopTyping()
    currentIndex.value = 0
    displayText.value = ''
  }

  /**
   * 立即显示全部文本
   */
  const showAllText = (text: string) => {
    stopTyping()
    displayText.value = String(text || '')
    currentIndex.value = displayText.value.length

    // 触发完成回调
    if (emits?.onComplete) {
      emits.onComplete()
    }
  }

  /**
   * 暂停打字
   */
  const pauseTyping = () => {
    stopTyping()
  }

  /**
   * 继续打字（从当前位置继续）
   */
  const resumeTyping = (text: string) => {
    if (currentIndex.value >= text.length) {
      return
    }

    const textStr = String(text || '')

    const type = () => {
      if (currentIndex.value < textStr.length) {
        displayText.value += textStr[currentIndex.value]
        currentIndex.value++

        if (emits?.onTyping) {
          emits.onTyping(displayText.value)
        }

        textUpTimer = setTimeout(type, defaultConfig.speed) as unknown as number
      } else {
        if (emits?.onComplete) {
          emits.onComplete()
        }
      }
    }

    type()
  }

  // 组件卸载时清理定时器
  onBeforeUnmount(() => {
    stopTyping()
  })

  return {
    displayText,
    currentIndex,
    startTyping,
    stopTyping,
    resetTyping,
    showAllText,
    pauseTyping,
    resumeTyping,
    config: defaultConfig
  }
}
