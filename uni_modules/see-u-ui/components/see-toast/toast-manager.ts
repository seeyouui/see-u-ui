import { ref, type Ref } from 'vue'
import type { ToastOptions, ToastType, ToastPosition } from './type'
import { t } from '../../locale'

/**
 * Toast 管理器（单例）
 * @description 管理全局 Toast 实例和队列
 */
class ToastManager {
  /** 当前显示状态 */
  readonly show: Ref<boolean> = ref(false)
  /** 当前消息 */
  readonly message: Ref<string> = ref('')
  /** 当前类型 */
  readonly type: Ref<ToastType> = ref('default')
  /** 当前图标 */
  readonly icon: Ref<string> = ref('')
  /** 当前时长 */
  readonly duration: Ref<number> = ref(2000)
  /** 当前位置 */
  readonly position: Ref<ToastPosition> = ref('center')
  /** 是否显示遮罩 */
  readonly isOverlay: Ref<boolean> = ref(false)

  /** 关闭回调 */
  private onCloseCallback: (() => void) | null = null
  /** 自动关闭定时器 */
  private timer: ReturnType<typeof setTimeout> | null = null
  /** 当前选项（用于队列管理） */
  private currentOptions: ToastOptions | null = null

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
   * 显示 Toast
   * @param options Toast 选项
   */
  showWithOptions(options: ToastOptions) {
    // 清除之前的定时器
    this.clearTimer()

    // 更新状态
    this.message.value = options.message || ''
    this.type.value = options.type || 'default'
    this.icon.value = options.icon || ''
    this.duration.value = options.duration ?? 2000
    this.position.value = options.position || 'center'
    this.isOverlay.value = options.isOverlay ?? false
    this.onCloseCallback = options.onClose || null
    this.currentOptions = options

    // 显示
    this.show.value = true

    // 自动关闭（duration > 0 时）
    if (this.duration.value > 0) {
      this.timer = setTimeout(() => {
        this.hide()
      }, this.duration.value)
    }
  }

  /**
   * 隐藏 Toast
   */
  hide() {
    this.clearTimer()
    this.show.value = false
    this.onCloseCallback?.()
    this.currentOptions = null
  }

  /**
   * 显示默认 Toast
   * @param message 消息文字
   * @param duration 显示时长
   */
  toast(message: string, duration?: number) {
    this.showWithOptions({ message, type: 'default', duration })
  }

  /**
   * 显示成功 Toast
   * @param message 消息文字
   * @param duration 显示时长
   */
  success(message: string, duration?: number) {
    this.showWithOptions({ message, type: 'success', duration })
  }

  /**
   * 显示错误 Toast
   * @param message 消息文字
   * @param duration 显示时长
   */
  error(message: string, duration?: number) {
    this.showWithOptions({ message, type: 'error', duration })
  }

  /**
   * 显示警告 Toast
   * @param message 消息文字
   * @param duration 显示时长
   */
  warning(message: string, duration?: number) {
    this.showWithOptions({ message, type: 'warning', duration })
  }

  /**
   * 显示信息 Toast
   * @param message 消息文字
   * @param duration 显示时长
   */
  info(message: string, duration?: number) {
    this.showWithOptions({ message, type: 'info', duration })
  }

  /**
   * 显示加载中 Toast
   * @param message 消息文字
   */
  loading(message = t('loading')) {
    this.showWithOptions({ message, type: 'loading', duration: 0, isOverlay: true })
  }

  /**
   * 销毁管理器
   */
  destroy() {
    this.clearTimer()
    this.show.value = false
    this.currentOptions = null
    this.onCloseCallback = null
  }
}

/** 全局单例 Toast 管理器 */
export const toastManager = new ToastManager()
