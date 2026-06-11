import { computed, type MaybeRef } from 'vue'

export interface UseTeleportOptions {
  /** 是否启用传送，默认 true */
  isEnabled?: MaybeRef<boolean>
  /** 传送目标选择器，默认 'body' */
  to?: string
}

/**
 * 跨层级传送 Hook
 * @description 屏蔽 H5 Teleport 和小程序 fixed 定位的平台差异
 * @param options 配置选项
 * @returns 返回传送相关的响应式状态
 */
export function useTeleport(options: UseTeleportOptions = {}) {
  const { isEnabled = true, to = 'body' } = options

  /**
   * 是否已传送
   * @description H5 平台支持 Teleport，其他平台使用 fixed 定位模拟
   */
  const isTeleported = computed(() => {
    let result = false
    // #ifdef H5
    result = typeof isEnabled === 'boolean' ? isEnabled : isEnabled.value
    // #endif
    return result
  })

  const targetSelector = computed(() => {
    let result = ''
    // #ifdef H5
    const teleported = typeof isEnabled === 'boolean' ? isEnabled : isEnabled.value
    result = teleported ? to : ''
    // #endif
    return result
  })

  const isSupported = (() => {
    let result = false
    // #ifdef H5
    result = true
    // #endif
    return result
  })()

  return {
    isTeleported,
    targetSelector,
    isSupported
  }
}
