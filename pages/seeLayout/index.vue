<template>
  <see-config>
    <text class="title">{{ t('layout.demo.equalDivide') }}</text>
    <view class="demo-content">
      <see-layout>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">{{ t('layout.demo.twoToOne') }}</text>
    <view class="demo-content">
      <see-layout>
        <see-layout-item :span="16">
          <view class="grid-item">span=16</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">{{ t('layout.demo.offset') }}</text>
    <view class="demo-content">
      <see-layout>
        <see-layout-item :span="8" :offset="8">
          <view class="grid-item">span=8 offset=8</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">{{ t('layout.demo.withGap') }}</text>
    <view class="demo-content">
      <see-layout :gap="16">
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
        <see-layout-item :span="8">
          <view class="grid-item">span=8</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">{{ t('layout.demo.flexCustom') }}</text>
    <view class="demo-content">
      <see-layout>
        <see-layout-item :flex="2">
          <view class="grid-item">flex=2</view>
        </see-layout-item>
        <see-layout-item :flex="1">
          <view class="grid-item">flex=1</view>
        </see-layout-item>
        <see-layout-item :flex="1">
          <view class="grid-item">flex=1</view>
        </see-layout-item>
      </see-layout>
    </view>

    <text class="title">{{ t('layout.demo.vertical') }}</text>
    <view class="demo-content">
      <see-layout direction="column" :gap="10">
        <see-layout-item>
          <view class="grid-item">{{ t('layout.demo.row1') }}</view>
        </see-layout-item>
        <see-layout-item>
          <view class="grid-item">{{ t('layout.demo.row2') }}</view>
        </see-layout-item>
        <see-layout-item>
          <view class="grid-item">{{ t('layout.demo.row3') }}</view>
        </see-layout-item>
      </see-layout>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeLayout')
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
.grid-item {
  background: var(--see-primary);
  color: #fff;
  text-align: center;
  padding: 20rpx 0;
  font-size: 24rpx;
  border-radius: 8rpx;
}
</style>
