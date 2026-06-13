<template>
  <see-config>
    <view class="demo-page">
      <view class="demo-section">
        <view class="demo-title">{{ t('swiper.demo.basic') }}</view>
        <see-swiper :list="basicList" @on-click="onItemClick" @on-change="onChange" />
      </view>

      <view class="demo-section">
        <view class="demo-title">{{ t('swiper.demo.customHeight') }}</view>
        <see-swiper :list="basicList" height="400rpx" />
      </view>

      <view class="demo-section">
        <view class="demo-title">{{ t('swiper.demo.digitalIndicator') }}</view>
        <see-swiper :list="basicList" indicator-type="digital" />
      </view>

      <view class="demo-section">
        <view class="demo-title">{{ t('swiper.demo.noIndicator') }}</view>
        <see-swiper :list="basicList" indicator-type="none" />
      </view>

      <view class="demo-section">
        <view class="demo-title">{{ t('swiper.demo.customSlot') }}</view>
        <see-swiper :list="basicList" height="400rpx">
          <template #item="{ item, index }">
            <view class="custom-slide">
              <image v-if="item.image" :src="item.image" class="custom-slide__image" mode="aspectFill" />
              <view class="custom-slide__overlay">
                <text class="custom-slide__title">{{ item.title }}</text>
                <text class="custom-slide__index">{{ t('swiper.demo.page', { n: index + 1 }) }}</text>
              </view>
            </view>
          </template>
        </see-swiper>
      </view>

      <view class="demo-section">
        <view class="demo-title">{{ t('swiper.demo.vmodel') }}</view>
        <see-swiper v-model:current="currentSlide" :list="basicList" />
        <view class="demo-controls">
          <see-button size="small" type="primary" is-ripple @click="prevSlide">{{ t('swiper.demo.prev') }}</see-button>
          <text class="demo-page-info">{{ t('swiper.demo.current') }}{{ currentSlide + 1 }} / {{ basicList.length }}</text>
          <see-button size="small" type="primary" is-ripple @click="nextSlide">{{ t('swiper.demo.next') }}</see-button>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeSwiper')

const basicList = ref([
  {
    image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
    title: t('swiper.demo.title1'),
    url: '/pages/index/index'
  },
  {
    image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
    title: t('swiper.demo.title2'),
    url: '/pages/index/index'
  },
  {
    image: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
    title: t('swiper.demo.title3'),
    url: '/pages/index/index'
  }
])

const currentSlide = ref(0)

const onItemClick = (item: any, index: number) => {
  console.log('点击了轮播项:', item.title, index)
}

const onChange = (index: number) => {
  console.log('切换到:', index)
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const nextSlide = () => {
  if (currentSlide.value < basicList.value.length - 1) {
    currentSlide.value++
  }
}
</script>

<style scoped lang="scss">
.demo-page {
  padding: 24rpx;
  background-color: var(--see-bg-color);
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 40rpx;
}

.demo-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--see-main-color);
  margin-bottom: 16rpx;
  padding-left: 8rpx;
}

.demo-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
  padding: 16rpx 24rpx;
  background-color: var(--see-bg-color);
  border-radius: 12rpx;
}

.demo-page-info {
  font-size: 28rpx;
  color: var(--see-content-color);
}

.custom-slide {
  width: 100%;
  height: 100%;
  position: relative;
}

.custom-slide__image {
  width: 100%;
  height: 100%;
  display: block;
}

.custom-slide__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx 24rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
}

.custom-slide__title {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.custom-slide__index {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}
</style>
