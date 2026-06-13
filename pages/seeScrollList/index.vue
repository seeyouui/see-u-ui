<template>
  <see-config>
    <text class="title">{{ t('scrollList.demo.basicHorizontal') }}</text>
    <view class="demo-content">
      <see-scroll-list :list="basicList">
        <template #item="{ item }">
          <view class="scroll-item">
            <text class="scroll-item__text">{{ item }}</text>
          </view>
        </template>
      </see-scroll-list>
    </view>

    <text class="title">{{ t('scrollList.demo.customStyle') }}</text>
    <view class="demo-content">
      <see-scroll-list :list="colorList" item-gap="24rpx">
        <template #item="{ item }">
          <view class="scroll-item scroll-item--color" :style="{ backgroundColor: item.color }">
            <text class="scroll-item__text">{{ item.label }}</text>
          </view>
        </template>
      </see-scroll-list>
    </view>

    <text class="title">{{ t('scrollList.demo.withFooter') }}</text>
    <view class="demo-content">
      <see-scroll-list :list="basicList.slice(0, 4)">
        <template #item="{ item }">
          <view class="scroll-item">
            <text class="scroll-item__text">{{ item }}</text>
          </view>
        </template>
        <template #footer>
          <view class="scroll-item scroll-item--more" @click="handleLoadMore">
            <text class="scroll-item__text">{{ t('scrollList.demo.more') }}</text>
          </view>
        </template>
      </see-scroll-list>
    </view>

    <text class="title">{{ t('scrollList.demo.loadMore') }}</text>
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

    <text class="title">{{ t('scrollList.demo.vertical') }}</text>
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
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeScrollList')

const basicList = ref([
  t('scrollList.demo.recommend'),
  t('scrollList.demo.hot'),
  t('scrollList.demo.follow'),
  t('scrollList.demo.tech'),
  t('scrollList.demo.finance'),
  t('scrollList.demo.sports'),
  t('scrollList.demo.entertainment'),
  t('scrollList.demo.education')
])

const colorList = ref([
  { label: t('scrollList.demo.red'), color: '#ff4757' },
  { label: t('scrollList.demo.orange'), color: '#ff6348' },
  { label: t('scrollList.demo.yellow'), color: '#ffa502' },
  { label: t('scrollList.demo.green'), color: '#2ed573' },
  { label: t('scrollList.demo.blue'), color: '#1e90ff' },
  { label: t('scrollList.demo.purple'), color: '#a55eea' }
])

const loadMoreList = ref([
  { title: t('scrollList.demo.card', { n: 1 }), desc: t('scrollList.demo.cardDesc') },
  { title: t('scrollList.demo.card', { n: 2 }), desc: t('scrollList.demo.cardDesc') },
  { title: t('scrollList.demo.card', { n: 3 }), desc: t('scrollList.demo.cardDesc') }
])

let loadMoreCount = 0

const onLoadMore = () => {
  if (loadMoreCount >= 3) {
    uni.showToast({ title: t('scrollList.demo.noMore'), icon: 'none' })
    return
  }
  loadMoreCount++
  const newItems = Array.from({ length: 3 }, (_, i) => ({
    title: t('scrollList.demo.card', { n: loadMoreList.value.length + i + 1 }),
    desc: t('scrollList.demo.loadedContent')
  }))
  loadMoreList.value.push(...newItems)
}

const handleLoadMore = () => {
  uni.showToast({ title: t('scrollList.demo.clickedMore'), icon: 'none' })
}

const verticalList = ref(Array.from({ length: 20 }, (_, i) => `${t('scrollList.demo.verticalItem')} ${i + 1}`))
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
