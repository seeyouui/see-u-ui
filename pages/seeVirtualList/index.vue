<script lang="ts" setup>
import { ref } from 'vue'

const virtualListRef = ref<{
  scrollToIndex: (index: number, animated?: boolean) => void
  scrollToOffset: (offset: number, animated?: boolean) => void
  reset: () => void
} | null>(null)

// 基础数据
const baseData = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `列表项 #${i + 1}`,
    desc: `这是第 ${i + 1} 条数据的描述信息`
  }))
)

// 大数据
const bigData = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    title: `Item #${i + 1}`,
    content: `Content for item ${i + 1}. This is a large dataset demo.`
  }))
)

// 方法控制的目标索引
const targetIndex = ref(0)

const handleScrollToIndex = () => {
  const idx = Math.max(0, Math.min(targetIndex.value, bigData.value.length - 1))
  virtualListRef.value?.scrollToIndex(idx, true)
}

const handleScrollToTop = () => {
  virtualListRef.value?.scrollToOffset(0, true)
}

const handleReset = () => {
  virtualListRef.value?.reset()
}

const handleRangeChange = (range: { start: number; end: number; visibleStart: number; visibleEnd: number }) => {
  console.log('[VirtualList] range:', range)
}
</script>

<template>
  <see-config>
    <view class="page">
      <!-- 基础用法 -->
      <text class="title">基础用法（100 条数据）</text>
      <view class="demo-card">
        <see-virtual-list :list="baseData" :item-height="88" :height="500" key-field="id" :buffer="3" @on-range-change="handleRangeChange">
          <template #item="{ item, index }">
            <view class="virtual-item">
              <view class="virtual-item__index">#{{ index + 1 }}</view>
              <view class="virtual-item__info">
                <text class="virtual-item__title">{{ item.title }}</text>
                <text class="virtual-item__desc">{{ item.desc }}</text>
              </view>
            </view>
          </template>
        </see-virtual-list>
      </view>

      <!-- 大数据场景 -->
      <text class="title">大数据场景（10000 条）</text>
      <view class="demo-card demo-card--large">
        <see-virtual-list
          ref="virtualListRef"
          :list="bigData"
          :item-height="72"
          :height="600"
          key-field="id"
          :buffer="5"
          :show-scrollbar="true"
          @on-range-change="handleRangeChange"
        >
          <template #item="{ item, index }">
            <view class="virtual-item virtual-item--compact">
              <text class="virtual-item__title">#{{ index + 1 }}: {{ item.title }}</text>
            </view>
          </template>
          <template #footer>
            <view class="virtual-footer">
              <text class="virtual-footer__text">共 {{ bigData.length }} 条数据，仅渲染可视区域节点</text>
            </view>
          </template>
        </see-virtual-list>
      </view>

      <!-- 方法控制 -->
      <text class="title">方法控制</text>
      <view class="demo-card demo-card--actions">
        <view class="action-row">
          <text class="action-label">跳转到索引：</text>
          <input v-model="targetIndex" class="action-input" type="number" placeholder="输入索引" />
          <button size="mini" type="primary" @tap="handleScrollToIndex">跳转</button>
        </view>
        <view class="action-row">
          <button size="mini" @tap="handleScrollToTop">回到顶部</button>
          <button size="mini" @tap="handleReset">重置</button>
        </view>
      </view>

      <!-- 空状态 -->
      <text class="title">空状态</text>
      <view class="demo-card">
        <see-virtual-list :list="[]" :item-height="44" :height="200">
          <template #empty>
            <text class="custom-empty">这里空空如也～</text>
          </template>
        </see-virtual-list>
      </view>
    </view>
  </see-config>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--see-bg-color);
}

.title {
  display: block;
  margin: 28rpx 0 16rpx;
  color: var(--see-tips-color);
  font-size: 28rpx;
}

.demo-card {
  padding: 0;
  border: 1px solid var(--see-border-four-color);
  border-radius: 20rpx;
  background: var(--see-bg-color);
  box-shadow: var(--see-card-shadow);
  overflow: hidden;

  &--large {
    padding: 0;
  }

  &--actions {
    padding: 24rpx;
  }
}

.virtual-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 0 24rpx;
  height: 88rpx;
  box-sizing: border-box;
  border-bottom: 1px solid var(--see-border-four-color);

  &:last-child {
    border-bottom: none;
  }

  &--compact {
    height: 72rpx;
  }

  &__index {
    width: 64rpx;
    font-size: 24rpx;
    color: var(--see-info-dark);
    font-variant-numeric: tabular-nums;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 28rpx;
    color: var(--see-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__desc {
    font-size: 22rpx;
    color: var(--see-info-dark);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.virtual-footer {
  padding: 16rpx 24rpx;
  text-align: center;
  background: var(--see-fill-color-light);

  &__text {
    font-size: 22rpx;
    color: var(--see-info-dark);
  }
}

.action-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.action-label {
  font-size: 26rpx;
  color: var(--see-text-color);
  white-space: nowrap;
}

.action-input {
  flex: 1;
  height: 60rpx;
  padding: 0 16rpx;
  border: 1px solid var(--see-border-four-color);
  border-radius: 8rpx;
  font-size: 26rpx;
  color: var(--see-text-color);
  background: var(--see-fill-color-light);
}

.custom-empty {
  font-size: 28rpx;
  color: var(--see-info-dark);
}
</style>
