export type ThemeColorToken = 'primary' | 'success' | 'warning' | 'error'
export type ThemeMode = 'light' | 'dark'

export interface ColorPalette {
  base: string
  dark: string
  disabled: string
  light: string
}

/**
 * hex (#rgb / #rrggbb) → [r, g, b] (0-255)
 */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  let r: number, g: number, b: number
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16)
    g = parseInt(h[1] + h[1], 16)
    b = parseInt(h[2] + h[2], 16)
  } else {
    r = parseInt(h.substring(0, 2), 16)
    g = parseInt(h.substring(2, 4), 16)
    b = parseInt(h.substring(4, 6), 16)
  }
  return [r, g, b]
}

/**
 * [r, g, b] → #rrggbb（小写）
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)))
    return clamped.toString(16).padStart(2, '0')
  }
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

/**
 * [r, g, b] (0-255) → [h, s, l] (h: 0-360, s/l: 0-100)
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255

  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    switch (max) {
      case rn:
        h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6
        break
      case gn:
        h = ((bn - rn) / delta + 2) / 6
        break
      case bn:
        h = ((rn - gn) / delta + 4) / 6
        break
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

/**
 * [h, s, l] → [r, g, b]
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hn = h / 360
  const sn = s / 100
  const ln = l / 100

  if (sn === 0) {
    const v = Math.round(ln * 255)
    return [v, v, v]
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q

  const r = hue2rgb(p, q, hn + 1 / 3)
  const g = hue2rgb(p, q, hn)
  const b = hue2rgb(p, q, hn - 1 / 3)

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/**
 * 校验合法 hex（#rgb / #rrggbb，大小写不限）
 */
export function isValidHex(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return false
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)
}

/**
 * 调整 HSL 三通道，自动 clamp
 */
export function adjustHsl(hex: string, dh: number, ds: number, dl: number): string {
  const [r, g, b] = hexToRgb(hex)
  const [h, s, l] = rgbToHsl(r, g, b)

  const newS = Math.max(0, Math.min(100, s + ds))
  const newL = Math.max(0, Math.min(100, l + dl))
  const newH = (h + dh + 360) % 360

  const [r2, g2, b2] = hslToRgb(newH, newS, newL)
  return rgbToHex(r2, g2, b2)
}

/**
 * 主入口：根据基色和模式派生 4 阶色板
 */
export function derivePalette(baseHex: string, mode: ThemeMode): ColorPalette {
  const [r, g, b] = hexToRgb(baseHex)

  if (mode === 'light') {
    return {
      base: baseHex,
      dark: adjustHsl(baseHex, 0, +5, -10),
      disabled: adjustHsl(baseHex, 0, -20, +25),
      light: adjustHsl(baseHex, 0, -10, +42)
    }
  }

  // dark mode
  return {
    base: baseHex,
    dark: adjustHsl(baseHex, 0, -5, -15),
    disabled: adjustHsl(baseHex, 0, -15, -30),
    light: `rgba(${r}, ${g}, ${b}, 0.15)`
  }
}
