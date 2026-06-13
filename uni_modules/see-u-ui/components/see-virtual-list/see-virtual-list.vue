<script lang="ts" setup>
/**
 * SeeVirtualList 虚拟列表
 * @description 用于大数据列表渲染，解决节点过多、滚动卡顿问题。固定高度是主路径，动态高度是增强模式。
 */
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from '../../locale'
import { useVirtualWindow } from '../../utils/hooks/useVirtualWindow'
import type { SeeVirtualListProps, SeeVirtualListRangeChange, SeeVirtualListScrollEvent } from './type'

defineOptions({ name: 'SeeVirtualList' })

const { t } = useI18n()

const props = withDefaults(defineProps<SeeVirtualListProps>(), {
  list: () => [],
  itemHeight: 44,
  height: '100%',
  keyField: '',
  buffer: 5,
  scrollTop: 0,
  scrollIntoIndex: undefined,
  horizontal: false,
  itemGap: 0,
  estimatedItemHeight: undefined,
  dynamic: false,
  lowerThreshold: 50,
  upperThreshold: 50,
  showScrollbar: true
})

const emit = defineEmits<{
  (e: 'onScroll', event: SeeVirtualListScrollEvent): void
  (e: 'onRangeChange', range: SeeVirtualListRangeChange): void
  (e: 'onScrollToLower'): void
  (e: 'onScrollToUpper'): void
  (e: 'onItemClick', item: unknown, index: number): void
}>()

const scrollViewRef = ref<unknown>(null)
const containerRef = ref<unknown>(null)
const currentScrollTop = ref(0)
const isScrollToUpperReady = ref(true)
const isScrollToLowerReady = ref(true)

// ========== 计算属性 ==========

const safeList = computed(() => props.list ?? [])

const totalCount = computed(() => safeList.value.length)

const effectiveItemHeight = computed(() => {
  if (props.dynamic && props.estimatedItemHeight) return props.estimatedItemHeight
  return props.itemHeight
})

const effectiveItemGap = computed(() => props.itemGap ?? 0)

const totalItemSize = computed(() => effectiveItemHeight.value + effectiveItemGap.value)

const isEmpty = computed(() => safeList.value.length === 0)

// 使用 useVirtualWindow 计算虚拟范围
const virtual = useVirtualWindow({
  total: totalCount,
  itemSize: totalItemSize,
  viewportSize: computed(() => {
    if (typeof props.height === 'number') return props.height
    return 600 // fallback viewport
  }),
  buffer: props.buffer,
  estimatedItemSize: effectiveItemHeight,
  dynamic: props.dynamic,
  scrollOffset: currentScrollTop
})

// ========== 视口高度 ==========

const viewportHeight = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  return props.height
})

// ========== 可见项目 ==========

const visibleItems = computed(() => {
  const start = virtual.startIndex.value
  const end = virtual.endIndex.value
  const items: Array<{ item: unknown; index: number }> = []

  for (let i = start; i < end; i++) {
    items.push({ item: safeList.value[i], index: i })
  }
  return items
})

// ========== 样式 ==========

const scrollStyle = computed(() => ({
  height: viewportHeight.value
}))

const trackStyle = computed(() => ({
  paddingTop: `${virtual.translateOffset.value}px`,
  minHeight: `${virtual.totalSize.value}px`,
  gap: effectiveItemGap.value ? `${effectiveItemGap.value}px` : undefined
}))

const itemStyle = computed(() => ({
  height: `${effectiveItemHeight.value}px`
}))

const rootClasses = computed(() => [
  'see-virtual-list',
  {
    'see-virtual-list--horizontal': props.horizontal
  }
])

// ========== 事件处理 ==========

const handleScroll = (e: CustomEvent) => {
  const detail = e.detail ?? {}
  const scrollTop = detail.scrollTop ?? 0
  const scrollLeft = detail.scrollLeft ?? 0
  const deltaX = detail.deltaX ?? 0
  const deltaY = detail.deltaY ?? 0

  const scrollOffset = props.horizontal ? scrollLeft : scrollTop
  currentScrollTop.value = scrollOffset
  virtual.setScrollOffset(scrollOffset)

  const scrollEvent: SeeVirtualListScrollEvent = {
    scrollLeft,
    scrollTop,
    deltaX,
    deltaY
  }

  emit('onScroll', scrollEvent)
}

const handleScrollToLower = () => {
  if (!isScrollToLowerReady.value) return
  isScrollToLowerReady.value = false
  emit('onScrollToLower')
  setTimeout(() => {
    isScrollToLowerReady.value = true
  }, 300)
}

const handleScrollToUpper = () => {
  if (!isScrollToUpperReady.value) return
  isScrollToUpperReady.value = false
  emit('onScrollToUpper')
  setTimeout(() => {
    isScrollToUpperReady.value = true
  }, 300)
}

const handleItemClick = (item: unknown, index: number) => {
  emit('onItemClick', item, index)
}

// ========== 范围变更通知 ==========

watch(
  () => `${virtual.startIndex.value}:${virtual.endIndex.value}`,
  () => {
    const range: SeeVirtualListRangeChange = {
      start: virtual.startIndex.value,
      end: virtual.endIndex.value,
      visibleStart: virtual.visibleStart.value,
      visibleEnd: virtual.visibleEnd.value
    }
    emit('onRangeChange', range)
  }
)

// ========== 方法 ==========

const scrollToIndex = (index: number, animated = false) => {
  const target = Math.max(0, Math.min(index, totalCount.value - 1))
  const offset = target * totalItemSize.value

  if (scrollViewRef.value) {
    const key = props.horizontal ? 'scrollLeft' : 'scrollTop'
    // 使用 scrollTo 方法（部分平台支持）
    try {
      ;(scrollViewRef.value as any)?.scrollTo?.({ [key]: offset, animated })
    } catch {
      // fallback
    }
  }
}

const scrollToOffset = (offset: number, animated = false) => {
  if (scrollViewRef.value) {
    const key = props.horizontal ? 'scrollLeft' : 'scrollTop'
    try {
      ;(scrollViewRef.value as any)?.scrollTo?.({ [key]: Math.max(0, offset), animated })
    } catch {
      // fallback
    }
  }
}

const reset = () => {
  currentScrollTop.value = 0
  virtual.setScrollOffset(0)
}

// ========== scrollIntoIndex ==========

watch(
  () => props.scrollIntoIndex,
  (val) => {
    if (val !== undefined && val >= 0) {
      nextTick(() => scrollToIndex(val, true))
    }
  }
)

defineExpose({
  scrollToIndex,
  scrollToOffset,
  reset
})
</script>

<template>
  <view :class="rootClasses">
    <!-- 空状态 -->
    <view v-if="isEmpty" class="see-virtual-list__empty">
      <slot name="empty">
        <text class="see-virtual-list__empty-text">{{ t('virtualList.empty') }}</text>
      </slot>
    </view>

    <!-- 虚拟列表 -->
    <scroll-view
      v-else
      ref="scrollViewRef"
      class="see-virtual-list__scroll"
      :scroll-y="!horizontal"
      :scroll-x="horizontal"
      :show-scrollbar="showScrollbar"
      :lower-threshold="lowerThreshold"
      :upper-threshold="upperThreshold"
      :style="scrollStyle"
      @scroll="handleScroll"
      @scrolltolower="handleScrollToLower"
      @scrolltoupper="handleScrollToUpper"
    >
      <!-- 头部插槽 -->
      <view v-if="$slots.header" class="see-virtual-list__header">
        <slot name="header" />
      </view>

      <!-- 虚拟轨道 -->
      <view ref="containerRef" class="see-virtual-list__track" :style="trackStyle">
        <view
          v-for="item in visibleItems"
          :key="keyField ? ((item.item as Record<string, unknown>)[keyField] ?? item.index) : item.index"
          class="see-virtual-list__item"
          :style="itemStyle"
          @tap="handleItemClick(item.item, item.index)"
        >
          <slot name="item" :item="item.item" :index="item.index" :active-index="virtual.visibleStart">
            <text class="see-virtual-list__item-text">{{ String(item.item ?? '') }}</text>
          </slot>
        </view>
      </view>

      <!-- 尾部插槽 -->
      <view v-if="$slots.footer" class="see-virtual-list__footer">
        <slot name="footer" />
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.see-virtual-list {
  position: relative;
  width: 100%;
  box-sizing: border-box;

  &__scroll {
    width: 100%;
    box-sizing: border-box;
    overflow-anchor: none;
  }

  &__track {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  &--horizontal {
    .see-virtual-list__track {
      flex-direction: row;
    }

    .see-virtual-list__item {
      flex-shrink: 0;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;

    &-text {
      font-size: 28rpx;
      color: var(--see-text-color, #303133);
    }
  }

  &__header,
  &__footer {
    width: 100%;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48rpx 24rpx;
    min-height: 200rpx;

    &-text {
      font-size: 24rpx;
      color: var(--see-info-dark, #909399);
    }
  }
}
</style>
