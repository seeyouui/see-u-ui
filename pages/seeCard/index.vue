<template>
  <see-config>
    <text class="title">{{ t('card.demo.basic') }}</text>
    <view class="demo-content">
      <see-card :title="t('card.demo.cardTitle')">
        <text>{{ t('card.demo.cardContent') }}</text>
      </see-card>
    </view>

    <text class="title">{{ t('card.demo.withSubtitle') }}</text>
    <view class="demo-content">
      <see-card :title="t('card.demo.cardTitle')" :sub-title="t('card.demo.subtitleDesc')">
        <text>{{ t('card.demo.cardContent') }}</text>
      </see-card>
    </view>

    <text class="title">{{ t('card.demo.customHeader') }}</text>
    <view class="demo-content">
      <see-card>
        <template #header>
          <view style="display: flex; align-items: center; justify-content: space-between">
            <text style="font-size: 30rpx; font-weight: 600">{{ t('card.demo.customHeaderTitle') }}</text>
            <text style="font-size: 24rpx; color: #999">{{ t('card.demo.more') }}</text>
          </view>
        </template>
        <text>{{ t('card.demo.customHeaderContent') }}</text>
      </see-card>
    </view>

    <text class="title">{{ t('card.demo.withFooter') }}</text>
    <view class="demo-content">
      <see-card :title="t('card.demo.cardTitle')">
        <text>{{ t('card.demo.cardContent') }}</text>
        <template #footer>
          <view style="display: flex; justify-content: flex-end; gap: 20rpx">
            <text style="color: var(--see-primary)">{{ t('card.demo.cancel') }}</text>
            <text style="color: var(--see-primary)">{{ t('card.demo.confirm') }}</text>
          </view>
        </template>
      </see-card>
    </view>

    <text class="title">{{ t('card.demo.differentShadow') }}</text>
    <view class="demo-content">
      <see-card :title="t('card.demo.alwaysShadow')" shadow="always" margin="0 0 20rpx">
        <text>shadow="always"</text>
      </see-card>
      <see-card :title="t('card.demo.neverShadow')" shadow="never" margin="0 0 20rpx">
        <text>shadow="never"</text>
      </see-card>
      <see-card :title="t('card.demo.hoverShadow')" shadow="hover" margin="0 0 20rpx">
        <text>shadow="hover"</text>
      </see-card>
    </view>

    <text class="title">{{ t('card.demo.noBorder') }}</text>
    <view class="demo-content">
      <see-card :title="t('card.demo.noBorderCard')" :border="false">
        <text>{{ t('card.demo.noBorderText') }}</text>
      </see-card>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeCard')
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
