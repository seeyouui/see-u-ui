import { ref } from 'vue'

export interface UseCopyOptions {
  /** 复制成功后是否显示 Toast，默认 true */
  showToast?: boolean
  /** 成功提示文字，默认 '复制成功' */
  toastMessage?: string
  /** Toast 显示时长(ms)，默认 1500 */
  toastDuration?: number
}

/**
 * 跨平台剪贴板操作 Hook
 * @description 封装 H5 Clipboard API + execCommand 回退，以及小程序/App uni.setClipboardData
 * @param options 配置选项
 * @returns 返回复制方法和状态
 */
export function useCopy(options: UseCopyOptions = {}) {
  const { showToast = true, toastMessage = '复制成功', toastDuration = 1500 } = options

  /** 是否正在复制 */
  const isCopying = ref(false)
  /** 最后一次复制结果 */
  const lastResult = ref<boolean | null>(null)

  /**
   * H5 环境复制
   * @description 优先使用 Clipboard API，回退到 execCommand
   */
  const copyH5 = async (text: string): Promise<boolean> => {
    let result = false
    // #ifdef H5
    try {
      // 优先使用 Clipboard API（需要 HTTPS 或 localhost）
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        result = true
      }
    } catch {
      // Clipboard API 失败，回退到 execCommand
    }

    if (!result) {
      // execCommand 回退方案
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '-9999px'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        result = document.execCommand('copy')
        document.body.removeChild(textarea)
      } catch {
        result = false
      }
    }
    // #endif

    return result
  }

  /**
   * 小程序/App 环境复制
   */
  const copyUni = async (text: string): Promise<boolean> => {
    let result = false
    // #ifndef H5
    result = await new Promise((resolve) => {
      uni.setClipboardData({
        data: text,
        success: () => resolve(true),
        fail: () => resolve(false)
      })
    })
    // #endif

    return result
  }

  /**
   * 复制文本到剪贴板
   * @param text 要复制的文本
   * @returns 是否复制成功
   */
  const copy = async (text: string): Promise<boolean> => {
    if (isCopying.value) return false
    if (!text) return false

    isCopying.value = true

    try {
      let success = false

      // #ifdef H5
      success = await copyH5(text)
      // #endif

      // #ifndef H5
      success = await copyUni(text)
      // #endif

      lastResult.value = success

      // 显示成功提示
      if (success && showToast) {
        uni.showToast({
          title: toastMessage,
          icon: 'success',
          duration: toastDuration
        })
      }

      return success
    } catch {
      lastResult.value = false
      return false
    } finally {
      isCopying.value = false
    }
  }

  return {
    copy,
    isCopying,
    lastResult
  }
}
