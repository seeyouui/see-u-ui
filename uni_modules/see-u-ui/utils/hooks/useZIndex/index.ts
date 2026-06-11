import { ref } from 'vue'

/** 默认起始层级 */
const DEFAULT_BASE_ZINDEX = 1000

/** 全局层级计数器（单例） */
let globalZIndex = DEFAULT_BASE_ZINDEX

/** 当前活跃的 zIndex 实例集合 */
const activeInstances = new Set<number>()

/**
 * 全局层级管理 Hook
 * @description 提供全局递增的 z-index 管理，支持多层弹出组件的层级协调
 * @param baseZIndex 可选的基础层级值，不传则使用全局计数器
 * @returns 返回层级管理相关的响应式状态和方法
 */
export function useZIndex(baseZIndex?: number) {
  // 确保 globalZIndex 至少为 baseZIndex
  if (baseZIndex !== undefined) {
    globalZIndex = Math.max(globalZIndex, baseZIndex)
  }
  // 初始化为 baseZIndex-1，使首次 nextZIndex() 返回 baseZIndex 本身
  const currentZIndex = ref(baseZIndex !== undefined ? baseZIndex - 1 : globalZIndex)

  /**
   * 获取下一个可用层级
   * @returns 新的 z-index 值
   */
  const nextZIndex = (): number => {
    if (baseZIndex !== undefined) {
      // 使用传入的基础层级时，基于当前值递增
      currentZIndex.value += 1
    } else {
      // 使用全局计数器
      globalZIndex += 1
      currentZIndex.value = globalZIndex
    }
    activeInstances.add(currentZIndex.value)
    return currentZIndex.value
  }

  /**
   * 释放当前层级
   * @description 从活跃集合中移除，z-index 只增不减避免冲突
   */
  const releaseZIndex = () => {
    activeInstances.delete(currentZIndex.value)
    // NO RESET - z-index monotonically increases to avoid conflicts
  }

  /**
   * 获取当前层级值
   * @returns 当前 z-index 值
   */
  const getCurrentZIndex = (): number => {
    return currentZIndex.value
  }

  return {
    currentZIndex,
    nextZIndex,
    releaseZIndex,
    getCurrentZIndex
  }
}
