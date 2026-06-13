import { createApp, ref } from 'vue'
import { t } from '../../locale'
import SeeModal from './see-modal.vue'
import type { ModalOptions, ModalResult } from './type'

export { SeeModal }
export default SeeModal

/**
 * 创建并显示一个模态框实例
 * @param options 模态框选项
 * @returns Promise<ModalResult>
 */
function showModal(options: ModalOptions): Promise<ModalResult> {
  return new Promise((resolve) => {
    // #ifdef H5
    const container = document.createElement('div')
    document.body.appendChild(container)

    const visible = ref(true)
    const app = createApp(SeeModal, {
      show: visible.value,
      'onUpdate:show': (val: boolean) => {
        visible.value = val
        if (!val) {
          setTimeout(() => {
            app.unmount()
            container.remove()
          }, 300)
        }
      },
      title: options.title || '',
      content: options.content || '',
      confirmText: options.confirmText || t('modal.confirm'),
      cancelText: options.cancelText || t('modal.cancel'),
      isShowCancelBtn: options.isShowCancelBtn !== false,
      confirmType: options.confirmType || 'primary',
      beforeClose: options.beforeClose,
      onConfirm: () => resolve({ confirm: true, cancel: false }),
      onCancel: () => resolve({ confirm: false, cancel: true }),
      isCloseOnClickOverlay: options.isCloseOnClickOverlay
    })

    app.mount(container)
    // #endif

    // #ifndef H5
    // Fallback: 非 H5 平台 (小程序/App) 退化为 uni.showModal
    // 注意: uni.showModal 不支持 confirmType、isShowHeader、slots、beforeClose 等自定义特性
    uni.showModal({
      title: options.title || '',
      content: options.content || '',
      showCancel: options.isShowCancelBtn !== false,
      confirmText: options.confirmText || t('modal.confirm'),
      cancelText: options.cancelText || t('modal.cancel'),
      success: (res) => {
        if (res.confirm) {
          resolve({ confirm: true, cancel: false })
        } else {
          resolve({ confirm: false, cancel: true })
        }
      },
      fail: () => {
        resolve({ confirm: false, cancel: true })
      }
    })
    // #endif
  })
}

/**
 * SeeModal 命令式 API
 * @description 提供 SeeModal.confirm() 等命令式调用方法
 */
export const modal = {
  /**
   * 确认对话框（带确认和取消按钮）
   * @param options 选项或内容文字
   * @returns Promise<ModalResult>
   */
  confirm(options: ModalOptions | string): Promise<ModalResult> {
    const opts = typeof options === 'string' ? { content: options } : options
    return showModal({ ...opts, isShowCancelBtn: true })
  },

  /**
   * 提示对话框（仅确认按钮）
   * @param options 选项或内容文字
   * @returns Promise<ModalResult>
   */
  alert(options: ModalOptions | string): Promise<ModalResult> {
    const opts = typeof options === 'string' ? { content: options } : options
    return showModal({ ...opts, isShowCancelBtn: false })
  },

  /**
   * 关闭当前模态框（预留接口）
   */
  close(): void {}
}
