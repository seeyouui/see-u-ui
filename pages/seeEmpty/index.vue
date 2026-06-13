<template>
  <view class="demo-empty">
    <!-- 1. 默认类型 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('empty.demo.default') }}</text>
      <see-empty type="default" />
    </view>

    <!-- 2. 搜索无结果 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('empty.demo.search') }}</text>
      <see-empty type="search" />
    </view>

    <!-- 3. 网络异常 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('empty.demo.network') }}</text>
      <see-empty type="network" :is-show-action="true" :action-text="t('empty.demo.retry')" @on-action="onRetry" />
    </view>

    <!-- 4. 页面出错 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('empty.demo.error') }}</text>
      <see-empty type="error" :is-show-action="true" :action-text="t('empty.demo.refresh')" @on-action="onRefresh" />
    </view>

    <!-- 5. 404 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('empty.demo.notFound') }}</text>
      <see-empty type="404" :is-show-action="true" :action-text="t('empty.demo.goHome')" @on-action="onGoHome" />
    </view>

    <!-- 6. 自定义标题和描述 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('empty.demo.custom') }}</text>
      <see-empty
        :title="t('empty.demo.customTitle')"
        :description="t('empty.demo.customDesc')"
        :is-show-action="true"
        :action-text="t('empty.demo.shop')"
      />
    </view>

    <!-- 底部占位 -->
    <view style="height: 100rpx" />
  </view>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeeEmpty from '@/uni_modules/see-u-ui/components/see-empty/see-empty.vue'

const { t } = useI18n()
useNavbarI18n('navbar.seeEmpty')

const onRetry = () => {
  uni.showToast({ title: t('empty.demo.retrying'), icon: 'none' })
}

const onRefresh = () => {
  uni.showToast({ title: t('empty.demo.refreshing'), icon: 'none' })
}

const onGoHome = () => {
  uni.showToast({ title: t('empty.demo.goingHome'), icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-empty {
  padding: 0 32rpx 40rpx;
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 48rpx;
  border-bottom: 1rpx solid var(--see-border-four-color);
  padding-bottom: 32rpx;

  &:last-child {
    border-bottom: none;
  }

  &__title {
    display: block;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }
}
</style>
