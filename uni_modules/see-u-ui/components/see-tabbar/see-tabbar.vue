<template>
  <view>
    <!-- Tabbar 主体 -->
    <view class="see-tabbar" :class="tabbarClass" :style="tabbarStyle">
      <!-- 安全区底部 -->
      <!-- #ifdef H5 -->
      <view v-if="safeAreaInsetBottom" class="see-tabbar__safe-area" style="padding-bottom: env(safe-area-inset-bottom)" />
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <view v-if="safeAreaInsetBottom" class="see-tabbar__safe-area" :style="{ height: safeAreaBottom + 'px' }" />
      <!-- #endif -->

      <!-- Tab 列表 -->
      <view class="see-tabbar__content">
        <view
          v-for="(tab, index) in internalTabs"
          :key="tab.name"
          class="see-tabbar__item"
          :class="{
            'see-tabbar__item--active': modelValue === tab.name,
            'see-tabbar__item--disabled': tab.isDisabled,
            'see-tabbar__item--center': tab.isCenter
          }"
          @tap="handleTabClick(tab, index)"
        >
          <!-- 中央凸起按钮 -->
          <view v-if="tab.isCenter" class="see-tabbar__center-btn">
            <text class="see-tabbar__center-icon">{{ tab.centerIcon || tab.icon }}</text>
          </view>

          <!-- 普通 Tab -->
          <template v-else>
            <!-- 图标 -->
            <view class="see-tabbar__icon-wrap">
              <text class="see-tabbar__icon" :style="{ color: modelValue === tab.name ? activeColorVar : inactiveColorVar }">
                {{ modelValue === tab.name && tab.activeIcon ? tab.activeIcon : tab.icon }}
              </text>
              <!-- Badge -->
              <view v-if="tab.badge !== undefined && tab.badge !== null" class="see-tabbar__badge">
                <text class="see-tabbar__badge-text">{{ tab.badge }}</text>
              </view>
              <!-- Dot -->
              <view v-if="tab.dot" class="see-tabbar__dot" />
            </view>
            <!-- 文字 -->
            <text class="see-tabbar__text" :style="{ color: modelValue === tab.name ? activeColorVar : inactiveColorVar }">
              {{ tab.text }}
            </text>
          </template>
        </view>
      </view>
    </view>

    <!-- 占位元素 -->
    <view v-if="placeholder && isFixed" class="see-tabbar__placeholder" :style="placeholderStyle" />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import type { TabbarItem, SeeTabbarProps, SeeTabbarEmits, SeeTabbarExpose } from './type'

defineOptions({ name: 'SeeTabbar' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeTabbarProps>(), {
  modelValue: '',
  tabs: () => [],
  isFixed: true,
  isFrosted: false,
  zIndex: 990,
  safeAreaInsetBottom: true,
  activeColor: '',
  inactiveColor: '',
  bgColor: '',
  border: true,
  route: false,
  placeholder: true
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeTabbarEmits>()

/** ---------- state ---------- */
const safeAreaBottom = ref(20)

// 维护一份内部 tabs 副本，避免 setBadge / clearBadge 直接 mutate props
const internalTabs = ref<TabbarItem[]>(props.tabs.map((t) => ({ ...t })))
watch(
  () => props.tabs,
  (val) => {
    internalTabs.value = val.map((t) => ({ ...t }))
  },
  { deep: true }
)

onMounted(() => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    const insets = systemInfo.safeAreaInsets
    safeAreaBottom.value = insets?.bottom ?? 0
  } catch {
    safeAreaBottom.value = 20
  }
})

/** ---------- computed ---------- */
const tabbarClass = computed(() => ({
  'see-tabbar--fixed': props.isFixed,
  'see-tabbar--frosted': props.isFrosted,
  'see-tabbar--border': props.border
}))

const tabbarStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgColor) {
    style.background = props.isFrosted ? `${props.bgColor}cc` : props.bgColor
  }
  style.zIndex = String(props.zIndex)
  return style
})

const activeColorVar = computed(() => props.activeColor || 'var(--see-tabbar-active-color, var(--see-primary))')
const inactiveColorVar = computed(() => props.inactiveColor || 'var(--see-tabbar-inactive-color, var(--see-tips-color))')

// 占位高度需与真实 tabbar 一致：内容高度 + 底部安全区
const placeholderStyle = computed(() => {
  const base = 'var(--see-tabbar-height, 100rpx)'
  if (!props.safeAreaInsetBottom) {
    return { height: base }
  }
  let bottom = `${safeAreaBottom.value}px`
  // #ifdef H5
  bottom = 'env(safe-area-inset-bottom)'
  // #endif
  return { height: `calc(${base} + ${bottom})` }
})

/** ---------- methods ---------- */
const handleTabClick = (tab: TabbarItem, index: number) => {
  if (tab.isDisabled) return

  emit('onClick', tab.name, index)

  if (tab.isCenter) {
    emit('onCenterClick')
    return
  }

  if (tab.name !== props.modelValue) {
    emit('update:modelValue', tab.name)
    emit('onChange', tab.name, index)
  }

  if (props.route && tab.url) {
    uni.switchTab({ url: tab.url })
  }
}

const switchTab = (name: string | number) => {
  const index = internalTabs.value.findIndex((t) => t.name === name)
  if (index !== -1) {
    emit('update:modelValue', name)
    emit('onChange', name, index)
  }
}

const setBadge = (name: string | number, badge: string | number) => {
  const tab = internalTabs.value.find((t) => t.name === name)
  if (tab) {
    tab.badge = badge
  }
}

const clearBadge = (name: string | number) => {
  const tab = internalTabs.value.find((t) => t.name === name)
  if (tab) {
    tab.badge = undefined
  }
}

/** ---------- expose ---------- */
defineExpose<SeeTabbarExpose>({
  switchTab,
  setBadge,
  clearBadge
})
</script>

<style lang="scss" scoped>
.see-tabbar {
  position: relative;
  width: 100%;
  background: var(--see-tabbar-bg, var(--see-bg-color));
  box-sizing: border-box;

  &--fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  &--frosted {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  &--border {
    border-top: 1px solid var(--see-navbar-border-color, var(--see-border-four-color));
  }

  &__safe-area {
    width: 100%;
  }

  &__content {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: var(--see-tabbar-height, 100rpx);
    padding: 0 8rpx;
    box-sizing: border-box;
    position: relative;
  }

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 8rpx 0;
    box-sizing: border-box;
    position: relative;

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &--center {
      position: relative;
    }
  }

  &__icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4rpx;
  }

  &__icon {
    font-size: 44rpx;
    line-height: 1;
  }

  &__text {
    font-size: 22rpx;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__badge {
    position: absolute;
    top: -8rpx;
    right: -16rpx;
    min-width: 32rpx;
    height: 32rpx;
    padding: 0 8rpx;
    background: var(--see-error, #ff6b6b);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  &__badge-text {
    font-size: 18rpx;
    color: #ffffff;
    line-height: 1;
  }

  &__dot {
    position: absolute;
    top: -4rpx;
    right: -8rpx;
    width: 16rpx;
    height: 16rpx;
    background: var(--see-error, #ff6b6b);
    border-radius: 50%;
  }

  &__center-btn {
    position: absolute;
    top: -20rpx;
    width: var(--see-tabbar-center-btn-size, 112rpx);
    height: var(--see-tabbar-center-btn-size, 112rpx);
    background: var(--see-tabbar-center-btn-bg, var(--see-primary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--see-tabbar-center-btn-shadow, 0 4rpx 16rpx rgba(60, 167, 255, 0.35));
    z-index: 2;
  }

  &__center-icon {
    font-size: 48rpx;
    color: #ffffff;
  }

  &__placeholder {
    width: 100%;
    height: var(--see-tabbar-height, 100rpx);
    visibility: hidden;
  }
}
</style>
