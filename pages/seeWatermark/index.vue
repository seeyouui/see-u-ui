<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('watermark.demo.basic') }}</text>
      <view class="content">
        <see-watermark content="SeeYouUI">
          <view class="demo-card">
            <text class="demo-text">{{ t('watermark.demo.sensitive') }}</text>
          </view>
        </see-watermark>
      </view>

      <text class="title">{{ t('watermark.demo.multiLine') }}</text>
      <view class="content">
        <see-watermark :content="['SeeYouUI', '1.3.1', 'Confidential']" :gap="[120, 60]" rotate="-30" font-color="rgba(255, 107, 107, 0.12)">
          <view class="demo-card">
            <text class="demo-text">{{ t('watermark.demo.multiLineCover') }}</text>
          </view>
        </see-watermark>
      </view>

      <text class="title">{{ t('watermark.demo.custom') }}</text>
      <view class="content">
        <see-watermark content="COPYRIGHT" font-size="40" font-color="rgba(255, 182, 69, 0.18)" :gap="[100, 100]" rotate="-15">
          <view class="demo-card">
            <text class="demo-text">{{ t('watermark.demo.brand') }}</text>
          </view>
        </see-watermark>
      </view>

      <text class="title">{{ t('watermark.demo.empty') }}</text>
      <view class="content">
        <see-watermark content="">
          <view class="demo-card">
            <text class="demo-text">{{ t('watermark.demo.noWatermark') }}</text>
          </view>
        </see-watermark>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeWatermark')
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    color: #999;
  }
  .content {
    margin-top: 12px;
    margin-bottom: 24px;
  }
}

.demo-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200rpx;
  background: var(--see-info, #f8f8f8);
  border-radius: 16rpx;
}

.demo-text {
  font-size: 28rpx;
  color: var(--see-main-color, #2e2f33);
}
</style>
