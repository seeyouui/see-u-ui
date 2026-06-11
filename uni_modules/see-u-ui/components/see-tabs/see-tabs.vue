<template>
  <view class="see-tabs" :class="tabsClass" :style="tabsStyle">
    <!-- 标签栏 -->
    <view class="see-tabs__nav" :class="navClass">
      <scroll-view v-if="isScrollable" class="see-tabs__scroll" scroll-x :scroll-into-view="scrollIntoView" scroll-with-animation>
        <view class="see-tabs__nav-inner">
          <view
            v-for="pane in panes"
            :id="'tab-' + pane.name"
            :key="pane.name"
            class="see-tabs__tab"
            :class="{
              'see-tabs__tab--active': activeName === pane.name,
              'see-tabs__tab--disabled': pane.isDisabled,
              'see-tabs__tab--closable': pane.closable
            }"
            @tap="handleTabClick(pane)"
          >
            <text class="see-tabs__tab-text" :style="{ color: activeName === pane.name ? activeColorVar : inactiveColorVar }">
              {{ pane.title }}
            </text>
            <view v-if="pane.badge !== undefined && pane.badge !== null" class="see-tabs__badge">
              <text class="see-tabs__badge-text">{{ pane.badge }}</text>
            </view>
            <view v-if="pane.dot" class="see-tabs__dot" />
            <text v-if="pane.closable" class="see-tabs__close" @tap.stop="handleClose(pane)">✕</text>
          </view>
        </view>
      </scroll-view>

      <view v-else class="see-tabs__nav-inner">
        <view
          v-for="pane in panes"
          :key="pane.name"
          class="see-tabs__tab"
          :class="{
            'see-tabs__tab--active': activeName === pane.name,
            'see-tabs__tab--disabled': pane.isDisabled,
            'see-tabs__tab--closable': pane.closable
          }"
          @tap="handleTabClick(pane)"
        >
          <text class="see-tabs__tab-text" :style="{ color: activeName === pane.name ? activeColorVar : inactiveColorVar }">
            {{ pane.title }}
          </text>
          <view v-if="pane.badge !== undefined && pane.badge !== null" class="see-tabs__badge">
            <text class="see-tabs__badge-text">{{ pane.badge }}</text>
          </view>
          <view v-if="pane.dot" class="see-tabs__dot" />
          <text v-if="pane.closable" class="see-tabs__close" @tap.stop="handleClose(pane)">✕</text>
        </view>
      </view>

      <!-- 指示器 -->
      <view v-if="type === 'line'" class="see-tabs__indicator" :style="indicatorStyle" />
    </view>

    <!-- 内容区 -->
    <view class="see-tabs__content">
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, provide, watch, onMounted, nextTick, getCurrentInstance } from 'vue'
import type { SeeTabsProps, SeeTabsEmits, SeeTabsExpose, SeeTabPaneProps, TabsContext } from './type'

defineOptions({ name: 'SeeTabs' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeTabsProps>(), {
  modelValue: '',
  type: 'line',
  isSwipeable: false,
  isSticky: false,
  stickyOffsetTop: 0,
  duration: 300,
  isScrollable: false,
  lineWidth: 40,
  lineHeight: 4,
  activeColor: '',
  inactiveColor: '',
  bgColor: '',
  isLazy: false,
  isCache: false,
  isShowBadge: true
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeTabsEmits>()

/** ---------- state ---------- */
const activeName = ref(props.modelValue)
const panes = ref<SeeTabPaneProps[]>([])
const scrollIntoView = ref('')
// 每个 tab 在 nav-inner 内的真实 left / width，由 createSelectorQuery 测量
const tabRects = ref<Array<{ left: number; width: number }>>([])
const instance = getCurrentInstance()

const measureTabs = () => {
  if (!instance) return
  nextTick(() => {
    const query = uni.createSelectorQuery().in(instance)
    query.selectAll('.see-tabs__tab').boundingClientRect()
    query.select('.see-tabs__nav-inner').boundingClientRect()
    query.exec((res) => {
      const rects = res[0] as Array<{ left: number; width: number } | null>
      const container = res[1] as { left: number } | null
      const containerLeft = container?.left || 0
      if (Array.isArray(rects)) {
        tabRects.value = rects.map((r) => ({
          left: (r?.left || 0) - containerLeft,
          width: r?.width || 0
        }))
      }
    })
  })
}

/** ---------- computed ---------- */
const tabsClass = computed(() => ({
  [`see-tabs--${props.type}`]: true,
  'see-tabs--scrollable': props.isScrollable
}))

const tabsStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgColor) {
    style.background = props.bgColor
  }
  return style
})

const navClass = computed(() => ({
  'see-tabs__nav--card': props.type === 'card',
  'see-tabs__nav--button': props.type === 'button'
}))

const activeColorVar = computed(() => props.activeColor || 'var(--see-tabs-active-color, var(--see-primary))')
const inactiveColorVar = computed(() => props.inactiveColor || 'var(--see-tabs-inactive-color, var(--see-tips-color))')

const indicatorStyle = computed(() => {
  const index = panes.value.findIndex((p) => p.name === activeName.value)
  if (index === -1) return { display: 'none' }
  const rect = tabRects.value[index]
  // 首次渲染时还没测量到，回退到按等宽估算（与旧实现一致，避免闪烁）
  if (!rect || rect.width === 0) {
    return {
      width: `${props.lineWidth}px`,
      height: `${props.lineHeight}px`,
      transform: `translateX(${index * 100}%)`,
      transition: `transform ${props.duration}ms ease`,
      opacity: '0'
    }
  }
  // 让指示器以 lineWidth 居中显示在每个 tab 下方
  const left = rect.left + (rect.width - props.lineWidth) / 2
  return {
    width: `${props.lineWidth}px`,
    height: `${props.lineHeight}px`,
    transform: `translateX(${left}px)`,
    transition: `transform ${props.duration}ms ease`,
    opacity: '1'
  }
})

/** ---------- provide/inject ---------- */
const registerPane = (pane: SeeTabPaneProps) => {
  if (!panes.value.find((p) => p.name === pane.name)) {
    panes.value.push(pane)
  }
}

const unregisterPane = (name: string | number) => {
  panes.value = panes.value.filter((p) => p.name !== name)
}

// 用 computed 保持响应式，避免父组件改 isLazy/isCache 后子组件感知不到
const isLazyRef = computed(() => props.isLazy)
const isCacheRef = computed(() => props.isCache)

provide<TabsContext>('see-tabs', {
  activeName,
  registerPane,
  unregisterPane,
  isLazy: isLazyRef,
  isCache: isCacheRef
})

/** ---------- methods ---------- */
const handleTabClick = (pane: SeeTabPaneProps) => {
  if (pane.isDisabled) return
  emit('onClick', pane.name, pane.title || '')

  if (pane.name !== activeName.value) {
    activeName.value = pane.name
    emit('update:modelValue', pane.name)
    emit('onChange', pane.name, pane.title || '')
  }

  if (props.isScrollable) {
    scrollIntoView.value = `tab-${pane.name}`
  }
}

const handleClose = (pane: SeeTabPaneProps) => {
  emit('onClose', pane.name)
}

const switchTo = (name: string | number) => {
  const pane = panes.value.find((p) => p.name === name)
  if (pane && !pane.isDisabled) {
    activeName.value = name
    emit('update:modelValue', name)
    emit('onChange', name, pane.title || '')
  }
}

const addTab = (tab: SeeTabPaneProps) => {
  registerPane(tab)
}

const removeTab = (name: string | number) => {
  unregisterPane(name)
  if (activeName.value === name && panes.value.length > 0) {
    switchTo(panes.value[0].name)
  }
}

const scrollToTab = (name: string | number) => {
  scrollIntoView.value = `tab-${name}`
}

/** ---------- watch ---------- */
watch(
  () => props.modelValue,
  (val) => {
    activeName.value = val
  }
)

// panes 数量变化、activeName 变化时重新测量 tab 位置
watch(
  () => panes.value.length,
  () => measureTabs()
)
watch(activeName, () => measureTabs())

onMounted(() => {
  measureTabs()
})

/** ---------- expose ---------- */
defineExpose<SeeTabsExpose>({
  switchTo,
  addTab,
  removeTab,
  scrollToTab
})
</script>

<style lang="scss" scoped>
.see-tabs {
  width: 100%;
  background: var(--see-tabs-bg, var(--see-bg-color));

  &__nav {
    position: relative;
    border-bottom: 1px solid var(--see-tabs-border-color, var(--see-border-four-color));

    &--card {
      border-bottom: none;
      border: 1px solid var(--see-tabs-border-color, var(--see-border-four-color));
      border-radius: 8rpx;
      margin: 16rpx;
      overflow: hidden;
    }

    &--button {
      border-bottom: none;
      background: var(--see-info-light, #f2f3f5);
      margin: 16rpx;
      border-radius: 8rpx;
      padding: 4rpx;
    }
  }

  &__scroll {
    white-space: nowrap;
  }

  &__nav-inner {
    display: flex;
    align-items: center;
  }

  &__tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--see-tabs-height, 88rpx);
    padding: 0 24rpx;
    box-sizing: border-box;
    position: relative;
    white-space: nowrap;

    &--active {
      font-weight: 600;
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &--closable {
      padding-right: 48rpx;
    }
  }

  &__tab-text {
    font-size: 30rpx;
    line-height: 1;
  }

  &__badge {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    min-width: 28rpx;
    height: 28rpx;
    padding: 0 6rpx;
    background: var(--see-error, #ff6b6b);
    border-radius: 14rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  &__badge-text {
    font-size: 16rpx;
    color: #ffffff;
    line-height: 1;
  }

  &__dot {
    position: absolute;
    top: 12rpx;
    right: 12rpx;
    width: 12rpx;
    height: 12rpx;
    background: var(--see-error, #ff6b6b);
    border-radius: 50%;
  }

  &__close {
    position: absolute;
    right: 8rpx;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24rpx;
    color: var(--see-tips-color);
    padding: 8rpx;
  }

  &__indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    background: var(--see-tabs-line-color, var(--see-primary));
    border-radius: 2rpx;
  }

  &__content {
    position: relative;
  }
}
</style>
