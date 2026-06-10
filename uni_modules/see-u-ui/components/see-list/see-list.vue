<script lang="ts" setup>
/**
 * SeeList 列表
 * @description 基础数据容器，统一处理普通列表、加载状态、空状态、错误状态、完成状态、分组和列表项插槽。大量数据场景请使用 SeeVirtualList。
 */
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import type { SeeListProps } from './type'

defineOptions({ name: 'SeeList' })

const props = withDefaults(defineProps<SeeListProps>(), {
  list: () => [],
  keyField: '',
  loading: false,
  finished: false,
  error: false,
  emptyText: '',
  errorText: '',
  loadingText: '',
  finishedText: '',
  immediateCheck: true,
  offset: 50,
  direction: 'vertical',
  border: false,
  divided: false,
  itemGap: '',
  padding: '',
  groupBy: undefined
})

const emit = defineEmits<{
  (e: 'onLoadMore'): void
  (e: 'onRefresh'): void
  (e: 'onRetry'): void
  (e: 'onClickItem', item: unknown, index: number): void
}>()

const scrollViewRef = ref<unknown>(null)
const hasInitCheck = ref(false)

// ========== 计算属性 ==========

const safeList = computed(() => props.list ?? [])

const isEmpty = computed(() => !props.loading && !props.error && safeList.value.length === 0)

const showFinished = computed(() => props.finished && safeList.value.length > 0)

const showList = computed(() => safeList.value.length > 0 && !props.error)

const isHorizontal = computed(() => props.direction === 'horizontal')

const rootClasses = computed(() => [
  'see-list',
  {
    'see-list--border': props.border,
    'see-list--horizontal': isHorizontal.value,
    'see-list--divided': props.divided
  }
])

const rootStyle = computed(() => ({
  padding: props.padding || undefined
}))

const itemStyle = computed(() => ({
  gap: props.itemGap || undefined
}))

// ========== 分组逻辑 ==========

interface GroupedItem<T = unknown> {
  group: string
  items: T[]
}

const groupedList = computed(() => {
  const groupBy = props.groupBy
  if (!groupBy) return null

  const groups = new Map<string, unknown[]>()
  safeList.value.forEach((item, index) => {
    const key = typeof groupBy === 'function' ? groupBy(item, index) : String((item as Record<string, unknown>)[groupBy] ?? '')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  })

  const result: GroupedItem[] = []
  groups.forEach((items, group) => {
    result.push({ group, items })
  })
  return result
})

const hasGroupSlot = computed(() => !!props.groupBy)

// ========== 事件处理 ==========

const handleScrollToLower = () => {
  if (!props.loading && !props.finished && !props.error) {
    emit('onLoadMore')
  }
}

const handleScrollToUpper = () => {
  emit('onRefresh')
}

const handleClickItem = (item: unknown, index: number) => {
  emit('onClickItem', item, index)
}

const handleRetry = () => {
  emit('onRetry')
}

// ========== 立即检查 ==========

const checkImmediate = async () => {
  if (!props.immediateCheck || hasInitCheck.value) return
  hasInitCheck.value = true

  await nextTick()

  if (!props.loading && !props.finished && !props.error && safeList.value.length === 0) {
    emit('onLoadMore')
  }
}

watch(
  () => props.list,
  () => {
    nextTick(() => checkImmediate())
  },
  { deep: false }
)

onMounted(() => {
  checkImmediate()
})
</script>

<template>
  <view :class="rootClasses" :style="rootStyle">
    <!-- 头部插槽 -->
    <view v-if="$slots.header" class="see-list__header">
      <slot name="header" />
    </view>

    <!-- 加载中状态 -->
    <view v-if="loading && safeList.length === 0" class="see-list__status">
      <slot name="loading">
        <view class="see-list__loading">
          <view class="see-list__loading-spinner" />
          <text class="see-list__status-text">{{ loadingText || '加载中...' }}</text>
        </view>
      </slot>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error && safeList.length === 0" class="see-list__status">
      <slot name="error">
        <view class="see-list__error" @tap="handleRetry">
          <text class="see-list__error-icon">!</text>
          <text class="see-list__status-text">{{ errorText || '加载失败，点击重试' }}</text>
        </view>
      </slot>
    </view>

    <!-- 空状态 -->
    <view v-else-if="isEmpty" class="see-list__status">
      <slot name="empty">
        <view class="see-list__empty">
          <text class="see-list__empty-icon">○</text>
          <text class="see-list__status-text">{{ emptyText || '暂无数据' }}</text>
        </view>
      </slot>
    </view>

    <!-- 列表内容 -->
    <scroll-view
      v-if="showList"
      ref="scrollViewRef"
      class="see-list__scroll"
      :scroll-y="!isHorizontal"
      :scroll-x="isHorizontal"
      :show-scrollbar="true"
      :lower-threshold="offset"
      @scrolltolower="handleScrollToLower"
      @scrolltoupper="handleScrollToUpper"
    >
      <!-- 分组渲染 -->
      <template v-if="hasGroupSlot">
        <view v-for="group in groupedList" :key="group!.group" class="see-list__group">
          <slot name="group" :group="group!.group" :count="group!.items.length">
            <view class="see-list__group-title">
              <text>{{ group!.group }}</text>
            </view>
          </slot>
          <view class="see-list__items" :style="itemStyle">
            <view
              v-for="(item, index) in group!.items"
              :key="keyField ? ((item as Record<string, unknown>)[keyField] ?? index) : index"
              class="see-list__item"
              :class="{ 'see-list__item--divided': divided }"
              @tap="handleClickItem(item, index)"
            >
              <slot name="item" :item="item" :index="index" :group="group!.group">
                <text>{{ String(item ?? '') }}</text>
              </slot>
            </view>
          </view>
        </view>
      </template>

      <!-- 非分组渲染 -->
      <template v-else>
        <view class="see-list__items" :style="itemStyle">
          <view
            v-for="(item, index) in safeList"
            :key="keyField ? ((item as Record<string, unknown>)[keyField] ?? index) : index"
            class="see-list__item"
            :class="{ 'see-list__item--divided': divided }"
            @tap="handleClickItem(item, index)"
          >
            <slot name="item" :item="item" :index="index">
              <text>{{ String(item ?? '') }}</text>
            </slot>
          </view>
        </view>
      </template>

      <!-- 底部加载更多指示 -->
      <view v-if="loading && safeList.length > 0" class="see-list__footer-status">
        <slot name="loading">
          <text class="see-list__status-text">{{ loadingText || '加载中...' }}</text>
        </slot>
      </view>

      <!-- 完成状态 -->
      <view v-if="showFinished" class="see-list__footer-status">
        <slot name="finished">
          <text class="see-list__status-text">{{ finishedText || '没有更多了' }}</text>
        </slot>
      </view>

      <!-- 错误状态（有数据时） -->
      <view v-if="error && safeList.length > 0" class="see-list__footer-status" @tap="handleRetry">
        <slot name="error">
          <text class="see-list__status-text">{{ errorText || '加载失败，点击重试' }}</text>
        </slot>
      </view>

      <!-- 尾部插槽 -->
      <view v-if="$slots.footer" class="see-list__footer">
        <slot name="footer" />
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.see-list {
  position: relative;
  box-sizing: border-box;
  width: 100%;

  &--border {
    border: 1px solid var(--see-border-four-color, #e4e7ed);
    border-radius: 8rpx;
  }

  &--horizontal {
    .see-list__scroll {
      white-space: nowrap;
    }

    .see-list__items {
      flex-direction: row;
    }

    .see-list__item {
      flex-shrink: 0;
    }
  }

  &__scroll {
    width: 100%;
    box-sizing: border-box;
  }

  &__items {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  &__item {
    box-sizing: border-box;

    &--divided {
      border-bottom: 1px solid var(--see-border-four-color, #e4e7ed);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  &__group {
    &-title {
      padding: 16rpx 24rpx;
      font-size: 24rpx;
      color: var(--see-info-dark, #909399);
      background: var(--see-fill-color-light, #f2f3f5);
    }
  }

  &__status {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48rpx 24rpx;
    min-height: 120rpx;
  }

  &__loading,
  &__empty,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
  }

  &__loading-spinner {
    width: 40rpx;
    height: 40rpx;
    border: 4rpx solid var(--see-border-color, #dcdfe6);
    border-top-color: var(--see-primary, #2979ff);
    border-radius: 50%;
    animation: see-list-spin 0.8s linear infinite;
  }

  &__empty-icon {
    font-size: 64rpx;
    color: var(--see-info-dark, #909399);
  }

  &__error {
    cursor: pointer;
  }

  &__error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48rpx;
    height: 48rpx;
    font-size: 28rpx;
    font-weight: 700;
    color: var(--see-error, #f56c6c);
    border: 3rpx solid var(--see-error, #f56c6c);
    border-radius: 50%;
  }

  &__status-text {
    font-size: 24rpx;
    color: var(--see-info-dark, #909399);
  }

  &__header {
    width: 100%;
  }

  &__footer {
    width: 100%;
  }

  &__footer-status {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24rpx;
  }
}

@keyframes see-list-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
