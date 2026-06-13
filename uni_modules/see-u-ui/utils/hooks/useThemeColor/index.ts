import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { ThemeColorToken } from '../../colorDerive'
import { derivePalette, isValidHex } from '../../colorDerive'

// types
export interface ThemeColorPreset {
  name: string
  color: string
}

// re-export for convenience
export { isValidHex }
export type { ThemeColorToken }

export interface ThemeColorState {
  primary: string | null
  success: string | null
  warning: string | null
  error: string | null
}

export interface UseThemeColorReturn {
  customColors: Ref<ThemeColorState>
  isCustomized: ComputedRef<boolean>
  presets: ThemeColorPreset[]
  setColor: (token: ThemeColorToken, color: string | null) => void
  setColors: (colors: Partial<ThemeColorState>) => void
  resetColor: (token: ThemeColorToken) => void
  resetAll: () => void
}

const STORAGE_KEY = 'see-theme-color'

/** 默认值（与 theme.scss 一致） */
export const DEFAULT_COLORS: Record<ThemeColorToken, string> = {
  primary: '#3ca7ff',
  success: '#37d497',
  warning: '#ffb645',
  error: '#ff6b6b'
}

/** 预设色板 */
export const PRIMARY_PRESETS: ThemeColorPreset[] = [
  { name: 'themeColor.preset.blue', color: '#3ca7ff' },
  { name: 'themeColor.preset.green', color: '#37d497' },
  { name: 'themeColor.preset.orange', color: '#ff8c42' },
  { name: 'themeColor.preset.purple', color: '#9b6dff' },
  { name: 'themeColor.preset.red', color: '#ff6b6b' },
  { name: 'themeColor.preset.pink', color: '#ff7eb8' },
  { name: 'themeColor.preset.yellow', color: '#ffb645' },
  { name: 'themeColor.preset.cyan', color: '#3ccfcf' }
]

// ==================== 模块级单例 state ====================

function loadFromStorage(): ThemeColorState {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (!raw) return { primary: null, success: null, warning: null, error: null }
    const parsed = JSON.parse(raw)
    const tokens: ThemeColorToken[] = ['primary', 'success', 'warning', 'error']
    const result: ThemeColorState = { primary: null, success: null, warning: null, error: null }
    for (const token of tokens) {
      const val = parsed[token]
      if (typeof val === 'string' && isValidHex(val)) {
        result[token] = val
      } else if (val === null || val === undefined) {
        result[token] = null
      }
    }
    return result
  } catch {
    return { primary: null, success: null, warning: null, error: null }
  }
}

const customColorsRef = ref<ThemeColorState>(loadFromStorage())

// ==================== 注入逻辑 ====================

function formatVars(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join('\n')
}

function injectStyleTag(lightVars: Record<string, string>, darkVars: Record<string, string>): void {
  // #ifdef H5 || APP-PLUS
  if (typeof document === 'undefined') return
  let styleEl = document.getElementById('see-theme-color-runtime')
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'see-theme-color-runtime'
    document.head.appendChild(styleEl)
  }

  const lightBlock = formatVars(lightVars)
  const darkBlock = formatVars(darkVars)

  styleEl.textContent = `
    :root, page, uni-page-body,
    .see-theme-light, .see-theme-light page, .see-theme-light uni-page-body {
      ${lightBlock}
    }
    .see-theme-dark, .see-theme-dark page, .see-theme-dark uni-page-body {
      ${darkBlock}
    }
    @media (prefers-color-scheme: dark) {
      :root:not(.see-theme-light),
      :root:not(.see-theme-light) page,
      :root:not(.see-theme-light) uni-page-body {
        ${darkBlock}
      }
    }
  `
  // #endif
}

function emitMpEvent(lightVars: Record<string, string>, darkVars: Record<string, string>): void {
  // #ifdef MP
  uni.$emit('see-css-vars-change', { lightVars, darkVars })
  // #endif
}

function applyThemeColor(state: ThemeColorState): void {
  const lightVars: Record<string, string> = {}
  const darkVars: Record<string, string> = {}

  const tokens: ThemeColorToken[] = ['primary', 'success', 'warning', 'error']
  for (const token of tokens) {
    const color = state[token]
    if (!color) continue

    const lightPalette = derivePalette(color, 'light')
    const darkPalette = derivePalette(color, 'dark')

    lightVars[`--see-${token}`] = lightPalette.base
    lightVars[`--see-${token}-dark`] = lightPalette.dark
    lightVars[`--see-${token}-disabled`] = lightPalette.disabled
    lightVars[`--see-${token}-light`] = lightPalette.light

    darkVars[`--see-${token}`] = darkPalette.base
    darkVars[`--see-${token}-dark`] = darkPalette.dark
    darkVars[`--see-${token}-disabled`] = darkPalette.disabled
    darkVars[`--see-${token}-light`] = darkPalette.light
  }

  // H5 / App-Plus: 动态注入 style 标签
  // #ifdef H5 || APP-PLUS
  injectStyleTag(lightVars, darkVars)
  // #endif

  // MP: 通过 uni.$emit 通知 see-config 组件
  // #ifdef MP
  emitMpEvent(lightVars, darkVars)
  // #endif
}

// ==================== 公开函数 ====================

function persistState(state: ThemeColorState): void {
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(state))
}

function setColor(token: ThemeColorToken, color: string | null): void {
  customColorsRef.value = { ...customColorsRef.value, [token]: color }
  persistState(customColorsRef.value)
  applyThemeColor(customColorsRef.value)
}

function setColors(colors: Partial<ThemeColorState>): void {
  customColorsRef.value = { ...customColorsRef.value, ...colors }
  persistState(customColorsRef.value)
  applyThemeColor(customColorsRef.value)
}

function resetColor(token: ThemeColorToken): void {
  customColorsRef.value = { ...customColorsRef.value, [token]: null }
  persistState(customColorsRef.value)
  applyThemeColor(customColorsRef.value)
}

function resetAll(): void {
  customColorsRef.value = { primary: null, success: null, warning: null, error: null }
  persistState(customColorsRef.value)
  applyThemeColor(customColorsRef.value)
}

// ==================== Hook ====================

export function useThemeColor(): UseThemeColorReturn {
  const isCustomized = computed(() => {
    const s = customColorsRef.value
    return s.primary !== null || s.success !== null || s.warning !== null || s.error !== null
  })

  return {
    customColors: customColorsRef,
    isCustomized,
    presets: PRIMARY_PRESETS,
    setColor,
    setColors,
    resetColor,
    resetAll
  }
}

// ==================== 启动复原（供 App.vue onLaunch 调用） ====================

export function applyThemeColorOnLaunch(): void {
  const state = loadFromStorage()
  if (state.primary === null && state.success === null && state.warning === null && state.error === null) {
    // 没有自定义颜色，但确保 style 标签存在（空内容清除残留）
    // #ifdef H5 || APP-PLUS
    if (typeof document !== 'undefined') {
      const existing = document.getElementById('see-theme-color-runtime')
      if (existing) existing.remove()
    }
    // #endif
    return
  }
  // 更新模块级 state
  customColorsRef.value = state
  // 应用颜色
  applyThemeColor(state)
}
