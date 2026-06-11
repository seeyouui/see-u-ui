import SeeCopy from './see-copy.vue'
import type { CopyOptions } from './type'

export { SeeCopy }
export default SeeCopy

/**
 * SeeCopy 命令式 API
 * @description 提供 SeeCopy.copy() 命令式调用方法
 */
export const copy = {
  /**
   * 复制文本到剪贴板
   * @param text 要复制的文本
   * @param options 选项
   * @returns 是否复制成功
   */
  async copy(text: string, options: CopyOptions = {}): Promise<boolean> {
    const { showToast = true, toastMessage = '复制成功' } = options

    try {
      let success = false

      // #ifdef H5
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text)
          success = true
        }
      } catch {
        // 回退
      }

      if (!success) {
        try {
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.left = '-9999px'
          textarea.style.top = '-9999px'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          success = document.execCommand('copy')
          document.body.removeChild(textarea)
        } catch {
          success = false
        }
      }
      // #endif

      // #ifndef H5
      success = await new Promise<boolean>((resolve) => {
        uni.setClipboardData({
          data: text,
          success: () => resolve(true),
          fail: () => resolve(false)
        })
      })
      // #endif

      if (success && showToast) {
        uni.showToast({
          title: toastMessage,
          icon: 'success',
          duration: 1500
        })
      }

      return success
    } catch {
      return false
    }
  }
}
