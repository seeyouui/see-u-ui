<script>
export default {
  onLaunch: function () {
    console.log('App Launch')

    // #ifdef APP
    plus.nativeUI.setUIStyle('auto')
    // #endif

    // #ifdef H5
    window.addEventListener('message', (event) => {
      const data = event.data
      if (!data || data.type !== 'vp-theme') return
      const targetTheme = data.theme

      // 切换 CSS 类名
      if (targetTheme === 'dark') {
        document.documentElement.classList.remove('see-theme-light')
        document.documentElement.classList.add('see-theme-dark')
      } else {
        document.documentElement.classList.remove('see-theme-dark')
        document.documentElement.classList.add('see-theme-light')
      }
    })
    // #endif
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 每个页面公共css */
@import '@/uni_modules/see-u-ui/theme.scss';

/* 确保全局背景色生效 */
html,
body,
page {
  /* 保证背景色铺满，防止漏出白底 */
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
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
}

/* #ifdef H5 */
* {
  scrollbar-width: none !important;
}
/* #endif */

page::-webkit-scrollbar {
  display: none; /* Chrome, Safari 和 Opera */
}
</style>
