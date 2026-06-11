import { ref } from 'vue'

/**
 * 路由选项
 */
export interface RouteOptions {
  /** 目标页面路径 */
  url: string
  /** 路由参数，自动序列化编码 */
  params?: Record<string, any>
  /** 页面间通信事件 */
  events?: Record<string, (...args: any[]) => any>
  /** 页面动画类型（仅 APP 有效） */
  animationType?:
    | 'auto'
    | 'none'
    | 'slide-in-right'
    | 'slide-in-left'
    | 'slide-out-right'
    | 'slide-out-left'
    | 'fade-in'
    | 'zoom-out'
    | 'zoom-fade-out'
    | 'pop-out'
}

/**
 * 路由 Hook 返回值
 */
export interface UseRouteReturn {
  /** 跳转到新页面（压栈） */
  navigateTo: (options: RouteOptions) => Promise<void>
  /** 重定向到新页面（替换当前页） */
  redirectTo: (options: RouteOptions) => Promise<void>
  /** 切换 Tab 页 */
  switchTab: (options: RouteOptions) => Promise<void>
  /** 关闭所有页面并打开新页面 */
  reLaunch: (options: RouteOptions) => Promise<void>
  /** 返回上一页 */
  navigateBack: (delta?: number) => Promise<void>
  /** 当前路由信息 */
  currentRoute: ReturnType<typeof ref<{ path: string; params: Record<string, any> }>>
  /** 获取当前页面参数 */
  getQuery: <T = Record<string, string>>() => T
}

/**
 * 拼接路由参数
 * @param url 基础路径
 * @param params 路由参数
 * @returns 带参数的完整路径
 */
function appendParams(url: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return url
  }
  const encoded = encodeURIComponent(JSON.stringify(params))
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}params=${encoded}`
}

/**
 * 跨平台路由统一封装 Hook
 * @description 封装 uni-app 路由 API，统一参数格式，自动编码 params
 * @returns 路由操作方法和当前路由状态
 */
export function useRoute(): UseRouteReturn {
  /** 当前路由状态 */
  const currentRoute = ref<{ path: string; params: Record<string, any> }>({
    path: '',
    params: {}
  })

  /**
   * 跳转到新页面（压栈）
   */
  const navigateTo = (options: RouteOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
      const url = appendParams(options.url, options.params)
      uni.navigateTo({
        url,
        animationType: options.animationType,
        animationDuration: 300,
        success: () => {
          currentRoute.value = { path: options.url, params: options.params || {} }
          resolve()
        },
        fail: (err: any) => reject(err)
      })
    })
  }

  /**
   * 重定向到新页面（替换当前页）
   */
  const redirectTo = (options: RouteOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
      const url = appendParams(options.url, options.params)
      uni.redirectTo({
        url,
        success: () => {
          currentRoute.value = { path: options.url, params: options.params || {} }
          resolve()
        },
        fail: (err: any) => reject(err)
      })
    })
  }

  /**
   * 切换 Tab 页
   */
  const switchTab = (options: RouteOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
      uni.switchTab({
        url: options.url,
        success: () => {
          currentRoute.value = { path: options.url, params: {} }
          resolve()
        },
        fail: (err: any) => reject(err)
      })
    })
  }

  /**
   * 关闭所有页面并打开新页面
   */
  const reLaunch = (options: RouteOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
      const url = appendParams(options.url, options.params)
      uni.reLaunch({
        url,
        success: () => {
          currentRoute.value = { path: options.url, params: options.params || {} }
          resolve()
        },
        fail: (err: any) => reject(err)
      })
    })
  }

  /**
   * 返回上一页
   * @param delta 返回的页面层级，默认 1
   */
  const navigateBack = (delta: number = 1): Promise<void> => {
    return new Promise((resolve, reject) => {
      uni.navigateBack({
        delta,
        success: () => resolve(),
        fail: (err: any) => reject(err)
      })
    })
  }

  /**
   * 获取当前页面参数
   */
  const getQuery = <T = Record<string, string>>(): T => {
    try {
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1] as any
        return (currentPage.options || currentPage.$page?.options || {}) as T
      }
    } catch {
      // 非 H5 环境可能不支持 getCurrentPages
    }
    return {} as T
  }

  return {
    navigateTo,
    redirectTo,
    switchTab,
    reLaunch,
    navigateBack,
    currentRoute,
    getQuery
  }
}
