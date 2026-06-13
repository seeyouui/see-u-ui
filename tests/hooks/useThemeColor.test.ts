import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

// ==================== mock storage ====================
const storage = new Map<string, string>()

vi.stubGlobal('uni', {
  ...(globalThis as any).uni,
  getStorageSync: vi.fn((key: string) => {
    const val = storage.get(key)
    return val !== undefined ? val : ''
  }),
  setStorageSync: vi.fn((key: string, value: string) => {
    storage.set(key, value)
  }),
  removeStorageSync: vi.fn((key: string) => {
    storage.delete(key)
  }),
  $emit: vi.fn(),
  $on: vi.fn(),
  $off: vi.fn()
})

// Helper: check if a style element with given id contains given text
const getStyleText = (id: string): string => {
  const el = document.getElementById(id)
  return el ? el.textContent || '' : ''
}

describe('useThemeColor', () => {
  beforeEach(() => {
    storage.clear()
    // Remove injected style from previous test
    const existing = document.getElementById('see-theme-color-runtime')
    if (existing) existing.remove()
    // Reset module-level state — need to re-import to reset
    vi.resetModules()
  })

  it('DEFAULT_COLORS 与 theme.scss 默认值一致', async () => {
    const { DEFAULT_COLORS } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    expect(DEFAULT_COLORS.primary).toBe('#3ca7ff')
    expect(DEFAULT_COLORS.success).toBe('#37d497')
    expect(DEFAULT_COLORS.warning).toBe('#ffb645')
    expect(DEFAULT_COLORS.error).toBe('#ff6b6b')
  })

  it('PRIMARY_PRESETS 包含 8 个预设', async () => {
    const { PRIMARY_PRESETS } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    expect(PRIMARY_PRESETS.length).toBe(8)
    expect(PRIMARY_PRESETS[0].color).toBe('#3ca7ff')
  })

  it('初始 customColors 全为 null', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { customColors } = useThemeColor()
    expect(customColors.value.primary).toBeNull()
    expect(customColors.value.success).toBeNull()
    expect(customColors.value.warning).toBeNull()
    expect(customColors.value.error).toBeNull()
  })

  it('isCustomized 在所有 null 时为 false', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { isCustomized } = useThemeColor()
    expect(isCustomized.value).toBe(false)
  })

  it('setColor 后 state 更新且 isCustomized 为 true', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { customColors, setColor, isCustomized } = useThemeColor()
    setColor('primary', '#ff5500')
    expect(customColors.value.primary).toBe('#ff5500')
    expect(isCustomized.value).toBe(true)
  })

  it('setColor null 等效于 resetColor', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { customColors, setColor } = useThemeColor()
    setColor('primary', '#ff5500')
    setColor('primary', null)
    expect(customColors.value.primary).toBeNull()
  })

  it('resetColor 复位单个 token', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { customColors, setColor, resetColor, isCustomized } = useThemeColor()
    setColor('primary', '#ff5500')
    setColor('success', '#00ff00')
    expect(isCustomized.value).toBe(true)
    resetColor('primary')
    expect(customColors.value.primary).toBeNull()
    expect(customColors.value.success).toBe('#00ff00')
    expect(isCustomized.value).toBe(true) // still customized because success is set
  })

  it('resetAll 清空所有自定义', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { customColors, setColor, resetAll, isCustomized } = useThemeColor()
    setColor('primary', '#ff5500')
    setColor('error', '#ff0000')
    resetAll()
    expect(customColors.value.primary).toBeNull()
    expect(customColors.value.error).toBeNull()
    expect(isCustomized.value).toBe(false)
  })

  it('setColors 批量设置', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { customColors, setColors } = useThemeColor()
    setColors({ primary: '#ff5500', warning: '#ffcc00' })
    expect(customColors.value.primary).toBe('#ff5500')
    expect(customColors.value.warning).toBe('#ffcc00')
    expect(customColors.value.success).toBeNull()
    expect(customColors.value.error).toBeNull()
  })

  it('setColor 后存储被写入', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { setColor } = useThemeColor()
    setColor('primary', '#ff5500')
    const stored = storage.get('see-theme-color')
    expect(stored).toBeDefined()
    const parsed = JSON.parse(stored!)
    expect(parsed.primary).toBe('#ff5500')
  })

  it('resetAll 后存储仍可读且全为 null', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { setColor, resetAll } = useThemeColor()
    setColor('primary', '#ff5500')
    resetAll()
    const stored = storage.get('see-theme-color')
    expect(stored).toBeDefined()
    const parsed = JSON.parse(stored!)
    expect(parsed.primary).toBeNull()
    expect(parsed.success).toBeNull()
    expect(parsed.warning).toBeNull()
    expect(parsed.error).toBeNull()
  })

  it('H5 端 setColor 后注入 <style> 标签', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { setColor } = useThemeColor()
    setColor('primary', '#ff5500')

    const styleText = getStyleText('see-theme-color-runtime')
    expect(styleText).toContain('--see-primary')
    expect(styleText).toContain('#ff5500')
  })

  it('H5 端 resetAll 后 <style> 标签仅保留未被自定义的颜色', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { setColor, resetAll } = useThemeColor()
    setColor('primary', '#ff5500')
    resetAll()

    const styleText = getStyleText('see-theme-color-runtime')
    // 全部 reset 后不应包含自定义颜色
    expect(styleText).not.toContain('#ff5500')
  })

  it('模块级单例：两次 useThemeColor() 返回同一 customColors 引用', async () => {
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const a = useThemeColor()
    const b = useThemeColor()
    expect(a.customColors).toBe(b.customColors)
    a.setColor('primary', '#123456')
    expect(b.customColors.value.primary).toBe('#123456')
  })

  it('损坏的 storage 数据静默回退到全 null', async () => {
    // Simulate corrupted storage before importing
    storage.set('see-theme-color', 'not-valid-json{{{')
    const { useThemeColor } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    const { customColors } = useThemeColor()
    expect(customColors.value.primary).toBeNull()
    expect(customColors.value.success).toBeNull()
    expect(customColors.value.warning).toBeNull()
    expect(customColors.value.error).toBeNull()
  })

  it('applyThemeColorOnLaunch 从 storage 恢复', async () => {
    storage.set('see-theme-color', JSON.stringify({ primary: '#abcdef', success: null, warning: null, error: null }))
    const { applyThemeColorOnLaunch } = await import('../../uni_modules/see-u-ui/utils/hooks/useThemeColor')
    // 不应抛错
    expect(() => applyThemeColorOnLaunch()).not.toThrow()
    // 应该注入了 style 标签（H5 平台）
    const styleText = getStyleText('see-theme-color-runtime')
    expect(styleText).toContain('#abcdef')
  })
})
