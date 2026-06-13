<template>
  <see-config>
    <text class="title">{{ t('copy.demo.basic') }}</text>
    <view class="demo-content">
      <see-copy :text="t('copy.demo.copyText')">
        <see-button :title="t('copy.demo.copyBtn')" type="primary" />
      </see-copy>
    </view>

    <text class="title">{{ t('copy.demo.orderNo') }}</text>
    <view class="demo-content">
      <view class="copy-row">
        <text class="copy-label">{{ t('copy.demo.orderLabel') }}</text>
        <see-copy :text="t('copy.demo.orderValue')">
          <text class="copy-value">{{ t('copy.demo.orderValue') }}</text>
        </see-copy>
      </view>
    </view>

    <text class="title">{{ t('copy.demo.inviteCode') }}</text>
    <view class="demo-content">
      <view class="copy-row">
        <text class="copy-label">{{ t('copy.demo.inviteLabel') }}</text>
        <see-copy :text="t('copy.demo.inviteValue')" :toast-message="t('copy.demo.inviteToast')">
          <text class="copy-value copy-value--highlight">{{ t('copy.demo.inviteValue') }}</text>
        </see-copy>
      </view>
    </view>

    <text class="title">{{ t('copy.demo.customTip') }}</text>
    <view class="demo-content">
      <see-copy :text="t('copy.demo.customTip')" :toast-message="t('copy.demo.customToastMsg')">
        <see-button :title="t('copy.demo.customBtn')" type="primary" />
      </see-copy>
    </view>

    <text class="title">{{ t('copy.demo.noToast') }}</text>
    <view class="demo-content">
      <see-copy :text="t('copy.demo.silentText')" :is-show-toast="false" @on-success="onSuccess">
        <see-button :title="t('copy.demo.silentBtn')" type="primary" />
      </see-copy>
    </view>

    <text class="title">{{ t('copy.demo.disabled') }}</text>
    <view class="demo-content">
      <see-copy :text="t('copy.demo.disabledText')" is-disabled>
        <see-button :title="t('copy.demo.disabledBtn')" type="info" />
      </see-copy>
    </view>

    <text class="title">{{ t('copy.demo.imperative') }}</text>
    <view class="demo-content">
      <see-button :title="t('copy.demo.imperativeBtn')" type="primary" @click="handleCopy" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { toast, seeCopy, useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeCopy')

const onSuccess = () => {
  toast.success(t('copy.demo.clipboardSuccess'))
}

const handleCopy = async () => {
  const success = await seeCopy.copy(t('copy.demo.imperativeText'))
  if (success) {
    toast.success(t('copy.demo.copySuccess'))
  }
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
.copy-row {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: var(--see-info);
  border-radius: 8rpx;
}
.copy-label {
  font-size: 28rpx;
  color: var(--see-content-color);
}
.copy-value {
  font-size: 28rpx;
  color: var(--see-primary);

  &--highlight {
    font-weight: bold;
    text-decoration: underline;
  }
}
</style>
