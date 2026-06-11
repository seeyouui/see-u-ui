import { ref, type Ref } from 'vue'
import type { NotifyOptions, NotifyType } from './type'

/**
 * Notify 管理器（单例）
 * @description 管理全局 Notify 实例
 */
class NotifyManager {
  /** 当前显示状态 */
  readonly show: Ref<boolean> = ref(false)
  /** 当前消息 */
  readonly message: Ref<string> = ref('')
  /** 当前类型 */
  readonly type: Ref<NotifyType> = ref('info')
  /** 当前时长 */
  readonly duration: Ref<number> = ref(3000)
  /** 当前图标 */
  readonly icon: Ref<string> = ref('')
  /** 当前文字色 */
  readonly color: Ref<string> = ref('')
  /** 当前背景色 */
  readonly background: Ref<string> = ref('')
  /** 是否可关闭 */
  readonly isClosable: Ref<boolean> = ref(false)

  /** 点击回调 */
  private onClickCallback: (() => void) | null = null
  /** 关闭回调 */
  private onCloseCallback: (() => void) | null = null
  /** 自动关闭定时器 */
  private timer: ReturnType<typeof setTimeout> | null = null

  /**
   * 清除定时器
   */
  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  /**
   * 显示通知
   * @param options 通知选项
   */
  showWithOptions(options: NotifyOptions) {
    // 清除之前的定时器
    this.clearTimer()

    // 更新状态
    this.message.value = options.message || ''
    this.type.value = options.type || 'info'
    this.duration.value = options.duration ?? 3000
    this.icon.value = options.icon || ''
    this.color.value = options.color || ''
    this.background.value = options.background || ''
    this.isClosable.value = options.isClosable ?? false
    this.onClickCallback = options.onClick || null
    this.onCloseCallback = options.onClose || null

    // 显示
    this.show.value = true

    // 自动关闭
    if (this.duration.value > 0) {
      this.timer = setTimeout(() => {
        this.hide()
      }, this.duration.value)
    }
  }

  /**
   * 隐藏通知
   */
  hide() {
    this.clearTimer()
    this.show.value = false
    this.onCloseCallback?.()
  }

  /**
   * 触发点击回调
   */
  triggerClick() {
    this.onClickCallback?.()
  }

  /**
   * 显示成功通知
   * @param message 消息文字
   * @param duration 显示时长
   */
  success(message: string, duration?: number) {
    this.showWithOptions({ message, type: 'success', duration })
  }

  /**
   * 显示错误通知
   * @param message 消息文字
   * @param duration 显示时长
   */
  error(message: string, duration?: number) {
    this.showWithOptions({ message, type: 'error', duration })
  }

  /**
   * 显示警告通知
   * @param message 消息文字
   * @param duration 显示时长
   */
  warning(message: string, duration?: number) {
    this.showWithOptions({ message, type: 'warning', duration })
  }

  /**
   * 显示信息通知
   * @param message 消息文字
   * @param duration 显示时长
   */
  info(message: string, duration?: number) {
    this.showWithOptions({ message, type: 'info', duration })
  }

  /**
   * 销毁管理器
   */
  destroy() {
    this.clearTimer()
    this.show.value = false
    this.onClickCallback = null
    this.onCloseCallback = null
  }
}

/** 全局单例 Notify 管理器 */
export const notifyManager = new NotifyManager()
