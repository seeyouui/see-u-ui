<template>
  <see-config>
    <text class="title">基础横向滚动列表</text>
    <view class="demo-content">
      <see-scroll-list :list="basicList">
        <template #item="{ item }">
          <view class="scroll-item">
            <text class="scroll-item__text">{{ item }}</text>
          </view>
        </template>
      </see-scroll-list>
    </view>

    <text class="title">自定义项样式</text>
    <view class="demo-content">
      <see-scroll-list :list="colorList" item-gap="24rpx">
        <template #item="{ item }">
          <view class="scroll-item scroll-item--color" :style="{ backgroundColor: item.color }">
            <text class="scroll-item__text">{{ item.label }}</text>
          </view>
        </template>
      </see-scroll-list>
    </view>

    <text class="title">带尾部插槽</text>
    <view class="demo-content">
      <see-scroll-list :list="basicList.slice(0, 4)">
        <template #item="{ item }">
          <view class="scroll-item">
            <text class="scroll-item__text">{{ item }}</text>
          </view>
        </template>
        <template #footer>
          <view class="scroll-item scroll-item--more" @click="handleLoadMore">
            <text class="scroll-item__text">更多 ></text>
          </view>
        </template>
      </see-scroll-list>
    </view>

    <text class="title">加载更多</text>
    <view class="demo-content">
      <see-scroll-list :list="loadMoreList" @on-scroll-to-lower="onLoadMore">
        <template #item="{ item }">
          <view class="scroll-item scroll-item--card">
            <text class="scroll-item__title">{{ item.title }}</text>
            <text class="scroll-item__desc">{{ item.desc }}</text>
          </view>
        </template>
      </see-scroll-list>
    </view>

    <text class="title">纵向滚动</text>
    <view class="demo-content">
      <see-scroll-list :list="verticalList" :scroll-x="false" :scroll-y="true" style="height: 300rpx">
        <template #item="{ item }">
          <view class="scroll-item scroll-item--vertical">
            <text class="scroll-item__text">{{ item }}</text>
          </view>
        </template>
      </see-scroll-list>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const basicList = ref(['推荐', '热门', '关注', '科技', '财经', '体育', '娱乐', '教育'])

const colorList = ref([
  { label: '红色', color: '#ff4757' },
  { label: '橙色', color: '#ff6348' },
  { label: '黄色', color: '#ffa502' },
  { label: '绿色', color: '#2ed573' },
  { label: '蓝色', color: '#1e90ff' },
  { label: '紫色', color: '#a55eea' }
])

const loadMoreList = ref([
  { title: '卡片 1', desc: '描述内容' },
  { title: '卡片 2', desc: '描述内容' },
  { title: '卡片 3', desc: '描述内容' }
])

let loadMoreCount = 0

const onLoadMore = () => {
  if (loadMoreCount >= 3) {
    uni.showToast({ title: '没有更多了', icon: 'none' })
    return
  }
  loadMoreCount++
  const newItems = Array.from({ length: 3 }, (_, i) => ({
    title: `卡片 ${loadMoreList.value.length + i + 1}`,
    desc: '新加载内容'
  }))
  loadMoreList.value.push(...newItems)
}

const handleLoadMore = () => {
  uni.showToast({ title: '点击了更多', icon: 'none' })
}

const verticalList = ref(Array.from({ length: 20 }, (_, i) => `纵向列表项 ${i + 1}`))
</script>

<style lang="scss" scoped>
.title {
  display: block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: var(--see-tips-color);
}

.demo-content {
  padding: 0 30rpx 30rpx;
}

.scroll-item {
  padding: 20rpx 32rpx;
  background-color: var(--see-info);
  border-radius: 16rpx;
  white-space: nowrap;

  &__text {
    font-size: 28rpx;
    color: var(--see-main-color);
  }

  &__title {
    font-size: 28rpx;
    color: var(--see-main-color);
    font-weight: bold;
  }

  &__desc {
    font-size: 24rpx;
    color: var(--see-tips-color);
    margin-top: 8rpx;
  }

  &--color {
    padding: 32rpx 40rpx;
    border-radius: 20rpx;

    .scroll-item__text {
      color: var(--see-text);
      font-weight: bold;
    }
  }

  &--more {
    background-color: var(--see-info-light);
    border: 2rpx dashed var(--see-border-color);
  }

  &--card {
    width: 280rpx;
    display: flex;
    flex-direction: column;
    padding: 24rpx;
    background-color: var(--see-bg-color);
    box-shadow: var(--see-card-shadow);
  }

  &--vertical {
    margin-bottom: 16rpx;
    width: 100%;
  }
}
</style>
