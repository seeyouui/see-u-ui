import SeeToast from './see-toast.vue'
import { toastManager } from './toast-manager'
import type { ToastOptions } from './type'

export { SeeToast }
export default SeeToast

/**
 * SeeToast 命令式 API
 * @description 提供 SeeToast.success() 等命令式调用方法
 */
export const toast = {
  /**
   * 显示 Toast
   * @param options Toast 选项或消息文字
   */
  show(options: ToastOptions | string) {
    if (typeof options === 'string') {
      toastManager.toast(options)
    } else {
      toastManager.showWithOptions(options)
    }
  },

  /**
   * 显示成功 Toast
   * @param message 消息文字
   * @param duration 显示时长
   */
  success(message: string, duration?: number) {
    toastManager.success(message, duration)
  },

  /**
   * 显示错误 Toast
   * @param message 消息文字
   * @param duration 显示时长
   */
  error(message: string, duration?: number) {
    toastManager.error(message, duration)
  },

  /**
   * 显示警告 Toast
   * @param message 消息文字
   * @param duration 显示时长
   */
  warning(message: string, duration?: number) {
    toastManager.warning(message, duration)
  },

  /**
   * 显示信息 Toast
   * @param message 消息文字
   * @param duration 显示时长
   */
  info(message: string, duration?: number) {
    toastManager.info(message, duration)
  },

  /**
   * 显示加载中 Toast
   * @param message 消息文字
   */
  loading(message?: string) {
    toastManager.loading(message)
  },

  /**
   * 隐藏当前 Toast
   */
  hide() {
    toastManager.hide()
  }
}
