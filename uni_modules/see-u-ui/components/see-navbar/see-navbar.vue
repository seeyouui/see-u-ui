<template>
  <view v-if="isVisible" class="see-navbar" :class="navbarClass" :style="navbarStyle">
    <!-- 安全区占位 -->
    <!-- #ifdef H5 -->
    <view v-if="safeAreaInsetTop" class="see-navbar__statusbar" style="padding-top: env(safe-area-inset-top)" />
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <view v-if="safeAreaInsetTop" class="see-navbar__statusbar" :style="{ height: statusBarHeight + 'px' }" />
    <!-- #endif -->

    <!-- 导航栏主体 -->
    <view class="see-navbar__content" :style="contentStyle">
      <!-- 左侧区域 -->
      <view class="see-navbar__left" @tap="handleLeftClick">
        <slot name="left">
          <view v-if="leftArrow" class="see-navbar__arrow">
            <text class="see-navbar__arrow-icon">‹</text>
          </view>
          <text v-if="leftText" class="see-navbar__left-text">{{ leftText }}</text>
        </slot>
      </view>

      <!-- 中间区域 -->
      <view class="see-navbar__center">
        <slot name="center">
          <!-- 搜索模式 -->
          <view v-if="isSearch" class="see-navbar__search">
            <text class="see-navbar__search-icon">🔍</text>
            <input
              class="see-navbar__search-input"
              type="text"
              :placeholder="searchPlaceholder"
              :value="searchQuery"
              @input="handleSearchInput"
              @confirm="handleSearchConfirm"
            />
          </view>
          <!-- 标题模式 -->
          <text v-else class="see-navbar__title" :style="titleStyle">{{ displayTitle }}</text>
        </slot>
      </view>

      <!-- 右侧区域 -->
      <view class="see-navbar__right" @tap="handleRightClick">
        <slot name="right">
          <text v-if="displayRightText" class="see-navbar__right-text">{{ displayRightText }}</text>
          <text v-if="rightIcon" class="see-navbar__right-icon">{{ rightIcon }}</text>
        </slot>
      </view>
    </view>
  </view>

  <!-- 占位元素 -->
  <view v-if="placeholder && isFixed && isVisible" class="see-navbar__placeholder" :style="placeholderStyle" />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import type { SeeNavbarProps, SeeNavbarEmits, SeeNavbarExpose } from './type'

defineOptions({ name: 'SeeNavbar' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeNavbarProps>(), {
  title: '',
  isFixed: true,
  isShowLeft: true,
  isShowRight: true,
  leftText: '',
  leftArrow: true,
  rightText: '',
  rightIcon: '',
  isSearch: false,
  searchPlaceholder: '搜索',
  isFrosted: false,
  zIndex: 990,
  safeAreaInsetTop: true,
  bgColor: '',
  titleColor: '',
  border: true,
  placeholder: true
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeNavbarEmits>()

/** ---------- state ---------- */
const isVisible = ref(true)
const displayTitle = ref(props.title)
const displayRightText = ref(props.rightText)
const searchQuery = ref('')
const statusBarHeight = ref(20)

// 保持 props 与内部展示值的响应式同步，避免父组件更新后视图不更新
watch(
  () => props.title,
  (val) => {
    displayTitle.value = val
  }
)
watch(
  () => props.rightText,
  (val) => {
    displayRightText.value = val
  }
)

onMounted(() => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 20
  } catch {
    statusBarHeight.value = 20
  }
})

/** ---------- computed ---------- */
const navbarClass = computed(() => ({
  'see-navbar--fixed': props.isFixed,
  'see-navbar--frosted': props.isFrosted,
  'see-navbar--border': props.border,
  'see-navbar--search': props.isSearch
}))

const navbarStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgColor) {
    style.background = props.isFrosted ? `${props.bgColor}cc` : props.bgColor
  }
  style.zIndex = String(props.zIndex)
  return style
})

const contentStyle = computed(() => {
  const style: Record<string, string> = {}
  style.height = 'var(--see-navbar-height)'
  return style
})

const titleStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.titleColor) {
    style.color = props.titleColor
  }
  return style
})

const placeholderStyle = computed(() => ({
  height: `calc(var(--see-navbar-height) + ${props.safeAreaInsetTop ? statusBarHeight.value + 'px' : '0px'})`
}))

/** ---------- methods ---------- */
const handleLeftClick = () => {
  emit('onLeftClick')
  emit('onBack')
}

const handleRightClick = () => {
  emit('onRightClick', 0)
}

const handleSearchInput = (e: any) => {
  searchQuery.value = e.detail?.value || e.target?.value || ''
}

const handleSearchConfirm = () => {
  emit('onSearch', searchQuery.value)
}

const setTitle = (title: string) => {
  displayTitle.value = title
}

const setRightText = (text: string) => {
  displayRightText.value = text
}

const show = () => {
  isVisible.value = true
}

const hide = () => {
  isVisible.value = false
}

/** ---------- expose ---------- */
defineExpose<SeeNavbarExpose>({
  setTitle,
  setRightText,
  show,
  hide
})
</script>

<style lang="scss" scoped>
.see-navbar {
  position: relative;
  width: 100%;
  background: var(--see-navbar-bg, var(--see-bg-color));
  box-sizing: border-box;

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  &--frosted {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  &--border {
    border-bottom: 1px solid var(--see-navbar-border-color, var(--see-border-four-color));
  }

  &__statusbar {
    width: 100%;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    box-sizing: border-box;
    position: relative;
  }

  &__left {
    display: flex;
    align-items: center;
    min-width: 120rpx;
    z-index: 1;
  }

  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56rpx;
    height: 56rpx;
  }

  &__arrow-icon {
    font-size: 40rpx;
    color: var(--see-navbar-title-color, var(--see-main-color));
    font-weight: bold;
  }

  &__left-text {
    font-size: 28rpx;
    color: var(--see-navbar-title-color, var(--see-main-color));
    margin-left: 8rpx;
  }

  &__center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 120rpx;
    right: 120rpx;
    top: 0;
    bottom: 0;
  }

  &__title {
    font-size: 34rpx;
    font-weight: 600;
    color: var(--see-navbar-title-color, var(--see-main-color));
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__search {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64rpx;
    background: var(--see-info-light, #f2f3f5);
    border-radius: 32rpx;
    padding: 0 24rpx;
    box-sizing: border-box;
  }

  &__search-icon {
    font-size: 28rpx;
    margin-right: 12rpx;
    opacity: 0.5;
  }

  &__search-input {
    flex: 1;
    font-size: 28rpx;
    color: var(--see-main-color);
    background: transparent;
    border: none;
    outline: none;
    height: 100%;
  }

  &__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 120rpx;
    z-index: 1;
  }

  &__right-text {
    font-size: 28rpx;
    color: var(--see-navbar-title-color, var(--see-main-color));
  }

  &__right-icon {
    font-size: 36rpx;
    color: var(--see-navbar-title-color, var(--see-main-color));
    margin-left: 16rpx;
  }

  &__placeholder {
    width: 100%;
    visibility: hidden;
  }
}
</style>
