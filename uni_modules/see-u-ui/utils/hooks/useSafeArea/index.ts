import { ref } from 'vue'

/**
 * 安全区内边距
 */
export interface SafeAreaInsets {
  /** 顶部安全区距离（px） */
  top: ReturnType<typeof ref<number>>
  /** 底部安全区距离（px） */
  bottom: ReturnType<typeof ref<number>>
  /** 左侧安全区距离（px） */
  left: ReturnType<typeof ref<number>>
  /** 右侧安全区距离（px） */
  right: ReturnType<typeof ref<number>>
}

/** 模块级缓存（单例模式） */
let cachedInsets: SafeAreaInsets | null = null

/**
 * 安全区信息获取 Hook
 * @description 获取设备安全区内边距信息，结果缓存在模块级别（单例模式）
 * @returns 安全区四个方向的内边距（响应式 Ref）
 */
export function useSafeArea(): SafeAreaInsets {
  if (cachedInsets) {
    return cachedInsets
  }

  const top = ref(0)
  const bottom = ref(0)
  const left = ref(0)
  const right = ref(0)

  try {
    const systemInfo = uni.getSystemInfoSync()
    const insets = systemInfo.safeAreaInsets
    if (insets) {
      top.value = insets.top || 0
      bottom.value = insets.bottom || 0
      left.value = insets.left || 0
      right.value = insets.right || 0
    }
  } catch {
    // getSystemInfoSync 失败时保持默认值 0
  }

  cachedInsets = { top, bottom, left, right }
  return cachedInsets
}
