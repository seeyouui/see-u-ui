<template>
  <view class="see-index-list" :style="listStyle">
    <!-- 搜索框 -->
    <view v-if="isShowSearch" class="see-index-list__search">
      <input class="see-index-list__search-input" type="text" :placeholder="t('search')" :value="searchQuery" @input="handleSearch" />
    </view>

    <!-- 列表内容 -->
    <scroll-view class="see-index-list__scroll" scroll-y :scroll-into-view="scrollIntoView" scroll-with-animation>
      <view v-for="group in filteredGroups" :id="'group-' + group[0]" :key="group[0]" class="see-index-list__group">
        <!-- 分组标题 -->
        <view class="see-index-list__header" :class="{ 'see-index-list__header--sticky': isStickyHeader }">
          <text class="see-index-list__header-text">{{ group[0] }}</text>
        </view>

        <!-- 分组项 -->
        <view v-for="(item, itemIdx) in group[1]" :key="item.name + itemIdx" class="see-index-list__item" @tap="handleSelect(item)">
          <text class="see-index-list__item-name">{{ item.name }}</text>
        </view>
      </view>

      <!-- 空数据 -->
      <view v-if="filteredGroups.length === 0" class="see-index-list__empty">
        <text class="see-index-list__empty-text">{{ t('noData') }}</text>
      </view>
    </scroll-view>

    <!-- 右侧索引导航条 -->
    <view class="see-index-list__nav" @touchstart="handleNavTouchStart" @touchmove.stop.prevent="handleNavTouchMove" @touchend="handleNavTouchEnd">
      <view
        v-for="index in navIndexList"
        :key="index"
        class="see-index-list__nav-item"
        :class="{ 'see-index-list__nav-item--active': currentIndex === index }"
        :data-index="index"
      >
        <text class="see-index-list__nav-text">{{ index }}</text>
      </view>
    </view>

    <!-- 索引气泡 -->
    <view v-if="showBubble" class="see-index-list__bubble">
      <text class="see-index-list__bubble-text">{{ currentIndex }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch, getCurrentInstance, onMounted, nextTick } from 'vue'
import { useI18n } from '../../locale'
import type { IndexListItem, SeeIndexListProps, SeeIndexListEmits } from './type'

defineOptions({ name: 'SeeIndexList' })

const { t } = useI18n()

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeIndexListProps>(), {
  data: () => [],
  indexList: () => [],
  indexKey: 'index',
  isPinyin: false,
  isShowSearch: false,
  isStickyHeader: true,
  height: '100%',
  isVirtual: false
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeIndexListEmits>()

/** ---------- state ---------- */
const searchQuery = ref('')
const currentIndex = ref('')
const scrollIntoView = ref('')
const showBubble = ref(false)
let bubbleTimer: ReturnType<typeof setTimeout> | null = null
const instance = getCurrentInstance()

// nav 容器与各 nav-item 的位置快照（用于跨端的 touchmove 落点计算）
let navTop = 0
let navItemHeight = 0
let navItemList: string[] = []
// setTimeout 节流：避免高频 touchmove 直接刷新 setData；rAF 在小程序端不存在，故统一用定时器分帧
let throttleTimer: ReturnType<typeof setTimeout> | null = null
let pendingClientY = 0

/** ---------- computed ---------- */
const listStyle = computed(() => {
  const height = typeof props.height === 'number' ? `${props.height}px` : props.height
  return { height }
})

// 数据分组
const groupedData = computed(() => {
  const groups: Record<string, IndexListItem[]> = {}

  props.data.forEach((item) => {
    const idx = (item as any)[props.indexKey] || '#'
    if (!groups[idx]) groups[idx] = []
    groups[idx].push(item)
  })

  return Object.entries(groups).sort(([a], [b]) => {
    if (a === '#') return 1
    if (b === '#') return -1
    return a.localeCompare(b)
  })
})

// 过滤后的分组
const filteredGroups = computed(() => {
  if (!searchQuery.value) return groupedData.value

  const query = searchQuery.value.toLowerCase()
  return groupedData.value
    .map(([key, items]) => [key, items.filter((item) => item.name.toLowerCase().includes(query))])
    .filter(([_, items]) => (items as IndexListItem[]).length > 0) as [string, IndexListItem[]][]
})

// 导航索引列表
const navIndexList = computed(() => {
  if (props.indexList.length > 0) return props.indexList
  return groupedData.value.map(([key]) => key)
})

/** ---------- methods ---------- */
const handleSearch = (e: any) => {
  searchQuery.value = e.detail?.value || e.target?.value || ''
}

const handleSelect = (item: IndexListItem) => {
  emit('onSelect', item)
}

// 测量 nav 容器位置和 item 高度，缓存供 touchmove 计算落点
const measureNav = () => {
  if (!instance) return
  nextTick(() => {
    const query = uni.createSelectorQuery().in(instance)
    query.select('.see-index-list__nav').boundingClientRect()
    query.selectAll('.see-index-list__nav-item').boundingClientRect()
    query.exec((res) => {
      const navRect = res[0] as { top: number; height: number } | null
      const itemRects = res[1] as Array<{ top: number; height: number }> | null
      if (navRect) navTop = navRect.top
      if (Array.isArray(itemRects) && itemRects.length > 0) {
        navItemHeight = itemRects[0].height
      }
      navItemList = navIndexList.value.slice()
    })
  })
}

// 从触摸事件中提取 clientY（与 boundingClientRect().top 同为视口坐标系，避免页面滚动后落点错位）
const getTouchClientY = (e: any): number | null => {
  const touch = e.touches?.[0] || e.changedTouches?.[0]
  if (!touch) return null
  return touch.clientY ?? touch.pageY ?? 0
}

const handleNavTouchStart = (e: any) => {
  // touchstart 时再测量一次，避免页面滚动或屏幕旋转后位置失效
  measureNav()
  const clientY = getTouchClientY(e)
  if (clientY !== null) updateIndexByClientY(clientY)
}

const handleNavTouchMove = (e: any) => {
  // setTimeout 节流：同步取出坐标（事件对象在小程序端可能被回收），节流期间只保留最新坐标，每帧刷新一次
  const clientY = getTouchClientY(e)
  if (clientY === null) return
  pendingClientY = clientY
  if (throttleTimer) return
  throttleTimer = setTimeout(() => {
    throttleTimer = null
    updateIndexByClientY(pendingClientY)
  }, 16)
}

const handleNavTouchEnd = () => {
  if (throttleTimer) {
    clearTimeout(throttleTimer)
    throttleTimer = null
  }
  if (bubbleTimer) clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => {
    showBubble.value = false
  }, 500)
}

const updateIndexByClientY = (clientY: number) => {
  if (!navItemHeight || navItemList.length === 0) return
  // clientY 与 navTop 同为视口坐标系，直接相减得到落在 nav 容器内的相对偏移
  const offsetY = clientY - navTop
  let i = Math.floor(offsetY / navItemHeight)
  if (i < 0) i = 0
  if (i >= navItemList.length) i = navItemList.length - 1
  const index = navItemList[i]
  if (index && index !== currentIndex.value) {
    currentIndex.value = index
    scrollIntoView.value = `group-${index}`
    showBubble.value = true
    emit('onIndexChange', index)
  }
}

/** ---------- watch ---------- */
watch(
  () => props.data,
  () => {
    if (groupedData.value.length > 0 && !currentIndex.value) {
      currentIndex.value = groupedData.value[0][0]
    }
  },
  { immediate: true }
)

// 数据变化时重新测量
watch(navIndexList, () => measureNav())

onMounted(() => {
  measureNav()
})
</script>

<style lang="scss" scoped>
.see-index-list {
  position: relative;
  width: 100%;
  overflow: hidden;

  &__search {
    padding: 16rpx 24rpx;
    background: var(--see-bg-color);
  }

  &__search-input {
    height: var(--see-index-list-search-height, 72rpx);
    background: var(--see-info-light, #f2f3f5);
    border-radius: 36rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: var(--see-main-color);
  }

  &__scroll {
    height: 100%;
  }

  &__group {
    &:first-child .see-index-list__header {
      border-top: none;
    }
  }

  &__header {
    padding: 0 24rpx;
    height: var(--see-index-list-header-height, 56rpx);
    display: flex;
    align-items: center;
    background: var(--see-index-list-header-bg, var(--see-border-four-color));

    &--sticky {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }

  &__header-text {
    font-size: 26rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }

  &__item {
    display: flex;
    align-items: center;
    height: var(--see-index-list-item-height, 88rpx);
    padding: 0 24rpx;
    background: var(--see-bg-color);
    border-bottom: 1rpx solid var(--see-border-four-color);
  }

  &__item-name {
    font-size: 30rpx;
    color: var(--see-main-color);
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400rpx;
  }

  &__empty-text {
    font-size: 28rpx;
    color: var(--see-tips-color);
  }

  &__nav {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8rpx 0;
    z-index: 10;
  }

  &__nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--see-index-list-nav-width, 40rpx);
    height: 32rpx;

    &--active {
      .see-index-list__nav-text {
        color: var(--see-index-list-nav-color, var(--see-primary));
        font-weight: 600;
      }
    }
  }

  &__nav-text {
    font-size: var(--see-index-list-nav-font-size, 22rpx);
    color: var(--see-content-color);
  }

  &__bubble {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 96rpx;
    height: 96rpx;
    background: var(--see-overlay-bg, rgba(0, 0, 0, 0.6));
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  &__bubble-text {
    font-size: 48rpx;
    color: #ffffff;
    font-weight: bold;
  }
}
</style>
