import { ref, watch, onUnmounted, type Ref } from 'vue'

/** 全局滚动锁定计数器 */
let lockCount = 0

/** 记录锁定前的 scrollTop */
let savedScrollTop = 0

/** 是否已锁定 */
let isBodyLocked = false

/**
 * 锁定背景滚动（H5）
 * @description 记录当前滚动位置并禁止 body 滚动
 */
function lockBody() {
  if (isBodyLocked) {
    lockCount++
    return
  }
  savedScrollTop = document.documentElement.scrollTop || document.body.scrollTop
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${savedScrollTop}px`
  document.body.style.width = '100%'
  isBodyLocked = true
  lockCount++
}

/**
 * 解锁背景滚动（H5）
 * @description 恢复 body 滚动和滚动位置
 */
function unlockBody() {
  lockCount--
  if (lockCount <= 0) {
    lockCount = 0
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.documentElement.scrollTop = savedScrollTop
    document.body.scrollTop = savedScrollTop
    isBodyLocked = false
  }
}

/**
 * 滚动锁定管理 Hook
 * @description 管理背景页面的滚动锁定状态，支持多层弹出组件的锁定计数
 * @param isLocked 是否锁定滚动的响应式状态
 * @returns 返回锁定状态和控制方法
 */
export function useLockScroll(isLocked: Ref<boolean>) {
  // 初始化为 false，让 immediate watcher 正确触发 lock()
  const locked = ref(false)

  const lock = () => {
    if (!locked.value) {
      locked.value = true
      lockBody()
    }
  }

  const unlock = () => {
    if (locked.value) {
      locked.value = false
      unlockBody()
    }
  }

  // 监听 isLocked 变化自动锁定/解锁
  watch(
    isLocked,
    (newVal) => {
      if (newVal) {
        lock()
      } else {
        unlock()
      }
    },
    { immediate: true }
  )

  // 组件销毁时自动解锁
  onUnmounted(() => {
    unlock()
  })

  return {
    locked,
    lock,
    unlock
  }
}

/**
 * 重置全局滚动锁定状态
 * @description 在页面导航或 keep-alive 场景下，手动重置锁定状态
 */
export function resetLockScroll() {
  lockCount = 0
  isBodyLocked = false
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
}
