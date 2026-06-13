<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeList')

// 基础列表数据
const baseList = ref([
  { id: 1, name: t('list.data.zhangsan'), desc: t('list.data.frontendDev') },
  { id: 2, name: t('list.data.lisi'), desc: t('list.data.backendDev') },
  { id: 3, name: t('list.data.wangwu'), desc: t('list.data.pm') },
  { id: 4, name: t('list.data.zhaoliu'), desc: t('list.data.uiDesigner') },
  { id: 5, name: t('list.data.qianqi'), desc: t('list.data.testEngineer') }
])

// 加载更多列表
const loadMoreList = ref([
  { id: 1, name: t('list.data.productName', { letter: 'A' }), price: '¥19.99' },
  { id: 2, name: t('list.data.productName', { letter: 'B' }), price: '¥29.99' },
  { id: 3, name: t('list.data.productName', { letter: 'C' }), price: '¥39.99' }
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
        name: t('list.data.productName', { letter: String.fromCharCode(64 + loadMoreList.value.length + 1) }),
        price: `¥${((loadMoreList.value.length + 1) * 10).toFixed(2)}`
      },
      {
        id: loadMoreList.value.length + 2,
        name: t('list.data.productName', { letter: String.fromCharCode(64 + loadMoreList.value.length + 2) }),
        price: `¥${((loadMoreList.value.length + 2) * 10).toFixed(2)}`
      },
      {
        id: loadMoreList.value.length + 3,
        name: t('list.data.productName', { letter: String.fromCharCode(64 + loadMoreList.value.length + 3) }),
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
  { id: 1, name: t('list.data.beijing'), region: t('list.data.northChina') },
  { id: 2, name: t('list.data.tianjin'), region: t('list.data.northChina') },
  { id: 3, name: t('list.data.shanghai'), region: t('list.data.eastChina') },
  { id: 4, name: t('list.data.nanjing'), region: t('list.data.eastChina') },
  { id: 5, name: t('list.data.guangzhou'), region: t('list.data.southChina') },
  { id: 6, name: t('list.data.shenzhen'), region: t('list.data.southChina') },
  { id: 7, name: t('list.data.chengdu'), region: t('list.data.southwestChina') },
  { id: 8, name: t('list.data.chongqing'), region: t('list.data.southwestChina') }
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
      <text class="title">{{ t('list.demo.basic') }}</text>
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
      <text class="title">{{ t('list.demo.divided') }}</text>
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
      <text class="title">{{ t('list.demo.empty') }}</text>
      <view class="demo-card">
        <see-list :list="emptyList" :empty-text="t('list.demo.emptyText')" />
      </view>

      <!-- 加载状态 -->
      <text class="title">{{ t('list.demo.loading') }}</text>
      <view class="demo-card">
        <see-list :list="emptyList" :loading="true" :loading-text="t('list.demo.loadingText')" />
      </view>

      <!-- 错误状态 -->
      <text class="title">{{ t('list.demo.error') }}</text>
      <view class="demo-card">
        <see-list :list="hasError ? baseList : []" :error="!hasError" :error-text="t('list.demo.errorText')" @on-retry="toggleError" />
      </view>

      <!-- 插槽用法 -->
      <text class="title">{{ t('list.demo.slot') }}</text>
      <view class="demo-card">
        <see-list :list="baseList" key-field="id">
          <template #header>
            <view class="custom-header">
              <text class="custom-header__text">{{ t('list.demo.employeeList') }}</text>
            </view>
          </template>
          <template #item="{ item }">
            <view class="list-item">
              <text class="list-item__name">{{ item.name }}</text>
            </view>
          </template>
          <template #footer>
            <view class="custom-footer">
              <text class="custom-footer__text">{{ t('list.demo.totalCount', { count: baseList.length }) }}</text>
            </view>
          </template>
        </see-list>
      </view>

      <!-- 分组展示 -->
      <text class="title">{{ t('list.demo.group') }}</text>
      <view class="demo-card">
        <see-list :list="groupList" key-field="id" :group-by="'region'">
          <template #group="{ group, count }">
            <view class="group-header">
              <text class="group-header__title">{{ group }}</text>
              <text class="group-header__count">{{ t('list.demo.cityCount', { count }) }}</text>
            </view>
          </template>
          <template #item="{ item }">
            <text>{{ item.name }}</text>
          </template>
        </see-list>
      </view>

      <!-- 加载更多 -->
      <text class="title">{{ t('list.demo.loadMore') }}</text>
      <view class="demo-card">
        <see-list
          :list="loadMoreList"
          key-field="id"
          :loading="loading"
          :finished="finished"
          :finished-text="t('list.demo.finishedText')"
          @on-load-more="onLoadMore"
        >
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
