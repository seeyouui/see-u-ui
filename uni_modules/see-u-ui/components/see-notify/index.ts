import SeeNotify from './see-notify.vue'
import { notifyManager } from './notify-manager'
import type { NotifyOptions } from './type'

export { SeeNotify }
export default SeeNotify

/**
 * SeeNotify 命令式 API
 * @description 提供 SeeNotify.success() 等命令式调用方法
 */
export const notify = {
  /**
   * 显示通知
   * @param options 通知选项或消息文字
   */
  show(options: NotifyOptions | string) {
    if (typeof options === 'string') {
      notifyManager.showWithOptions({ message: options })
    } else {
      notifyManager.showWithOptions(options)
    }
  },

  /**
   * 显示成功通知
   * @param message 消息文字
   * @param duration 显示时长
   */
  success(message: string, duration?: number) {
    notifyManager.success(message, duration)
  },

  /**
   * 显示错误通知
   * @param message 消息文字
   * @param duration 显示时长
   */
  error(message: string, duration?: number) {
    notifyManager.error(message, duration)
  },

  /**
   * 显示警告通知
   * @param message 消息文字
   * @param duration 显示时长
   */
  warning(message: string, duration?: number) {
    notifyManager.warning(message, duration)
  },

  /**
   * 显示信息通知
   * @param message 消息文字
   * @param duration 显示时长
   */
  info(message: string, duration?: number) {
    notifyManager.info(message, duration)
  },

  /**
   * 隐藏当前通知
   */
  hide() {
    notifyManager.hide()
  }
}
