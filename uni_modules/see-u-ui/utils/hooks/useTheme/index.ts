import { ref, onMounted } from 'vue'

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
    document.documentElement.classList.remove('see-theme-light')
    document.documentElement.classList.remove('see-theme-dark')
    // #endif

    // #ifdef APP
    plus.nativeUI.setUIStyle('auto')
    // #endif
  }

  // 生命周期管理
  onMounted(() => {
    uni.onThemeChange(handleThemeChange)

    // 初始化时应用主题
    if (themeMode.value === 'system') {
      const systemTheme = uni.getSystemInfoSync().theme

      // console.log(uni.getSystemInfoSync())
      // console.log(uni.getSystemInfoSync())
      // console.log(uni.getSystemInfoSync())

      isSwitchChecked.value = systemTheme === 'dark'
      applyTheme(systemTheme === 'dark')
    } else {
      applyTheme(isSwitchChecked.value)
    }
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
