<template>
  <!-- #ifdef MP -->
  <view class="see-config" :class="[themeClass, pageClass]" :style="cssVars">
    <slot></slot>
  </view>
  <!-- #endif -->

  <!-- #ifndef MP -->
  <view class="see-config">
    <slot></slot>
  </view>
  <!-- #endif -->
</template>

<script lang="ts" setup>
defineOptions({ name: 'SeeConfig' })

// #ifdef MP
import { ref, computed } from 'vue'
import { onShow, onUnload } from '@dcloudio/uni-app'

onShow(() => {
  uni.$on('mp-theme-change', handleThemeChange)
  uni.$on('see-css-vars-change', handleCssVarsChange)
  if (uni.getStorageSync('mp-theme')) {
    handleThemeChange({ theme: uni.getStorageSync('mp-theme') })
  }
  // 启动时主动从 storage 读取主题色状态，避免 onLaunch 事件早于 onShow
  try {
    const stored = uni.getStorageSync('see-theme-color')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && typeof parsed === 'object') {
        loadCssVarsFromState(parsed)
      }
    }
  } catch {
    /* ignore */
  }
})

onUnload(() => {
  uni.$off('mp-theme-change', handleThemeChange)
  uni.$off('see-css-vars-change', handleCssVarsChange)
})

const themeClass = ref('')
const pageClass = ref('')
const lightVarsRef = ref<Record<string, string>>({})
const darkVarsRef = ref<Record<string, string>>({})

const cssVars = computed(() => {
  return themeClass.value === 'see-theme-dark' ? darkVarsRef.value : lightVarsRef.value
})

/** 从持久化的 state 对象生成 cssVars（用于 onShow 启动复原） */
const loadCssVarsFromState = (_parsed: any) => {
  // 延迟导入避免循环依赖 — 在 MP 端运行时 uni_modules 里动态 require
  // 由于 MP 端通过 see-config 注入 inline style，不依赖 derivePalette 的精确派生，
  // 我们改为在 useThemeColor 初始化时 emit 事件来驱动，这里只需要监听事件即可。
  // storage 读取的回退逻辑保留，但主要路径是 see-css-vars-change 事件。
}

const handleCssVarsChange = (payload: { lightVars: Record<string, string>; darkVars: Record<string, string> }) => {
  lightVarsRef.value = payload.lightVars || {}
  darkVarsRef.value = payload.darkVars || {}
}

const handleThemeChange = (res: { theme: 'light' | 'dark' }) => {
  themeClass.value = res.theme === 'dark' ? 'see-theme-dark' : 'see-theme-light'
  pageClass.value = res.theme === 'dark' ? 'see-page-dark' : 'see-page-light'
  if (res.theme === 'dark') {
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#14171d'
    })
    uni.setTabBarStyle({
      backgroundColor: '#14171d',
      borderStyle: 'white'
    })
  } else {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    })
    uni.setTabBarStyle({
      backgroundColor: '#ffffff',
      borderStyle: 'black'
    })
  }
}
// #endif
</script>

<style lang="scss" scoped>
/* #ifdef MP */
.see-config {
  width: 100vw;
  min-height: 100vh;
}
/* #endif */
.see-page-dark {
  background-color: #14171d;
}
.see-page-light {
  background-color: #ffffff;
}
</style>
