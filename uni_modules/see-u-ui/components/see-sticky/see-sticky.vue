<template>
  <!-- 占位容器：始终留在文档流中，fixed 时用它撑起原始高度，避免布局跳动 -->
  <view class="see-sticky__placeholder" :style="placeholderStyle">
    <view :class="['see-sticky', { 'see-sticky--fixed': isFixed }]" :style="stickyStyle">
      <slot />
    </view>
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
// 内容高度：fixed 时占位元素用它撑起原始高度，避免布局塌陷
const contentHeight = ref(0)
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

// fixed 时占位元素保留原始高度，非 fixed 时高度由内容自然撑开
const placeholderStyle = computed(() => {
  if (!isFixed.value || contentHeight.value === 0) return {}
  return { height: `${contentHeight.value}px` }
})

// 统一的滚动处理函数（使用 requestAnimationFrame 节流）
// 关键：始终以占位元素(.see-sticky__placeholder)测量原始位置。
// 内容切 fixed 后其自身 top 恒等于 offsetTop，无法用于判断退出吸顶；
// 占位元素留在文档流中，其 top 能真实反映滚动位置，据此判断进入/退出。
const handleScroll = (scrollPos?: number) => {
  if (!props.isEnabled || ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const query = uni.createSelectorQuery()
    query.select('.see-sticky__placeholder').boundingClientRect()
    query.select('.see-sticky').boundingClientRect()
    query.exec((res) => {
      const placeholderRect = res && res[0]
      const contentRect = res && res[1]
      if (placeholderRect) {
        // 记录内容原始高度（未 fixed 时占位=内容高度）
        if (!isFixed.value && contentRect && contentRect.height) {
          contentHeight.value = contentRect.height
        }
        const shouldFix = placeholderRect.top <= props.offsetTop
        scrollTop.value = scrollPos ?? placeholderRect.top
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
.see-sticky__placeholder {
  box-sizing: border-box;
}

.see-sticky {
  box-sizing: border-box;

  &--fixed {
    background-color: var(--see-bg-color);
  }
}
</style>
