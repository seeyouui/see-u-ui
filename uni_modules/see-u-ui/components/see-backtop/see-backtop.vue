<template>
  <view v-show="isVisible" class="see-backtop" :class="{ 'see-backtop--custom': isCustom }" :style="backtopStyle" @tap="handleClick">
    <slot>
      <view class="see-backtop__icon">
        <text class="see-backtop__arrow">↑</text>
      </view>
    </slot>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
// #ifndef H5
import { onPageScroll } from '@dcloudio/uni-app'
// #endif
import type { SeeBackTopProps, SeeBackTopEmits } from './type'

defineOptions({ name: 'SeeBackTop' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeBackTopProps>(), {
  visibilityHeight: 200,
  right: 20,
  bottom: 80,
  zIndex: 999,
  duration: 300,
  target: '',
  isCustom: false
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeBackTopEmits>()

/** ---------- state ---------- */
const isVisible = ref(false)

/** ---------- computed ---------- */
const backtopStyle = computed(() => ({
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
  zIndex: String(props.zIndex)
}))

/** ---------- methods ---------- */
const updateVisibility = (scrollTop: number) => {
  isVisible.value = scrollTop > props.visibilityHeight
}

// #ifdef H5
// rAF 节流，避免 H5 滚动事件高频触发
let rafId = 0
const handleScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
    updateVisibility(scrollTop)
  })
}
// #endif

const handleClick = () => {
  emit('onClick')
  uni.pageScrollTo({
    scrollTop: 0,
    duration: props.duration
  })
}

/** ---------- lifecycle ---------- */
// #ifndef H5
// 小程序 / App 端使用 uni 的页面级 onPageScroll 生命周期
onPageScroll((e) => {
  updateVisibility(e.scrollTop)
})
// #endif

onMounted(() => {
  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    // 初始化检查
    handleScroll()
  }
  // #endif
})

onUnmounted(() => {
  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
  // #endif
})
</script>

<style lang="scss" scoped>
.see-backtop {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--see-backtop-size, 80rpx);
  height: var(--see-backtop-size, 80rpx);
  background: var(--see-backtop-bg, var(--see-bg-color));
  border-radius: 50%;
  box-shadow: var(--see-backtop-shadow, var(--see-shadow-medium));
  transition: opacity 0.3s ease;

  &--custom {
    background: transparent;
    box-shadow: none;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__arrow {
    font-size: 36rpx;
    color: var(--see-backtop-icon-color, var(--see-primary));
    font-weight: bold;
  }
}
</style>
