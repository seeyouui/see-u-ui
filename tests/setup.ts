import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// ==================== 条件编译平台配置 ====================
// 测试环境默认模拟 H5 平台
// 可以通过环境变量 UNI_PLATFORM 来指定平台：H5、APP、MP-WEIXIN、MP-ALIPAY、MP-BAIDU 等
const TEST_PLATFORM = process.env.UNI_PLATFORM || 'H5'

// 设置全局平台标识，供运行时条件编译使用
;(globalThis as any).__UNI_PLATFORM__ = TEST_PLATFORM

// 定义平台判断函数（模拟 uni-app 的运行时平台判断）
const platformChecks: Record<string, boolean> = {
  H5: TEST_PLATFORM === 'H5',
  APP: TEST_PLATFORM === 'APP' || TEST_PLATFORM === 'APP-PLUS',
  'APP-PLUS': TEST_PLATFORM === 'APP' || TEST_PLATFORM === 'APP-PLUS',
  MP: TEST_PLATFORM.startsWith('MP-'),
  'MP-WEIXIN': TEST_PLATFORM === 'MP-WEIXIN',
  'MP-ALIPAY': TEST_PLATFORM === 'MP-ALIPAY',
  'MP-BAIDU': TEST_PLATFORM === 'MP-BAIDU',
  'MP-TOUTIAO': TEST_PLATFORM === 'MP-TOUTIAO',
  'MP-QQ': TEST_PLATFORM === 'MP-QQ'
}

// 在全局对象上添加平台判断方法（如果需要）
;(globalThis as any).__uniPlatformCheck = (platform: string) => {
  return platformChecks[platform] || false
}

// ==================== 抑制 Vue 警告 ====================
const originalWarn = console.warn
console.warn = (...args: any[]) => {
  // 过滤掉关于内置 HTML 元素的警告
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Do not use built-in or reserved HTML elements as component id')) {
    return
  }
  originalWarn(...args)
}

// 告诉 Vue 这些是自定义元素
config.global.config = {
  ...config.global.config,
  compilerOptions: {
    ...config.global.config?.compilerOptions,
    isCustomElement: (tag) => ['view', 'text', 'image', 'input', 'textarea', 'video'].includes(tag)
  }
}

// ==================== 类型定义 ====================
interface UniApiOptions {
  success?: (res?: any) => void
  fail?: (err?: any) => void
  complete?: () => void
  [key: string]: any
}

interface MockNodeInfo {
  id: string
  dataset: Record<string, any>
  width: number
  height: number
  top: number
  left: number
  right: number
  bottom: number
  scrollTop: number
  scrollLeft: number
}

// ==================== 工具函数 ====================
/**
 * 处理 uni API 的标准回调模式
 */
const handleUniApiCallbacks = (options: UniApiOptions, result?: any) => {
  if (options.success) {
    options.success(result || { errMsg: 'ok' })
  }
  if (options.complete) {
    options.complete()
  }
  return Promise.resolve(result || { errMsg: 'ok' })
}

/**
 * 从选择器中提取 ID 或类名
 */
const extractSelectorInfo = (selector: string) => {
  const idMatch = selector.match(/#([^.\s]+)/)
  const classMatch = selector.match(/\.([^#\s]+)/)
  return {
    id: idMatch ? idMatch[1] : '',
    className: classMatch ? classMatch[1] : ''
  }
}

// ==================== 常量定义 ====================
const DEFAULT_NODE_INFO: MockNodeInfo = {
  id: '',
  dataset: {},
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  right: 100,
  bottom: 100,
  scrollTop: 0,
  scrollLeft: 0
}

const DEFAULT_RECT = {
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  right: 100,
  bottom: 100
}

// ==================== Mock 工厂函数 ====================

/**
 * 创建 SelectorQuery Mock
 */
const createSelectorQueryMock = () => {
  let currentSelector = ''
  let isSelectAll = false
  let boundingClientRectCallback: ((rect: any) => void) | null = null
  let scrollOffsetCallback: ((rect: any) => void) | null = null
  let fieldsCallback: ((rect: any) => void) | null = null
  let fieldsOptions: any = null
  let currentScope: any = null

  const mockQuery: any = {
    in: vi.fn((scope) => {
      currentScope = scope
      return mockQuery
    }),

    select: vi.fn((selector) => {
      currentSelector = selector
      isSelectAll = false
      return mockQuery
    }),

    selectAll: vi.fn((selector) => {
      currentSelector = selector
      isSelectAll = true
      return mockQuery
    }),

    selectViewport: vi.fn(() => {
      currentSelector = 'viewport'
      isSelectAll = false
      return mockQuery
    }),

    boundingClientRect: vi.fn((callback) => {
      boundingClientRectCallback = callback
      return mockQuery
    }),

    scrollOffset: vi.fn((callback) => {
      scrollOffsetCallback = callback
      return mockQuery
    }),

    fields: vi.fn((fields, callback) => {
      fieldsOptions = fields
      fieldsCallback = callback
      return mockQuery
    }),

    exec: vi.fn((callback) => {
      const { id, className } = extractSelectorInfo(currentSelector)
      let nodeInfo: MockNodeInfo = { ...DEFAULT_NODE_INFO, id }

      // 为特定选择器提供特定的模拟数据
      if (currentSelector.includes('wd-tabs') || currentSelector.includes('wd-tab')) {
        nodeInfo = {
          ...nodeInfo,
          width: 375,
          height: 44,
          top: 0,
          left: 0,
          right: 375,
          bottom: 44
        }
      } else if (currentSelector.includes('wd-segmented')) {
        nodeInfo = {
          ...nodeInfo,
          width: 300,
          height: 40,
          top: 0,
          left: 0,
          right: 300,
          bottom: 40
        }
      } else if (currentSelector.includes('wd-index-bar')) {
        nodeInfo = {
          ...nodeInfo,
          width: 375,
          height: 600,
          top: 0,
          left: 0,
          right: 375,
          bottom: 600
        }
      }

      // 根据是否是 selectAll 返回数组或单个对象
      let result: MockNodeInfo | MockNodeInfo[]
      if (isSelectAll) {
        // 为不同的选择器创建不同数量的项目
        let count = 2
        if (currentSelector.includes('wd-segmented__item')) {
          count = 3
        } else if (currentSelector.includes('wd-tab')) {
          count = 4
        } else if (currentSelector.includes('wd-index-anchor')) {
          count = 5
        }

        // 创建指定数量的节点信息
        result = Array(count)
          .fill(0)
          .map((_, index) => ({
            ...nodeInfo,
            id: `${id || className}-${index}`,
            dataset: { index: index.toString() },
            width: nodeInfo.width / count,
            left: (nodeInfo.width / count) * index,
            right: (nodeInfo.width / count) * (index + 1)
          }))
      } else {
        result = nodeInfo
      }

      // 调用相应的回调函数
      if (boundingClientRectCallback) {
        boundingClientRectCallback(result)
      }

      if (scrollOffsetCallback) {
        scrollOffsetCallback(result)
      }

      if (fieldsCallback) {
        fieldsCallback(result)
      }

      // 如果提供了 exec 的回调，也调用它
      if (callback) {
        callback([result])
      }

      return Promise.resolve([result])
    })
  }

  return mockQuery
}

/**
 * 创建 IntersectionObserver Mock
 */
const createIntersectionObserverMock = () => {
  let relativeToOptions: any = null
  let relativeToViewportOptions: any = null

  const mockObserver: any = {
    relativeTo: vi.fn((selector, margins) => {
      relativeToOptions = { selector, margins }
      return mockObserver
    }),

    relativeToViewport: vi.fn((margins) => {
      relativeToViewportOptions = margins
      return mockObserver
    }),

    observe: vi.fn((selector, callback) => {
      if (callback) {
        const { id } = extractSelectorInfo(selector)
        callback({
          id: id || selector,
          dataset: {},
          intersectionRatio: 0.5,
          intersectionRect: DEFAULT_RECT,
          boundingClientRect: DEFAULT_RECT,
          relativeRect: DEFAULT_RECT,
          time: Date.now()
        })
      }
    }),

    disconnect: vi.fn()
  }

  return mockObserver
}

/**
 * 创建 Canvas Context Mock
 */
const createCanvasContextMock = () => ({
  setFillStyle: vi.fn(),
  setStrokeStyle: vi.fn(),
  setLineWidth: vi.fn(),
  setLineCap: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  clearRect: vi.fn(),
  draw: vi.fn((_, callback) => {
    callback && callback()
  }),
  createLinearGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn()
  }),
  scale: vi.fn(),
  fillRect: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  restore: vi.fn()
})

/**
 * 创建 OffscreenCanvas Mock
 */
const createOffscreenCanvasMock = (options?: { width?: number; height?: number }) => ({
  width: options?.width || 300,
  height: options?.height || 150,
  getContext: vi.fn().mockReturnValue({
    fillStyle: '',
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    fillRect: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 100 }),
    rotate: vi.fn(),
    translate: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    createPattern: vi.fn().mockReturnValue({})
  }),
  createImage: vi.fn().mockImplementation(() => {
    const img = {
      src: '',
      onload: null as unknown as (() => void) | null,
      onerror: null as unknown as (() => void) | null
    }
    return img
  })
})

// ==================== uni API Mock ====================
vi.stubGlobal('uni', {
  // 系统信息
  getSystemInfoSync: vi.fn().mockReturnValue({
    brand: 'devtools',
    model: 'iPhone',
    pixelRatio: 2,
    screenWidth: 375,
    screenHeight: 800,
    windowWidth: 375,
    windowHeight: 667,
    windowTop: 0,
    statusBarHeight: 20,
    language: 'zh-CN',
    version: '1.0.0',
    platform: 'ios',
    safeArea: {
      bottom: 780,
      height: 667,
      left: 0,
      right: 375,
      top: 20,
      width: 375
    },
    safeAreaInsets: {
      bottom: 20,
      left: 0,
      right: 0,
      top: 20
    },
    theme: 'light'
  }),

  // Canvas 相关
  createCanvasContext: vi.fn().mockReturnValue(createCanvasContextMock()),
  canvasToTempFilePath: vi.fn().mockImplementation(({ success }: UniApiOptions) => {
    success?.({ tempFilePath: 'cropped-image.jpg' })
  }),
  createOffscreenCanvas: vi.fn().mockImplementation(createOffscreenCanvasMock),

  // 选择器查询
  createSelectorQuery: vi.fn().mockImplementation(createSelectorQueryMock),

  // 交叉观察器
  createIntersectionObserver: vi.fn().mockImplementation(createIntersectionObserverMock),

  // 图片相关
  previewImage: vi.fn().mockImplementation((options: UniApiOptions) => {
    return handleUniApiCallbacks(options, { errMsg: 'previewImage:ok' })
  }),

  pageScrollTo: vi.fn().mockImplementation((options: UniApiOptions) => {
    return handleUniApiCallbacks(options, { errMsg: 'pageScrollTo:ok' })
  }),

  uploadFile: vi.fn().mockImplementation((options: UniApiOptions) => {
    if (options.success) {
      options.success({ data: '{"code": 0, "msg": "success", "url": "https://example.com/image.jpg"}' })
    }
    if (options.complete) {
      options.complete()
    }
    return {
      onProgressUpdate: vi.fn(),
      abort: vi.fn()
    }
  }),

  chooseImage: vi.fn().mockImplementation((options: UniApiOptions) => {
    const result = {
      tempFilePaths: ['https://example.com/image.jpg'],
      tempFiles: [{ path: 'https://example.com/image.jpg', size: 1024 }]
    }
    if (options.success) {
      options.success(result)
    }
    if (options.complete) {
      options.complete()
    }
    return Promise.resolve(result)
  }),

  saveImageToPhotosAlbum: vi.fn().mockImplementation((options: UniApiOptions) => {
    return handleUniApiCallbacks(options, { errMsg: 'saveImageToPhotosAlbum:ok' })
  }),

  getImageInfo: vi.fn().mockImplementation((options: UniApiOptions & { src?: string }) => {
    const result = {
      width: 800,
      height: 600,
      path: options.src || '',
      orientation: 'up' as const,
      type: 'png' as const
    }
    if (options.src) {
      if (options.success) {
        options.success(result)
      }
    } else {
      if (options.fail) {
        options.fail()
      }
    }
    if (options.complete) {
      options.complete()
    }
    return Promise.resolve(result)
  }),

  // UI 反馈
  showToast: vi.fn().mockImplementation((options: UniApiOptions) => {
    return handleUniApiCallbacks(options, { errMsg: 'showToast:ok' })
  }),

  hideToast: vi.fn().mockImplementation((options?: UniApiOptions) => {
    if (options?.success) {
      options.success()
    }
    if (options?.complete) {
      options.complete()
    }
    return Promise.resolve({ errMsg: 'hideToast:ok' })
  }),

  showLoading: vi.fn().mockImplementation((options: UniApiOptions) => {
    return handleUniApiCallbacks(options, { errMsg: 'showLoading:ok' })
  }),

  hideLoading: vi.fn().mockImplementation((options?: UniApiOptions) => {
    if (options?.success) {
      options.success()
    }
    if (options?.complete) {
      options.complete()
    }
    return Promise.resolve({ errMsg: 'hideLoading:ok' })
  }),

  showModal: vi.fn().mockImplementation((options: UniApiOptions) => {
    if (options.success) {
      options.success({ confirm: true, cancel: false })
    }
    if (options.complete) {
      options.complete()
    }
    return Promise.resolve({ confirm: true, cancel: false, errMsg: 'showModal:ok' })
  }),

  // 路由
  navigateTo: vi.fn().mockImplementation((options?: UniApiOptions) => {
    if (options?.success) {
      options.success()
    }
    if (options?.complete) {
      options.complete()
    }
    return Promise.resolve({ errMsg: 'navigateTo:ok' })
  }),

  redirectTo: vi.fn().mockImplementation((options?: UniApiOptions) => {
    if (options?.success) {
      options.success()
    }
    if (options?.complete) {
      options.complete()
    }
    return Promise.resolve({ errMsg: 'redirectTo:ok' })
  }),

  // 其他 API
  canIUse: vi.fn().mockImplementation((feature: string) => {
    const unsupportedFeatures: string[] = ['createOffscreenCanvas']
    return !unsupportedFeatures.includes(feature)
  }),

  vibrateShort: vi.fn().mockImplementation((options?: any) => {
    if (options?.success) {
      options.success()
    }
    if (options?.complete) {
      options.complete()
    }
    return Promise.resolve({ errMsg: 'vibrateShort:ok' })
  }),

  getNodeInfo: vi.fn().mockImplementation((options: UniApiOptions & { selector?: string }) => {
    const result = {
      id: options.selector || '',
      dataset: {},
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100
    }
    if (options?.success) {
      options.success(result)
    }
    if (options?.complete) {
      options.complete()
    }
    return Promise.resolve(result)
  }),

  // 页面监听
  onPageScroll: vi.fn(),
  onWindowResize: vi.fn()
})

// ==================== Vue Test Utils 配置 ====================
const uniComponents = {
  block: {
    name: 'block',
    template: '<div><slot></slot></div>'
  },
  view: {
    name: 'uni-view',
    template: '<div><slot></slot></div>'
  },
  text: {
    name: 'uni-text',
    template: '<span><slot></slot></span>'
  },
  image: {
    name: 'uni-image',
    template: '<img><slot></slot></img>',
    props: ['src', 'mode', 'lazy-load']
  },
  'scroll-view': {
    name: 'uni-scroll-view',
    template: '<div class="scroll-view"><slot></slot></div>',
    props: ['scroll-y', 'scroll-x', 'scroll-top', 'scroll-left', 'scroll-into-view']
  },
  swiper: {
    name: 'uni-swiper',
    template: '<div class="swiper"><slot></slot></div>',
    props: ['indicator-dots', 'autoplay', 'interval', 'duration', 'circular']
  },
  'swiper-item': {
    name: 'uni-swiper-item',
    template: '<div class="swiper-item"><slot></slot></div>'
  },
  input: {
    name: 'uni-input',
    template: '<input />',
    props: ['value', 'type', 'password', 'placeholder', 'disabled', 'maxlength'],
    emits: ['input', 'focus', 'blur', 'confirm']
  },
  textarea: {
    name: 'uni-textarea',
    template: '<textarea></textarea>',
    props: ['value', 'placeholder', 'disabled', 'maxlength'],
    emits: ['input', 'focus', 'blur', 'confirm']
  },
  video: {
    name: 'uni-video',
    template: '<video></video>',
    props: ['src', 'poster', 'controls', 'autoplay', 'loop'],
    emits: ['play', 'pause', 'ended', 'timeupdate', 'fullscreenchange']
  },
  'picker-view': {
    name: 'uni-picker-view',
    template: '<div class="picker-view"><slot></slot></div>',
    props: ['value', 'range', 'range-key', 'indicator-style', 'indicator-class'],
    emits: ['change']
  },
  'picker-view-column': {
    name: 'uni-picker-view-column',
    template: '<div class="picker-view-column"><slot></slot></div>',
    props: ['value', 'range', 'range-key']
  }
}

config.global.components = uniComponents
config.global.stubs = uniComponents
config.global.mocks = {
  $uni: (globalThis as any).uni
}

// ==================== 全局对象 Mock ====================
vi.stubGlobal(
  'getCurrentPages',
  vi.fn(() => [{ route: 'pages/index/index', $getAppWebview: vi.fn() }])
)
vi.stubGlobal(
  'getApp',
  vi.fn(() => ({}))
)
vi.stubGlobal('plus', {})
vi.stubGlobal('wx', {})

// 生命周期
const lifecycleHooks = ['onLaunch', 'onShow', 'onHide', 'onUnload', 'onError']
lifecycleHooks.forEach((lifecycle) => {
  vi.stubGlobal(lifecycle, vi.fn())
})

// ==================== 模块 Mock ====================
vi.mock('@dcloudio/uni-app', () => ({
  onShow: vi.fn(),
  onHide: vi.fn(),
  onLaunch: vi.fn(),
  onUnload: vi.fn(),
  onError: vi.fn()
}))

// ==================== 触摸事件 Mock ====================
class TouchEvent extends Event {
  touches: Array<{ clientX: number; clientY: number }>
  changedTouches: Array<{ clientX: number; clientY: number }>
  detail?: { clientX?: number; clientY?: number }
  clientX?: number
  clientY?: number

  constructor(type: string, options: any = {}) {
    super(type, options)
    // 如果提供了 clientX/clientY（来自 click 事件），转换为 touches
    if (options.clientX !== undefined && options.clientY !== undefined) {
      this.touches = [{ clientX: options.clientX, clientY: options.clientY }]
      this.changedTouches = [{ clientX: options.clientX, clientY: options.clientY }]
      this.clientX = options.clientX
      this.clientY = options.clientY
    } else {
      this.touches = options.touches || [{ clientX: 0, clientY: 0 }]
      this.changedTouches = options.changedTouches || options.touches || [{ clientX: 0, clientY: 0 }]
    }
    this.detail = options.detail
  }
}

vi.stubGlobal('TouchEvent', TouchEvent)

// 扩展 MouseEvent 以支持 touches（模拟 uni-app H5 环境的行为）
// 在 uni-app H5 环境中，click 事件也会包含 touches 属性
const originalMouseEvent = globalThis.MouseEvent
if (originalMouseEvent) {
  // 在测试环境中，为 MouseEvent 添加 touches 属性支持
  // 这样 click 事件也能被正确处理
  Object.defineProperty(MouseEvent.prototype, 'touches', {
    get() {
      // 如果事件有 clientX/clientY，转换为 touches 格式
      if (this.clientX !== undefined && this.clientY !== undefined) {
        return [{ clientX: this.clientX, clientY: this.clientY }]
      }
      return []
    },
    configurable: true
  })

  Object.defineProperty(MouseEvent.prototype, 'changedTouches', {
    get() {
      if (this.clientX !== undefined && this.clientY !== undefined) {
        return [{ clientX: this.clientX, clientY: this.clientY }]
      }
      return []
    },
    configurable: true
  })
}
