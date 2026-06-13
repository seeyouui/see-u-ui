<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeLineProgress')

const gradientColors = ['var(--see-primary)', 'var(--see-success)']
</script>

<template>
  <see-config>
    <view class="page">
      <text class="title">{{ t('lineProgress.demo.basic') }}</text>
      <view class="demo-card">
        <see-line-progress :percentage="35" />
      </view>

      <text class="title">{{ t('lineProgress.demo.status') }}</text>
      <view class="demo-card demo-card--gap">
        <see-line-progress :percentage="100" status="success" />
        <see-line-progress :percentage="68" status="warning" />
        <see-line-progress :percentage="42" status="error" />
      </view>

      <text class="title">{{ t('lineProgress.demo.gradient') }}</text>
      <view class="demo-card">
        <see-line-progress :percentage="76" :active-color="gradientColors" stroke-width="20rpx" />
      </view>

      <text class="title">{{ t('lineProgress.demo.striped') }}</text>
      <view class="demo-card">
        <see-line-progress :percentage="58" striped animated />
      </view>

      <text class="title">{{ t('lineProgress.demo.textInside') }}</text>
      <view class="demo-card">
        <see-line-progress :percentage="88" text-inside stroke-width="32rpx" />
      </view>

      <text class="title">{{ t('lineProgress.demo.slot') }}</text>
      <view class="demo-card">
        <see-line-progress :percentage="64">
          <template #text="scope">
            <text class="custom-text">{{ t('lineProgress.demo.doneLabel') }}{{ scope.percentage }}%</text>
          </template>
        </see-line-progress>
      </view>
    </view>
  </see-config>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--see-bg-color);
}

.title {
  display: block;
  margin: 28rpx 0 16rpx;
  color: var(--see-tips-color);
  font-size: 28rpx;
}

.demo-card {
  padding: 28rpx;
  border: 1px solid var(--see-border-four-color);
  border-radius: 20rpx;
  background: var(--see-bg-color);
  box-shadow: var(--see-card-shadow);
}

.demo-card--gap {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.custom-text {
  color: var(--see-primary);
  font-size: 24rpx;
  font-weight: 600;
}
</style>
