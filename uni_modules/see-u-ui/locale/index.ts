/**
 * SeeYouUI 国际化模块
 * @description 轻量级 i18n 方案，兼容 uni-app 全部平台，零外部依赖
 * @tutorial https://www.seeuui.cn/i18n
 *
 * 使用方式：
 *   1. 零配置：直接 app.use(SeeYouUI)，组件跟随系统语言
 *   2. 指定语言：createI18n({ locale: 'en' })
 *   3. 完全自定义：createI18n({ locale, messages: { ... } })
 */
import { ref, inject, type App, type InjectionKey } from 'vue'
import type { CreateI18nOptions, I18nInstance, I18nUseReturn, LocaleMessages } from './type'
import zhCN from './messages/zh-CN'
import en from './messages/en'

// ==================== 常量 ====================

/** provide/inject 的 key */
const I18N_KEY: InjectionKey<I18nInstance> = Symbol('see-i18n')

/** 内置语言包 */
const builtInMessages: Record<string, LocaleMessages> = {
  'zh-CN': zhCN,
  en
}

/** 全局默认单例（未调用 createI18n 时自动创建） */
let globalInstance: I18nInstance | null = null

// ==================== 工具函数 ====================

/**
 * 检测系统语言
 * @returns 语言标识，中文系统返回 'zh-CN'，其他返回 'en'
 */
function detectLocale(): string {
  try {
    let lang = ''
    // #ifdef H5
    lang = navigator.language || (navigator as any).userLanguage || ''
    // #endif
    // #ifndef H5
    const sysInfo = uni.getSystemInfoSync()
    lang = (sysInfo as any).locale || (sysInfo as any).language || ''
    // #endif
    if (lang.toLowerCase().startsWith('zh')) return 'zh-CN'
    return 'en'
  } catch {
    return 'zh-CN'
  }
}

/**
 * 字符串模板插值
 * @example interpolate('Hello {name}', { name: 'World' }) → 'Hello World'
 */
function interpolate(template: string, params?: Record<string, any>): string {
  if (!params || typeof template !== 'string') return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`
  })
}

/**
 * 深度合并语言包（用户自定义覆盖内置）
 */
function mergeMessages(userMessages: Record<string, LocaleMessages>): Record<string, LocaleMessages> {
  const result: Record<string, LocaleMessages> = {}

  // 先拷贝内置语言包
  for (const lang of Object.keys(builtInMessages)) {
    result[lang] = { ...builtInMessages[lang] }
  }

  // 合并用户语言包
  for (const lang of Object.keys(userMessages)) {
    if (result[lang]) {
      result[lang] = { ...result[lang], ...userMessages[lang] }
    } else {
      result[lang] = { ...userMessages[lang] }
    }
  }

  return result
}

// ==================== 核心 API ====================

/**
 * 创建 i18n 实例
 *
 * @param options - 配置选项
 * @returns i18n 实例
 *
 * @example
 * ```ts
 * // 基本用法
 * const i18n = createI18n({ locale: 'en' })
 * app.use(SeeYouUI, { i18n })
 *
 * // 自定义语言包
 * const i18n = createI18n({
 *   locale: 'ja',
 *   fallbackLocale: 'zh-CN',
 *   messages: {
 *     'ja': { cancel: 'キャンセル', confirm: '確認' },
 *   },
 * })
 * ```
 */
export function createI18n(options: CreateI18nOptions = {}): I18nInstance {
  const { locale: initialLocale, fallbackLocale = 'zh-CN', messages: userMessages = {} } = options

  const locale = ref<string>(initialLocale || detectLocale())
  const messages = ref<Record<string, LocaleMessages>>(mergeMessages(userMessages))

  /**
   * 翻译函数
   * @param key - 翻译 key
   * @param params - 插值参数
   * @returns 翻译后的文案
   */
  function t(key: string, params?: Record<string, any>): string {
    const msgs = messages.value
    const currentLocale = locale.value

    // 1. 当前语言查找
    if (msgs[currentLocale]?.[key]) {
      return interpolate(msgs[currentLocale][key], params)
    }

    // 2. 回退语言查找（仅当与当前语言不同时）
    if (currentLocale !== fallbackLocale && msgs[fallbackLocale]?.[key]) {
      return interpolate(msgs[fallbackLocale][key], params)
    }

    // 3. 返回 key 本身（fallback to key）
    return key
  }

  /**
   * 设置当前语言
   */
  function setLocale(newLocale: string): void {
    locale.value = newLocale
  }

  /**
   * 获取当前语言
   */
  function getLocale(): string {
    return locale.value
  }

  /**
   * 获取当前语言的完整翻译表
   */
  function getMessages(): LocaleMessages {
    return messages.value[locale.value] || {}
  }

  /**
   * Vue 插件 install 方法
   */
  function install(app: App): void {
    app.provide(I18N_KEY, instance)
  }

  const instance: I18nInstance = {
    locale,
    fallbackLocale,
    messages,
    t,
    setLocale,
    getLocale,
    getMessages,
    install
  }

  // 设为全局单例
  globalInstance = instance

  return instance
}

/**
 * 在组件或 Hook 中使用 i18n
 *
 * 优先从父组件注入的 i18n 实例获取，未注入时自动回退到全局默认单例。
 * 因此不需要手动 provide —— 直接调用 useI18n() 即可。
 *
 * @returns i18n 使用接口
 *
 * @example
 * ```vue
 * <script setup>
 * import { useI18n } from 'see-u-ui'
 * const { t, locale, setLocale } = useI18n()
 *
 * // 翻译
 * console.log(t('cancel'))  // → '取消' or 'Cancel'
 *
 * // 切换语言
 * setLocale('en')
 * </script>
 * ```
 */
export function useI18n(): I18nUseReturn {
  // 优先从 provide/inject 获取
  const injected = inject(I18N_KEY, null)

  if (injected) {
    return {
      t: injected.t,
      locale: injected.locale,
      setLocale: injected.setLocale,
      getLocale: injected.getLocale,
      getMessages: injected.getMessages
    }
  }

  // 回退到全局单例，不存在则自动创建
  if (!globalInstance) {
    createI18n()
  }

  return {
    t: globalInstance!.t,
    locale: globalInstance!.locale,
    setLocale: globalInstance!.setLocale,
    getLocale: globalInstance!.getLocale,
    getMessages: globalInstance!.getMessages
  }
}

/**
 * 独立翻译函数（非响应式，适合在 setup 外部或纯 JS 中使用）
 *
 * @example
 * ```ts
 * import { t } from 'see-u-ui'
 * console.log(t('cancel'))  // → '取消'
 * ```
 */
export function t(key: string, params?: Record<string, any>): string {
  if (!globalInstance) {
    createI18n()
  }
  return globalInstance!.t(key, params)
}

export type { CreateI18nOptions, I18nInstance, I18nUseReturn, LocaleMessages }
