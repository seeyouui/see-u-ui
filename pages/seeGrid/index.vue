<template>
  <see-config>
    <text class="title">{{ t('grid.demo.basic4col') }}</text>
    <view class="demo-content">
      <see-grid>
        <see-grid-item v-for="i in 8" :key="i" :text="t('grid.demo.grid') + i" icon="📱" />
      </see-grid>
    </view>

    <text class="title">{{ t('grid.demo.threeColumns') }}</text>
    <view class="demo-content">
      <see-grid :columns="3">
        <see-grid-item v-for="i in 6" :key="i" :text="t('grid.demo.grid') + i" icon="⭐" />
      </see-grid>
    </view>

    <text class="title">{{ t('grid.demo.withBorder') }}</text>
    <view class="demo-content">
      <see-grid :columns="3" border>
        <see-grid-item v-for="i in 6" :key="i" :text="t('grid.demo.grid') + i" icon="📌" />
      </see-grid>
    </view>

    <text class="title">{{ t('grid.demo.withGap') }}</text>
    <view class="demo-content">
      <see-grid :columns="3" gap="16rpx">
        <see-grid-item v-for="i in 6" :key="i" :text="t('grid.demo.grid') + i" icon="🎨" />
      </see-grid>
    </view>

    <text class="title">{{ t('grid.demo.square') }}</text>
    <view class="demo-content">
      <see-grid :columns="4" is-square>
        <see-grid-item v-for="i in 8" :key="i" :text="t('grid.demo.item') + i" icon="📐" />
      </see-grid>
    </view>

    <text class="title">{{ t('grid.demo.clickFeedback') }}</text>
    <view class="demo-content">
      <see-grid :columns="4" is-clickable>
        <see-grid-item v-for="i in 4" :key="i" :index="i - 1" :text="t('grid.demo.click') + i" icon="👆" @on-click="onItemClick" />
      </see-grid>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeGrid')

const onItemClick = (index: number) => {
  uni.showToast({ title: t('grid.demo.clickedItem', { index }), icon: 'none' })
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
</style>
