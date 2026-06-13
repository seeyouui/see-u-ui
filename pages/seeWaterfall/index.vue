<template>
  <see-config>
    <text class="title">{{ t('waterfall.demo.basic2col') }}</text>
    <view class="demo-content">
      <see-waterfall :list="basicList" />
    </view>

    <text class="title">{{ t('waterfall.demo.threeColumns') }}</text>
    <view class="demo-content">
      <see-waterfall :list="basicList" :columns="3" gap="12rpx" />
    </view>

    <text class="title">{{ t('waterfall.demo.customSlot') }}</text>
    <view class="demo-content">
      <see-waterfall :list="basicList">
        <template #item="{ item }">
          <view class="custom-item">
            <image v-if="item.image" :src="item.image" class="custom-item__image" mode="widthFix" />
            <view class="custom-item__info">
              <text class="custom-item__title">{{ item.title }}</text>
              <text class="custom-item__desc">{{ t('waterfall.demo.customDesc') }}</text>
            </view>
          </view>
        </template>
      </see-waterfall>
    </view>

    <text class="title">{{ t('waterfall.demo.loadMore') }}</text>
    <view class="demo-content">
      <see-waterfall :list="basicList" has-more @on-load-more="onLoadMore" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeWaterfall')

const basicList = [
  { id: 1, title: t('waterfall.demo.item1'), image: 'https://picsum.photos/300/200?random=1' },
  { id: 2, title: t('waterfall.demo.item2'), image: 'https://picsum.photos/300/300?random=2' },
  { id: 3, title: t('waterfall.demo.item3'), image: 'https://picsum.photos/300/250?random=3' },
  { id: 4, title: t('waterfall.demo.item4'), image: 'https://picsum.photos/300/350?random=4' },
  { id: 5, title: t('waterfall.demo.item5'), image: 'https://picsum.photos/300/280?random=5' },
  { id: 6, title: t('waterfall.demo.item6'), image: 'https://picsum.photos/300/320?random=6' }
]

function onLoadMore() {
  console.log('触发加载更多')
}
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

.custom-item {
  display: flex;
  flex-direction: column;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #fff;

  &__image {
    width: 100%;
    display: block;
  }

  &__info {
    padding: 16rpx;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--see-main-color);
  }

  &__desc {
    font-size: 22rpx;
    color: var(--see-tips-color);
    margin-top: 8rpx;
  }
}
</style>
