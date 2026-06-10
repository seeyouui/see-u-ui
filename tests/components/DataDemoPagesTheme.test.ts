import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pages = [
  'pages/seeLineProgress/index.vue',
  'pages/seeCountDown/index.vue',
  'pages/seeCountTo/index.vue',
  'pages/seeList/index.vue',
  'pages/seeVirtualList/index.vue',
  'pages/seeTable/index.vue'
]

describe('data component demo page theme styles', () => {
  it('uses only theme variables, no hardcoded colors', () => {
    pages.forEach((page) => {
      const source = readFileSync(resolve(process.cwd(), page), 'utf-8')
      expect(source).not.toContain('--see-card-bg')
      expect(source).not.toContain('linear-gradient(135deg, #fff, #f8fbff)')
      expect(source).not.toContain("'#2979ff'")
      expect(source).not.toContain("'#67c23a'")
      expect(source).toMatch(/background:\s*var\(--see-bg-color\)/)
      expect(source).toMatch(/box-shadow:\s*var\(--see-card-shadow\)/)
      expect(source).toMatch(/color:\s*var\(--see-(primary|tips-color|success)\)/)
    })
  })
})
