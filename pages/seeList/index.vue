<script lang="ts" setup>
import { ref } from 'vue'

// 基础列表数据
const baseList = ref([
  { id: 1, name: '张三', desc: '前端开发工程师' },
  { id: 2, name: '李四', desc: '后端开发工程师' },
  { id: 3, name: '王五', desc: '产品经理' },
  { id: 4, name: '赵六', desc: 'UI 设计师' },
  { id: 5, name: '钱七', desc: '测试工程师' }
])

// 加载更多列表
const loadMoreList = ref([
  { id: 1, name: '商品 A', price: '¥19.99' },
  { id: 2, name: '商品 B', price: '¥29.99' },
  { id: 3, name: '商品 C', price: '¥39.99' }
])
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)

const onLoadMore = () => {
  if (loading.value || finished.value) return
  loading.value = true

  setTimeout(() => {
    pageNum.value++
    const newItems = [
      {
        id: loadMoreList.value.length + 1,
        name: `商品 ${String.fromCharCode(64 + loadMoreList.value.length + 1)}`,
        price: `¥${((loadMoreList.value.length + 1) * 10).toFixed(2)}`
      },
      {
        id: loadMoreList.value.length + 2,
        name: `商品 ${String.fromCharCode(64 + loadMoreList.value.length + 2)}`,
        price: `¥${((loadMoreList.value.length + 2) * 10).toFixed(2)}`
      },
      {
        id: loadMoreList.value.length + 3,
        name: `商品 ${String.fromCharCode(64 + loadMoreList.value.length + 3)}`,
        price: `¥${((loadMoreList.value.length + 3) * 10).toFixed(2)}`
      }
    ]
    loadMoreList.value = [...loadMoreList.value, ...newItems]
    loading.value = false
    if (pageNum.value >= 3) finished.value = true
  }, 1000)
}

// 分组列表数据
const groupList = ref([
  { id: 1, name: '北京', region: '华北' },
  { id: 2, name: '天津', region: '华北' },
  { id: 3, name: '上海', region: '华东' },
  { id: 4, name: '南京', region: '华东' },
  { id: 5, name: '广州', region: '华南' },
  { id: 6, name: '深圳', region: '华南' },
  { id: 7, name: '成都', region: '西南' },
  { id: 8, name: '重庆', region: '西南' }
])

// 空状态和错误状态演示
const emptyList = ref<unknown[]>([])
const hasError = ref(false)

const toggleError = () => {
  hasError.value = !hasError.value
}
</script>

<template>
  <see-config>
    <view class="page">
      <!-- 基础用法 -->
      <text class="title">基础用法</text>
      <view class="demo-card">
        <see-list :list="baseList" key-field="id">
          <template #item="{ item, index }">
            <view class="list-item">
              <view class="list-item__info">
                <text class="list-item__name">{{ item.name }}</text>
                <text class="list-item__desc">{{ item.desc }}</text>
              </view>
              <text class="list-item__index">#{{ index + 1 }}</text>
            </view>
          </template>
        </see-list>
      </view>

      <!-- 分割线样式 -->
      <text class="title">分割线样式</text>
      <view class="demo-card">
        <see-list :list="baseList" key-field="id" divided>
          <template #item="{ item, index }">
            <view class="list-item">
              <text class="list-item__name">{{ item.name }}</text>
              <text class="list-item__index">#{{ index + 1 }}</text>
            </view>
          </template>
        </see-list>
      </view>

      <!-- 空状态 -->
      <text class="title">空状态</text>
      <view class="demo-card">
        <see-list :list="emptyList" empty-text="暂无数据，请稍后再试" />
      </view>

      <!-- 加载状态 -->
      <text class="title">加载状态</text>
      <view class="demo-card">
        <see-list :list="emptyList" :loading="true" loading-text="数据加载中..." />
      </view>

      <!-- 错误状态 -->
      <text class="title">错误状态</text>
      <view class="demo-card">
        <see-list :list="hasError ? baseList : []" :error="!hasError" error-text="加载失败，点击重试" @on-retry="toggleError" />
      </view>

      <!-- 插槽用法 -->
      <text class="title">插槽用法（Header/Footer）</text>
      <view class="demo-card">
        <see-list :list="baseList" key-field="id">
          <template #header>
            <view class="custom-header">
              <text class="custom-header__text">📋 员工列表</text>
            </view>
          </template>
          <template #item="{ item }">
            <view class="list-item">
              <text class="list-item__name">{{ item.name }}</text>
            </view>
          </template>
          <template #footer>
            <view class="custom-footer">
              <text class="custom-footer__text">共 {{ baseList.length }} 人</text>
            </view>
          </template>
        </see-list>
      </view>

      <!-- 分组展示 -->
      <text class="title">分组展示</text>
      <view class="demo-card">
        <see-list :list="groupList" key-field="id" :group-by="'region'">
          <template #group="{ group, count }">
            <view class="group-header">
              <text class="group-header__title">{{ group }}</text>
              <text class="group-header__count">{{ count }} 个城市</text>
            </view>
          </template>
          <template #item="{ item }">
            <text>{{ item.name }}</text>
          </template>
        </see-list>
      </view>

      <!-- 加载更多 -->
      <text class="title">加载更多</text>
      <view class="demo-card">
        <see-list :list="loadMoreList" key-field="id" :loading="loading" :finished="finished" finished-text="全部加载完成" @on-load-more="onLoadMore">
          <template #item="{ item }">
            <view class="list-item">
              <text class="list-item__name">{{ item.name }}</text>
              <text class="list-item__price">{{ item.price }}</text>
            </view>
          </template>
        </see-list>
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
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
  }

  &__name {
    font-size: 28rpx;
    color: var(--see-text-color);
  }

  &__desc {
    font-size: 24rpx;
    color: var(--see-info-dark);
  }

  &__price {
    font-size: 28rpx;
    color: var(--see-error);
    font-weight: 600;
  }

  &__index {
    font-size: 24rpx;
    color: var(--see-info-dark);
  }
}

.custom-header {
  padding: 20rpx 24rpx;
  border-bottom: 1px solid var(--see-border-four-color);

  &__text {
    font-size: 30rpx;
    font-weight: 600;
    color: var(--see-text-color);
  }
}

.custom-footer {
  padding: 16rpx 24rpx;
  border-top: 1px solid var(--see-border-four-color);
  text-align: center;

  &__text {
    font-size: 24rpx;
    color: var(--see-info-dark);
  }
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  background: var(--see-fill-color-light);

  &__title {
    font-size: 26rpx;
    font-weight: 600;
    color: var(--see-text-color);
  }

  &__count {
    font-size: 22rpx;
    color: var(--see-info-dark);
  }
}
</style>
