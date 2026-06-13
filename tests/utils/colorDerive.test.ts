import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, isValidHex, adjustHsl, derivePalette } from '../../uni_modules/see-u-ui/utils/colorDerive'

// ==================== hexToRgb ====================
describe('hexToRgb', () => {
  it('解析 #rrggbb 格式', () => {
    expect(hexToRgb('#3ca7ff')).toEqual([60, 167, 255])
  })

  it('解析 #rgb 短格式', () => {
    expect(hexToRgb('#f00')).toEqual([255, 0, 0])
    expect(hexToRgb('#0f0')).toEqual([0, 255, 0])
    expect(hexToRgb('#00f')).toEqual([0, 0, 255])
  })

  it('大小写不敏感', () => {
    expect(hexToRgb('#3CA7FF')).toEqual([60, 167, 255])
    expect(hexToRgb('#F00')).toEqual([255, 0, 0])
  })

  it('解析黑色', () => {
    expect(hexToRgb('#000')).toEqual([0, 0, 0])
    expect(hexToRgb('#000000')).toEqual([0, 0, 0])
  })

  it('解析白色', () => {
    expect(hexToRgb('#fff')).toEqual([255, 255, 255])
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255])
  })
})

// ==================== rgbToHex ====================
describe('rgbToHex', () => {
  it('转换 RGB 为 hex', () => {
    expect(rgbToHex(60, 167, 255)).toBe('#3ca7ff')
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
  })

  it('输出小写', () => {
    const result = rgbToHex(170, 187, 204)
    expect(result).toBe('#aabbcc')
  })

  it('正确处理边界 0 和 255', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000')
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff')
  })
})

// ==================== rgbToHsl / hslToRgb 互转 ====================
describe('rgbToHsl / hslToRgb 互转', () => {
  it('蓝色 #3ca7ff → HSL → RGB 误差 < 1', () => {
    const [r, g, b] = [60, 167, 255]
    const [h, s, l] = rgbToHsl(r, g, b)
    expect(h).toBeGreaterThanOrEqual(0)
    expect(h).toBeLessThanOrEqual(360)
    expect(s).toBeGreaterThanOrEqual(0)
    expect(s).toBeLessThanOrEqual(100)
    expect(l).toBeGreaterThanOrEqual(0)
    expect(l).toBeLessThanOrEqual(100)
    const [r2, g2, b2] = hslToRgb(h, s, l)
    expect(Math.abs(r - r2)).toBeLessThanOrEqual(1)
    expect(Math.abs(g - g2)).toBeLessThanOrEqual(1)
    expect(Math.abs(b - b2)).toBeLessThanOrEqual(1)
  })

  it('红色 #ff0000 → HSL → RGB 误差 < 1', () => {
    const [r, g, b] = [255, 0, 0]
    const [h, s, l] = rgbToHsl(r, g, b)
    const [r2, g2, b2] = hslToRgb(h, s, l)
    expect(Math.abs(r - r2)).toBeLessThanOrEqual(1)
    expect(Math.abs(g - g2)).toBeLessThanOrEqual(1)
    expect(Math.abs(b - b2)).toBeLessThanOrEqual(1)
  })

  it('白色 → HSL → RGB 误差 < 1', () => {
    const [r, g, b] = [255, 255, 255]
    const [h, s, l] = rgbToHsl(r, g, b)
    const [r2, g2, b2] = hslToRgb(h, s, l)
    expect(Math.abs(r - r2)).toBeLessThanOrEqual(1)
    expect(Math.abs(g - g2)).toBeLessThanOrEqual(1)
    expect(Math.abs(b - b2)).toBeLessThanOrEqual(1)
  })

  it('黑色 → HSL → RGB 误差 < 1', () => {
    const [r, g, b] = [0, 0, 0]
    const [h, s, l] = rgbToHsl(r, g, b)
    const [r2, g2, b2] = hslToRgb(h, s, l)
    expect(Math.abs(r - r2)).toBeLessThanOrEqual(1)
    expect(Math.abs(g - g2)).toBeLessThanOrEqual(1)
    expect(Math.abs(b - b2)).toBeLessThanOrEqual(1)
  })
})

// ==================== isValidHex ====================
describe('isValidHex', () => {
  it('接受合法的 #rrggbb', () => {
    expect(isValidHex('#3ca7ff')).toBe(true)
    expect(isValidHex('#000000')).toBe(true)
    expect(isValidHex('#ffffff')).toBe(true)
    expect(isValidHex('#FF5500')).toBe(true)
  })

  it('接受合法的 #rgb', () => {
    expect(isValidHex('#f00')).toBe(true)
    expect(isValidHex('#abc')).toBe(true)
    expect(isValidHex('#FFF')).toBe(true)
  })

  it('拒绝没有 # 前缀的', () => {
    expect(isValidHex('3ca7ff')).toBe(false)
    expect(isValidHex('abc')).toBe(false)
  })

  it('拒绝非法字符', () => {
    expect(isValidHex('#xyz123')).toBe(false)
    expect(isValidHex('#12')).toBe(false)
    expect(isValidHex('#1234')).toBe(false)
    expect(isValidHex('#12345')).toBe(false)
    expect(isValidHex('#1234567')).toBe(false)
  })

  it('拒绝空串', () => {
    expect(isValidHex('')).toBe(false)
  })
})

// ==================== adjustHsl ====================
describe('adjustHsl', () => {
  it('调整 saturation 和 lightness', () => {
    const result = adjustHsl('#3ca7ff', 0, +5, -10)
    const [r, g, b] = hexToRgb(result)
    expect(r).toBeGreaterThanOrEqual(0)
    expect(r).toBeLessThanOrEqual(255)
    expect(g).toBeGreaterThanOrEqual(0)
    expect(g).toBeLessThanOrEqual(255)
    expect(b).toBeGreaterThanOrEqual(0)
    expect(b).toBeLessThanOrEqual(255)
  })

  it('clamp s 不会超出 [0, 100]', () => {
    // 极端: 从黑 #000 加很多 s → 应该 clamp
    const result1 = adjustHsl('#000000', 0, +200, 50)
    expect(isValidHex(result1)).toBe(true)
    // 极端: 从纯色减很多 s → 应该 clamp
    const result2 = adjustHsl('#ff0000', 0, -200, 0)
    expect(isValidHex(result2)).toBe(true)
  })

  it('clamp l 不会超出 [0, 100]', () => {
    // 极端: 从白 #fff 加 l → 应该 clamp
    const result1 = adjustHsl('#ffffff', 0, 0, +50)
    expect(isValidHex(result1)).toBe(true)
    // 极端: 从黑 #000 减 l → 应该 clamp
    const result2 = adjustHsl('#000000', 0, 0, -50)
    expect(isValidHex(result2)).toBe(true)
  })

  it('不调整时结果接近原色（往返精度误差 < 3 RGB 单位）', () => {
    const result = adjustHsl('#3ca7ff', 0, 0, 0)
    const [r1, g1, b1] = hexToRgb('#3ca7ff')
    const [r2, g2, b2] = hexToRgb(result)
    expect(Math.abs(r1 - r2)).toBeLessThanOrEqual(3)
    expect(Math.abs(g1 - g2)).toBeLessThanOrEqual(3)
    expect(Math.abs(b1 - b2)).toBeLessThanOrEqual(3)
  })
})

// ==================== derivePalette ====================
describe('derivePalette', () => {
  it('浅色模式派生 4 阶色板', () => {
    const palette = derivePalette('#3ca7ff', 'light')
    expect(palette.base).toBe('#3ca7ff')
    // 所有值都是合法 hex
    expect(isValidHex(palette.dark)).toBe(true)
    expect(isValidHex(palette.disabled)).toBe(true)
    expect(isValidHex(palette.light)).toBe(true)
    // dark 应该比 base 深（lightness 更低）
    const [, , baseL] = rgbToHsl(...hexToRgb(palette.base))
    const [, , darkL] = rgbToHsl(...hexToRgb(palette.dark))
    expect(darkL).toBeLessThan(baseL)
    // disabled 应该比 base 浅（lightness 更高）
    const [, , disabledL] = rgbToHsl(...hexToRgb(palette.disabled))
    expect(disabledL).toBeGreaterThan(baseL)
    // light 应该最浅
    const [, , lightL] = rgbToHsl(...hexToRgb(palette.light))
    expect(lightL).toBeGreaterThan(disabledL)
  })

  it('暗色模式派生 4 阶色板', () => {
    const palette = derivePalette('#3ca7ff', 'dark')
    expect(palette.base).toBe('#3ca7ff')
    // dark/disabled/light 的 hex 或 rgba
    expect(isValidHex(palette.dark)).toBe(true)
    expect(isValidHex(palette.disabled)).toBe(true)
    // light 是 rgba 格式
    expect(palette.light).toBe('rgba(60, 167, 255, 0.15)')
  })

  it('暗色 light 阶是 rgba 半透明', () => {
    const palette = derivePalette('#ff6b6b', 'dark')
    expect(palette.light).toBe('rgba(255, 107, 107, 0.15)')
  })

  it('衍生色板与现有 theme.scss 默认值偏差可控', () => {
    // 测试 primary 色板
    const palette = derivePalette('#3ca7ff', 'light')
    // 用欧氏距离判断偏差
    const dist = (hex1: string, hex2: string) => {
      const [r1, g1, b1] = hexToRgb(hex1)
      const [r2, g2, b2] = hexToRgb(hex2)
      return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
    }
    // base 应该精确匹配
    expect(palette.base).toBe('#3ca7ff')
    // dark 与 theme.scss 的 #208ee8 偏差 < 12%
    const darkDist = dist(palette.dark, '#208ee8')
    expect(darkDist / 441).toBeLessThan(0.12)
    // disabled 与 #a8d8ff 偏差 < 12%
    const disabledDist = dist(palette.disabled, '#a8d8ff')
    expect(disabledDist / 441).toBeLessThan(0.12)
    // light 与 #e9f6ff 偏差 < 12%
    const lightDist = dist(palette.light, '#e9f6ff')
    expect(lightDist / 441).toBeLessThan(0.12)
  })

  it('黑色边界 #000000 不崩溃', () => {
    const palette = derivePalette('#000000', 'light')
    expect(palette.base).toBe('#000000')
    // 派生值应该都是合法颜色
    expect(isValidHex(palette.dark)).toBe(true)
    expect(isValidHex(palette.disabled)).toBe(true)
    expect(isValidHex(palette.light)).toBe(true)
  })

  it('白色边界 #ffffff 不崩溃', () => {
    const palette = derivePalette('#ffffff', 'light')
    expect(palette.base).toBe('#ffffff')
    expect(isValidHex(palette.dark)).toBe(true)
    expect(isValidHex(palette.disabled)).toBe(true)
    expect(isValidHex(palette.light)).toBe(true)
  })

  it('暗色边界 #000000 不崩溃', () => {
    const palette = derivePalette('#000000', 'dark')
    expect(palette.base).toBe('#000000')
    expect(isValidHex(palette.dark)).toBe(true)
    expect(isValidHex(palette.disabled)).toBe(true)
    // 黑色的 rgba
    expect(palette.light).toBe('rgba(0, 0, 0, 0.15)')
  })
})
