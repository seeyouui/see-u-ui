<template>
  <see-config>
    <text class="title">{{ t('line.demo.horizontal') }}</text>
    <view class="demo-content">
      <text>{{ t('line.demo.topContent') }}</text>
      <see-line />
      <text>{{ t('line.demo.bottomContent') }}</text>
    </view>

    <text class="title">{{ t('line.demo.customColor') }}</text>
    <view class="demo-content">
      <text>{{ t('line.demo.topContent') }}</text>
      <see-line color="#007aff" />
      <text>{{ t('line.demo.bottomContent') }}</text>
    </view>

    <text class="title">{{ t('line.demo.customThickness') }}</text>
    <view class="demo-content">
      <text>{{ t('line.demo.topContent') }}</text>
      <see-line size="4rpx" />
      <text>{{ t('line.demo.bottomContent') }}</text>
    </view>

    <text class="title">{{ t('line.demo.dashed') }}</text>
    <view class="demo-content">
      <text>{{ t('line.demo.topContent') }}</text>
      <see-line :is-dashed="true" />
      <text>{{ t('line.demo.bottomContent') }}</text>
    </view>

    <text class="title">{{ t('line.demo.customLength') }}</text>
    <view class="demo-content">
      <see-line length="50%" />
    </view>

    <text class="title">{{ t('line.demo.vertical') }}</text>
    <view class="demo-content">
      <view style="display: flex; align-items: center; height: 60rpx">
        <text>{{ t('line.demo.left') }}</text>
        <see-line direction="vertical" length="60rpx" margin="0 20rpx" />
        <text>{{ t('line.demo.right') }}</text>
      </view>
    </view>

    <text class="title">{{ t('line.demo.verticalDashed') }}</text>
    <view class="demo-content">
      <view style="display: flex; align-items: center; height: 60rpx">
        <text>{{ t('line.demo.left') }}</text>
        <see-line direction="vertical" :is-dashed="true" length="60rpx" margin="0 20rpx" />
        <text>{{ t('line.demo.right') }}</text>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeLine')
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
