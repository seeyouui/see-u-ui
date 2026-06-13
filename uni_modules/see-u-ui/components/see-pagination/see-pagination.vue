<template>
  <view class="see-pagination" :class="{ 'see-pagination--disabled': isDisabled }">
    <!-- 总数 -->
    <text v-if="isShowTotal" class="see-pagination__total">{{ t('pagination.total', { total }) }}</text>

    <!-- button 模式 -->
    <template v-if="mode === 'button'">
      <view class="see-pagination__btn" :class="{ 'see-pagination__btn--disabled': modelValue <= 1 }" @tap="handlePrev">
        <text class="see-pagination__btn-text">{{ prevText }}</text>
      </view>
      <text class="see-pagination__current">{{ modelValue }}</text>
      <text class="see-pagination__separator">/</text>
      <text class="see-pagination__total-pages">{{ totalPages }}</text>
      <view class="see-pagination__btn" :class="{ 'see-pagination__btn--disabled': modelValue >= totalPages }" @tap="handleNext">
        <text class="see-pagination__btn-text">{{ nextText }}</text>
      </view>
    </template>

    <!-- simple 模式 -->
    <template v-if="mode === 'simple'">
      <view class="see-pagination__btn" :class="{ 'see-pagination__btn--disabled': modelValue <= 1 }" @tap="handlePrev">
        <text class="see-pagination__btn-text">{{ prevText }}</text>
      </view>
      <text class="see-pagination__simple-text">{{ modelValue }} / {{ totalPages }}</text>
      <view class="see-pagination__btn" :class="{ 'see-pagination__btn--disabled': modelValue >= totalPages }" @tap="handleNext">
        <text class="see-pagination__btn-text">{{ nextText }}</text>
      </view>
    </template>

    <!-- number 模式 -->
    <template v-if="mode === 'number'">
      <view class="see-pagination__btn" :class="{ 'see-pagination__btn--disabled': modelValue <= 1 }" @tap="handlePrev">
        <text class="see-pagination__btn-text">{{ prevText }}</text>
      </view>

      <view class="see-pagination__pages">
        <view
          v-for="(page, index) in displayPages"
          :key="index"
          class="see-pagination__page"
          :class="{
            'see-pagination__page--active': page === modelValue,
            'see-pagination__page--ellipsis': page === '...'
          }"
          @tap="handlePageClick(page)"
        >
          <text class="see-pagination__page-text">{{ page }}</text>
        </view>
      </view>

      <view class="see-pagination__btn" :class="{ 'see-pagination__btn--disabled': modelValue >= totalPages }" @tap="handleNext">
        <text class="see-pagination__btn-text">{{ nextText }}</text>
      </view>
    </template>

    <!-- 每页条数选择器 -->
    <view v-if="isShowSizeChanger" class="see-pagination__size-changer">
      <text class="see-pagination__size-text">{{ t('pagination.demo.perPage', { pageSize }) }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from '../../locale'
import type { SeePaginationProps, SeePaginationEmits } from './type'

defineOptions({ name: 'SeePagination' })

const { t } = useI18n()

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeePaginationProps>(), {
  modelValue: 1,
  total: 0,
  pageSize: 10,
  mode: 'number',
  maxPages: 7,
  isShowTotal: false,
  isShowSizeChanger: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  prevText: '‹',
  nextText: '›',
  isDisabled: false
})

/** ---------- emits ---------- */
const emit = defineEmits<SeePaginationEmits>()

/** ---------- computed ---------- */
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.total / props.pageSize))
})

const displayPages = computed(() => {
  const total = totalPages.value
  const current = props.modelValue
  const max = props.maxPages

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []
  const half = Math.floor(max / 2)
  let start = Math.max(1, current - half)
  let end = Math.min(total, start + max - 1)

  // 调整 start 确保显示 max 个页码
  if (end - start + 1 < max) {
    start = Math.max(1, end - max + 1)
  }

  // 首页
  if (start > 1) {
    pages.push(1)
    if (start > 2) {
      pages.push('...')
    }
  }

  // 中间页码
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // 尾页
  if (end < total) {
    if (end < total - 1) {
      pages.push('...')
    }
    pages.push(total)
  }

  return pages
})

/** ---------- methods ---------- */
const handlePrev = () => {
  if (props.isDisabled || props.modelValue <= 1) return
  goToPage(props.modelValue - 1)
}

const handleNext = () => {
  if (props.isDisabled || props.modelValue >= totalPages.value) return
  goToPage(props.modelValue + 1)
}

const handlePageClick = (page: number | string) => {
  if (page === '...' || typeof page !== 'number') return
  goToPage(page)
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  emit('update:modelValue', page)
  emit('onChange', page, props.pageSize)
}
</script>

<style lang="scss" scoped>
.see-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--see-pagination-height, 80rpx);
  padding: 0 16rpx;
  box-sizing: border-box;

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__total {
    font-size: 24rpx;
    color: var(--see-tips-color);
    margin-right: 16rpx;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--see-pagination-button-size, 72rpx);
    height: var(--see-pagination-button-size, 72rpx);
    padding: 0 12rpx;
    background: var(--see-pagination-button-bg, var(--see-info));
    border-radius: 8rpx;
    box-sizing: border-box;

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__btn-text {
    font-size: 28rpx;
    color: var(--see-main-color);
  }

  &__current {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--see-pagination-active-bg, var(--see-primary));
    margin: 0 8rpx;
  }

  &__separator {
    font-size: 24rpx;
    color: var(--see-tips-color);
    margin: 0 4rpx;
  }

  &__total-pages {
    font-size: 28rpx;
    color: var(--see-content-color);
    margin-right: 8rpx;
  }

  &__simple-text {
    font-size: 28rpx;
    color: var(--see-content-color);
    margin: 0 16rpx;
  }

  &__pages {
    display: flex;
    align-items: center;
    margin: 0 8rpx;
  }

  &__page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 56rpx;
    height: 56rpx;
    margin: 0 4rpx;
    border-radius: 8rpx;
    box-sizing: border-box;

    &--active {
      background: var(--see-pagination-active-bg, var(--see-primary));

      .see-pagination__page-text {
        color: var(--see-pagination-active-color, #ffffff);
      }
    }

    &--ellipsis {
      pointer-events: none;
    }
  }

  &__page-text {
    font-size: 26rpx;
    color: var(--see-content-color);
  }

  &__size-changer {
    margin-left: 16rpx;
    padding: 8rpx 16rpx;
    background: var(--see-info-light, #f2f3f5);
    border-radius: 8rpx;
  }

  &__size-text {
    font-size: 24rpx;
    color: var(--see-content-color);
  }
}
</style>
