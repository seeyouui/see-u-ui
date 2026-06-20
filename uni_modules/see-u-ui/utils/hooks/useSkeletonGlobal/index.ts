import { ref, computed } from 'vue'

/**
 * 全局骨架屏状态（全局共享）
 * 使用 ref 在所有组件间共享状态
 */
const skeletonVisible = ref(false)
const skeletonCount = ref(0) // 支持多个页面/组件同时请求骨架屏
const skeletonKeys = ref<Set<string>>(new Set())

export interface UseSkeletonGlobalReturn {
  /** 显示全局骨架屏 */
  show: (key?: string) => void
  /** 隐藏全局骨架屏 */
  hide: (key?: string) => void
  /** 强制隐藏（重置计数器） */
  forceHide: () => void
  /** 骨架屏是否可见 */
  visible: ReturnType<typeof computed<boolean>>
  /** 当前活跃的骨架屏数量 */
  count: ReturnType<typeof computed<number>>
}

/**
 * 全局骨架屏 Hook
 *
 * @description 提供全局骨架屏的显示/隐藏控制，支持 H5/APP 和小程序端
 * @example
 * ```vue
 * <script setup>
 * import { useSkeletonGlobal } from '@/uni_modules/see-u-ui'
 *
 * const { show, hide } = useSkeletonGlobal()
 *
 * onLoad(() => {
 *   show()
 *   setTimeout(() => hide(), 2000)
 * })
 * </script>
 * ```
 */
export const useSkeletonGlobal = (): UseSkeletonGlobalReturn => {
  /**
   * 判断是否是叶子节点（实际内容元素）
   * @param element 要检查的元素
   * @returns 是否是叶子节点
   */
  const isLeafNode = (element: Element): boolean => {
    // 没有子元素
    if (element.children.length === 0) {
      return true
    }

    // 只有文本内容
    const hasOnlyText = Array.from(element.childNodes).every(
      (node) => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'BR')
    )
    if (hasOnlyText) {
      return true
    }

    // 特定的内容元素（不管有没有子元素都应该是叶子节点）
    const leafTags = ['IMG', 'IMAGE', 'INPUT', 'TEXTAREA', 'VIDEO', 'AUDIO', 'CANVAS', 'SVG', 'TEXT', 'RICH-TEXT']
    if (leafTags.includes(element.tagName)) {
      return true
    }

    return false
  }

  /**
   * 收集根元素下的所有叶子节点（实际内容元素）
   * @param element 要遍历的根元素
   * @param acc 收集结果的数组
   */
  const collectLeafNodes = (element: Element, acc: Element[]) => {
    if (isLeafNode(element)) {
      acc.push(element)
      return
    }
    const children = element.children
    for (let i = 0; i < children.length; i++) {
      collectLeafNodes(children[i] as Element, acc)
    }
  }

  /**
   * 为页面容器内所有叶子节点添加骨架屏 class
   *
   * 不做任何尺寸测量：骨架样式（见 theme.scss .see-skeleton-loading）只改背景/文字颜色等
   * 纯视觉属性，不改变元素盒模型，元素尺寸天然守恒，因此无需测量也不会跳动。
   * @param pageContainer 页面根容器
   */
  const applySkeleton = (pageContainer: Element) => {
    // #ifdef H5 || APP
    const leaves: Element[] = []
    collectLeafNodes(pageContainer, leaves)
    leaves.forEach((el) => el.classList.add('see-skeleton-loading'))
    // #endif
  }

  /**
   * 遍历DOM并移除骨架屏class
   * @param element 要遍历的根元素
   */
  const removeSkeletonClass = (element: Element) => {
    element.classList.remove('see-skeleton-loading')

    // 遍历所有子元素
    const children = element.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as Element
      removeSkeletonClass(child)
    }
  }

  /**
   * 显示全局骨架屏
   * @param key 可选的唯一标识，用于区分不同的调用来源
   */
  const show = (key?: string) => {
    // 如果提供了 key，检查是否已存在
    if (key && skeletonKeys.value.has(key)) {
      return
    }

    skeletonCount.value++
    if (key) {
      skeletonKeys.value.add(key)
    }
    skeletonVisible.value = true

    // #ifdef H5 || APP
    // H5/APP 端：遍历页面所有DOM节点，添加骨架屏class
    if (typeof document !== 'undefined') {
      // 获取页面容器
      const pageContainer =
        document.querySelector('.uni-page') || document.querySelector('.uni-page-body') || document.querySelector('uni-page-body') || document.body
      if (pageContainer) {
        applySkeleton(pageContainer)
      }
    }
    // #endif

    // #ifdef MP
    // 小程序端：通过事件通知 see-config 组件
    uni.$emit('see-skeleton-global-show', { key })
    // #endif
  }

  /**
   * 隐藏全局骨架屏
   * @param key 可选的唯一标识，与 show 对应
   */
  const hide = (key?: string) => {
    // 如果提供了 key，检查是否存在
    if (key && !skeletonKeys.value.has(key)) {
      return
    }

    skeletonCount.value = Math.max(0, skeletonCount.value - 1)
    if (key) {
      skeletonKeys.value.delete(key)
    }

    if (skeletonCount.value === 0) {
      skeletonVisible.value = false

      // #ifdef H5 || APP
      if (typeof document !== 'undefined') {
        const pageContainer =
          document.querySelector('.uni-page') || document.querySelector('.uni-page-body') || document.querySelector('uni-page-body') || document.body
        if (pageContainer) {
          removeSkeletonClass(pageContainer)
        }
      }
      // #endif

      // #ifdef MP
      uni.$emit('see-skeleton-global-hide', { key })
      // #endif
    }
  }

  /**
   * 强制隐藏（重置计数器）
   */
  const forceHide = () => {
    skeletonCount.value = 0
    skeletonKeys.value.clear()
    skeletonVisible.value = false

    // #ifdef H5 || APP
    if (typeof document !== 'undefined') {
      const pageContainer =
        document.querySelector('.uni-page') || document.querySelector('.uni-page-body') || document.querySelector('uni-page-body') || document.body
      if (pageContainer) {
        removeSkeletonClass(pageContainer)
      }
    }
    // #endif

    // #ifdef MP
    uni.$emit('see-skeleton-global-hide', { force: true })
    // #endif
  }

  return {
    show,
    hide,
    forceHide,
    visible: computed(() => skeletonVisible.value),
    count: computed(() => skeletonCount.value)
  }
}
