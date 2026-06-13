import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 主题切换 Hook
 * @returns 返回主题相关的响应式状态和方法
 */
export function useTheme() {
  // 是否手动切换
  const isManual = ref(false)
  // 当前主题状态
  const isSwitchChecked = ref(uni.getSystemInfoSync().theme === 'dark')
  // 当前模式类型：'light' | 'dark' | 'system'
  const themeMode = ref<'light' | 'dark' | 'system'>('system')

  // 微信小程序默认状态
  // #ifdef MP
  if (uni.getStorageSync('mp-theme-mode')) {
    const savedMode = uni.getStorageSync('mp-theme-mode')
    themeMode.value = savedMode
    if (savedMode !== 'system') {
      isManual.value = true
      isSwitchChecked.value = savedMode === 'dark'
    }
  }
  // #endif

  // H5 端从 localStorage 恢复主题模式，防止页面跳转后丢失手动设置
  // #ifdef H5
  try {
    const savedMode = localStorage.getItem('see-ui-theme-mode')
    if (savedMode === 'light' || savedMode === 'dark') {
      themeMode.value = savedMode
      isManual.value = true
      isSwitchChecked.value = savedMode === 'dark'
    }
  } catch {
    /* ignore */
  }
  // #endif

  // 应用主题
  const applyTheme = (isDark: boolean) => {
    // #ifdef H5
    if (isDark) {
      document.documentElement.classList.remove('see-theme-light')
      document.documentElement.classList.add('see-theme-dark')
    } else {
      document.documentElement.classList.remove('see-theme-dark')
      document.documentElement.classList.add('see-theme-light')
    }
    // #endif

    // #ifdef APP
    if (themeMode.value !== 'system') {
      plus.nativeUI.setUIStyle(isDark ? 'dark' : 'light')
    }
    // #endif

    // #ifdef MP
    uni.$emit('mp-theme-change', { theme: isDark ? 'dark' : 'light' })
    uni.setStorageSync('mp-theme', isDark ? 'dark' : 'light')
    // #endif
  }

  // 监听系统主题变化
  const handleThemeChange = ({ theme }: { theme: string }) => {
    // 只有在跟随系统模式下才响应系统主题变化
    if (themeMode.value === 'system') {
      isSwitchChecked.value = theme === 'dark'
      applyTheme(theme === 'dark')
    }
  }

  // 切换主题
  const changeSwitch = () => {
    isManual.value = true
    isSwitchChecked.value = !isSwitchChecked.value
    themeMode.value = isSwitchChecked.value ? 'dark' : 'light'
    applyTheme(isSwitchChecked.value)

    // #ifdef MP
    uni.setStorageSync('mp-theme-mode', themeMode.value)
    // #endif
    // #ifdef H5
    try {
      localStorage.setItem('see-ui-theme-mode', themeMode.value)
    } catch {
      /* ignore */
    }
    // #endif
  }

  // 设置为浅色模式
  const setLightMode = () => {
    isManual.value = true
    themeMode.value = 'light'
    isSwitchChecked.value = false
    applyTheme(false)

    // #ifdef MP
    uni.setStorageSync('mp-theme-mode', 'light')
    // #endif
    // #ifdef H5
    try {
      localStorage.setItem('see-ui-theme-mode', 'light')
    } catch {
      /* ignore */
    }
    // #endif
  }

  // 设置为暗黑模式
  const setDarkMode = () => {
    isManual.value = true
    themeMode.value = 'dark'
    isSwitchChecked.value = true
    applyTheme(true)

    // #ifdef MP
    uni.setStorageSync('mp-theme-mode', 'dark')
    // #endif
    // #ifdef H5
    try {
      localStorage.setItem('see-ui-theme-mode', 'dark')
    } catch {
      /* ignore */
    }
    // #endif
  }

  // 设置为跟随系统模式
  const setFollowSystem = () => {
    isManual.value = false
    themeMode.value = 'system'
    const systemTheme = uni.getSystemInfoSync().theme
    isSwitchChecked.value = systemTheme === 'dark'
    applyTheme(systemTheme === 'dark')

    // #ifdef MP
    uni.setStorageSync('mp-theme-mode', 'system')
    // #endif

    // #ifdef H5
    try {
      localStorage.removeItem('see-ui-theme-mode')
    } catch {
      /* ignore */
    }
    document.documentElement.classList.remove('see-theme-light')
    document.documentElement.classList.remove('see-theme-dark')
    // #endif

    // #ifdef APP
    plus.nativeUI.setUIStyle('auto')
    // #endif
  }

  // 接收来自文档站（postMessage）的外部主题同步
  const handleExternalSync = (res: { theme: string }) => {
    isManual.value = true
    themeMode.value = res.theme as 'light' | 'dark'
    isSwitchChecked.value = res.theme === 'dark'
    // #ifdef H5
    try {
      localStorage.setItem('see-ui-theme-mode', res.theme)
    } catch {
      /* ignore */
    }
    // #endif
  }

  // 生命周期管理
  onMounted(() => {
    uni.onThemeChange(handleThemeChange)

    // #ifdef H5
    uni.$on('see-theme-sync', handleExternalSync)
    // #endif

    // 初始化时应用主题
    if (themeMode.value === 'system') {
      const systemTheme = uni.getSystemInfoSync().theme
      isSwitchChecked.value = systemTheme === 'dark'
      applyTheme(systemTheme === 'dark')
    } else {
      applyTheme(isSwitchChecked.value)
    }
  })

  onUnmounted(() => {
    uni.offThemeChange(handleThemeChange)

    // #ifdef H5
    uni.$off('see-theme-sync', handleExternalSync)
    // #endif
  })

  return {
    isManual,
    isSwitchChecked,
    themeMode,
    changeSwitch,
    setLightMode,
    setDarkMode,
    setFollowSystem
  }
}
