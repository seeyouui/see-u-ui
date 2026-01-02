import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { conditionalCompilationPlugin } from './tests/plugins/conditional-compilation'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 测试环境默认使用 H5 平台
const TEST_PLATFORM = process.env.UNI_PLATFORM || 'H5'

export default defineConfig({
  plugins: [vue(), conditionalCompilationPlugin(TEST_PLATFORM)],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'unpackage']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/uni_modules': resolve(__dirname, './uni_modules')
    }
  }
})
