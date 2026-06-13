<script setup>
import { watch, onMounted, onUnmounted, nextTick, ref } from 'vue'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useI18n, applyThemeColorOnLaunch } from '@/uni_modules/see-u-ui'

const { t, locale, setLocale } = useI18n()

/** 防止 parent → iframe 消息触发的变更再回传给 parent（避免死循环） */
const fromParent = ref(false)

// ==================== tabBar ====================

const updateTabBar = () => {
  uni.setTabBarItem({ index: 0, text: t('tabbar.components') })
  uni.setTabBarItem({ index: 1, text: t('tabbar.config') })
}

onMounted(() => nextTick(updateTabBar))
watch(locale, () => nextTick(updateTabBar))

// ==================== parent ↔ iframe 双向通信 ====================

/**
 * 向父窗口（VitePress 文档站）发送消息
 */
const postToParent = (msg) => {
  // #ifdef H5
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(msg, '*')
  }
  // #endif
}

// 监听 iframe 内的语言变化 → 推给文档站
watch(locale, (val) => {
  if (fromParent.value) return
  postToParent({ type: 'ui-locale', locale: val })
})

// 监听 iframe 内的主题变化 → 推给文档站
// 注意：useTheme() 不是单例，各组件实例独立，所以用 MutationObserver 直接监听 DOM class
let themeObserver = null
const setupThemeObserver = () => {
  // #ifdef H5
  themeObserver = new MutationObserver(() => {
    if (fromParent.value) return
    const cls = document.documentElement.classList
    let theme
    if (cls.contains('see-theme-dark')) {
      theme = 'dark'
    } else if (cls.contains('see-theme-light')) {
      theme = 'light'
    } else {
      // 跟随系统模式：两个 class 都没有，用 matchMedia 判断
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    postToParent({ type: 'ui-theme', theme })
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
  // #endif
}
const teardownThemeObserver = () => {
  // #ifdef H5
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
  // #endif
}
onMounted(setupThemeObserver)
onUnmounted(teardownThemeObserver)

onLaunch(() => {
  console.log('App Launch')

  // 在最早期复原自定义主题色，避免颜色闪烁
  applyThemeColorOnLaunch()

  updateTabBar()

  // #ifdef APP
  plus.nativeUI.setUIStyle('auto')
  // #endif

  // #ifdef H5
  window.addEventListener('message', (event) => {
    const data = event.data
    if (!data) return

    // 主题切换（来自 VitePress 文档站）
    if (data.type === 'vp-theme') {
      fromParent.value = true
      if (data.theme === 'dark') {
        document.documentElement.classList.remove('see-theme-light')
        document.documentElement.classList.add('see-theme-dark')
      } else {
        document.documentElement.classList.remove('see-theme-dark')
        document.documentElement.classList.add('see-theme-light')
      }
      // 同步 useTheme 实例状态，config 页面按钮才能正确高亮
      uni.$emit('see-theme-sync', { theme: data.theme })
      fromParent.value = false
    }

    // 语言切换（来自 VitePress 文档站）
    if (data.type === 'vp-locale') {
      fromParent.value = true
      setLocale(data.locale === 'zh-CN' ? 'zh-CN' : 'en')
      fromParent.value = false
    }
  })
  // #endif
})

onShow(() => {
  console.log('App Show')
  updateTabBar()
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* 每个页面公共css */
@import '@/uni_modules/see-u-ui/theme.scss';

/* 确保全局背景色生效 */
html,
body,
page {
  min-height: 100%;
  background-color: var(--see-bg-color);
  color: var(--see-main-color);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

/* 隐藏所有页面的滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

/* 通用隐藏滚动条 */
page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* #ifdef H5 */
* {
  scrollbar-width: none !important;
}
/* #endif */

page::-webkit-scrollbar {
  display: none;
}
</style>
