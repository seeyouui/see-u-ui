<template>
  <view :class="['see-sticky', { 'see-sticky--fixed': isFixed }]" :style="stickyStyle">
    <slot />
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeSticky 吸顶
 * @description 使元素在页面滚动时固定在指定位置，常用于导航栏、标题栏等场景。
 * @tutorial https://www.seeuui.cn/components/sticky/
 * @property {Number} offsetTop 吸顶时距离顶部距离(px)
 * @property {Number} zIndex z-index
 * @property {Boolean} isEnabled 是否开启
 * @property {String} container 容器选择器
 * @event {Function} onScroll 滚动时触发，参数为 { isFixed, scrollTop }
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { SeeStickyProps, SeeStickyEmits } from './type'

defineOptions({ name: 'SeeSticky' })

const props = withDefaults(defineProps<SeeStickyProps>(), {
  offsetTop: 0,
  zIndex: 99,
  isEnabled: true
})

const emit = defineEmits<SeeStickyEmits>()

const isFixed = ref(false)
const scrollTop = ref(0)
let ticking = false

const stickyStyle = computed(() => {
  if (!isFixed.value) return {}

  return {
    position: 'fixed' as const,
    top: `${props.offsetTop}px`,
    left: 0,
    right: 0,
    zIndex: props.zIndex
  }
})

// 统一的滚动处理函数（使用 requestAnimationFrame 节流）
const handleScroll = (scrollPos?: number) => {
  if (!props.isEnabled || ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const query = uni.createSelectorQuery()
    query.select('.see-sticky').boundingClientRect()
    query.exec((res) => {
      if (res && res[0]) {
        const shouldFix = res[0].top <= props.offsetTop
        scrollTop.value = scrollPos ?? res[0].top
        if (shouldFix !== isFixed.value) {
          isFixed.value = shouldFix
          emit('onScroll', { isFixed: isFixed.value, scrollTop: scrollTop.value })
        }
      }
      ticking = false
    })
  })
}

// #ifdef H5
// H5 环境下使用 window.scroll 事件监听
const handleH5Scroll = () => handleScroll()
// #endif

// #ifndef H5
// 小程序/App 环境下的页面滚动回调（命名函数，便于取消监听）
const handlePageScroll = (e: { scrollTop: number }) => {
  handleScroll(e.scrollTop)
}
// #endif

onMounted(() => {
  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleH5Scroll, { passive: true })
  }
  // #endif

  // #ifndef H5
  uni.onPageScroll(handlePageScroll)
  // #endif
})

onUnmounted(() => {
  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleH5Scroll)
  }
  // #endif

  // #ifndef H5
  uni.offPageScroll(handlePageScroll)
  // #endif
})
</script>

<style lang="scss" scoped>
.see-sticky {
  box-sizing: border-box;

  &--fixed {
    background-color: var(--see-bg-color);
  }
}
</style>
