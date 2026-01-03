<template>
  <!-- #ifdef MP -->
  <view class="see-config" :class="[themeClass, pageClass]">
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
// #ifdef MP
import { ref } from 'vue'
import { onShow, onUnload } from '@dcloudio/uni-app'

onShow(() => {
  console.log('config onShow')
  uni.$on('mp-theme-change', handleThemeChange)
  if (uni.getStorageSync('mp-theme')) {
    handleThemeChange({ theme: uni.getStorageSync('mp-theme') })
  }
})

onUnload(() => {
  uni.$off('mp-theme-change', handleThemeChange)
})

const themeClass = ref('')
const pageClass = ref('')

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
