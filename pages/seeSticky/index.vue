<template>
  <see-config>
    <text class="title">{{ t('sticky.demo.basic') }}</text>
    <view class="demo-content">
      <view style="height: 200rpx; background: var(--see-info); display: flex; align-items: center; justify-content: center">
        <text>{{ t('sticky.demo.scrollHint') }}</text>
      </view>
      <see-sticky>
        <view style="background: var(--see-primary); padding: 20rpx; color: var(--see-text)">
          <text style="color: var(--see-text)">{{ t('sticky.demo.stickyContent') }}</text>
        </view>
      </see-sticky>
      <view style="height: 1000rpx; padding: 20rpx">
        <text>{{ t('sticky.demo.longContent') }}</text>
      </view>
    </view>

    <text class="title">{{ t('sticky.demo.customOffset') }}</text>
    <view class="demo-content">
      <view style="height: 200rpx; background: var(--see-info); display: flex; align-items: center; justify-content: center">
        <text>{{ t('sticky.demo.offsetHint') }}</text>
      </view>
      <see-sticky :offset-top="100">
        <view style="background: var(--see-success); padding: 20rpx">
          <text style="color: var(--see-text)">{{ t('sticky.demo.offsetValue') }}</text>
        </view>
      </see-sticky>
      <view style="height: 1000rpx; padding: 20rpx">
        <text>{{ t('sticky.demo.longContent') }}</text>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeSticky')
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
