import type { App, Ref } from 'vue'

/**
 * 语言包类型：key → 翻译文案
 */
export type LocaleMessages = Record<string, string>

/**
 * createI18n 的配置选项
 */
export interface CreateI18nOptions {
  /** 当前语言标识，如 'zh-CN'、'en'。不传则自动检测系统语言 */
  locale?: string
  /** 回退语言，key 在当前语言中找不到时使用。默认 'zh-CN' */
  fallbackLocale?: string
  /** 用户自定义/覆盖语言包，会与内置语言包深度合并 */
  messages?: Record<string, LocaleMessages>
}

/**
 * i18n 实例（由 createI18n 创建）
 */
export interface I18nInstance {
  /** 当前语言标识（响应式） */
  locale: Ref<string>
  /** 回退语言 */
  fallbackLocale: string
  /** 合并后的语言包（响应式） */
  messages: Ref<Record<string, LocaleMessages>>
  /** 翻译函数 */
  t: (key: string, params?: Record<string, any>) => string
  /** 设置当前语言 */
  setLocale: (locale: string) => void
  /** 获取当前语言 */
  getLocale: () => string
  /** 获取当前语言的完整翻译表 */
  getMessages: () => LocaleMessages
  /** Vue 插件 install 方法 */
  install: (app: App) => void
}

/**
 * useI18n() 的返回值
 */
export interface I18nUseReturn {
  /** 翻译函数 */
  t: (key: string, params?: Record<string, any>) => string
  /** 当前语言标识（响应式） */
  locale: Ref<string>
  /** 设置当前语言 */
  setLocale: (locale: string) => void
  /** 获取当前语言 */
  getLocale: () => string
  /** 获取当前语言的完整翻译表 */
  getMessages: () => LocaleMessages
}
