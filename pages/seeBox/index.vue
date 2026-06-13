<template>
  <see-config>
    <text class="title">{{ t('box.demo.basic') }}</text>
    <view class="demo-content">
      <see-box padding="20rpx" bg-color="var(--see-info)">
        <text>{{ t('box.demo.boxContent') }}</text>
      </see-box>
    </view>

    <text class="title">{{ t('box.demo.flexLayout') }}</text>
    <view class="demo-content">
      <see-box direction="row" justify="space-between" align="center" padding="20rpx" bg-color="var(--see-primary-light)">
        <text>{{ t('box.demo.left') }}</text>
        <text>{{ t('box.demo.center') }}</text>
        <text>{{ t('box.demo.right') }}</text>
      </see-box>
    </view>

    <text class="title">{{ t('box.demo.shadow') }}</text>
    <view class="demo-content">
      <see-box direction="row" gap="20rpx" wrap="wrap">
        <see-box padding="30rpx" radius="12rpx" shadow="small">
          <text>{{ t('box.demo.smallShadow') }}</text>
        </see-box>
        <see-box padding="30rpx" radius="12rpx" shadow="medium">
          <text>{{ t('box.demo.mediumShadow') }}</text>
        </see-box>
        <see-box padding="30rpx" radius="12rpx" shadow="large">
          <text>{{ t('box.demo.largeShadow') }}</text>
        </see-box>
      </see-box>
    </view>

    <text class="title">{{ t('box.demo.vertical') }}</text>
    <view class="demo-content">
      <see-box direction="column" gap="16rpx" padding="20rpx" bg-color="var(--see-info-light)">
        <text>{{ t('box.demo.row1') }}</text>
        <text>{{ t('box.demo.row2') }}</text>
        <text>{{ t('box.demo.row3') }}</text>
      </see-box>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeBox')
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
