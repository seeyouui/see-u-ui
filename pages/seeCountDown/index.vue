<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeCountdown')

const countDownRef = ref<{ start: () => void; pause: () => void; reset: (time?: number) => void } | null>(null)

const start = () => countDownRef.value?.start()
const pause = () => countDownRef.value?.pause()
const reset = () => countDownRef.value?.reset(60 * 1000)
</script>

<template>
  <see-config>
    <view class="page">
      <text class="title">{{ t('countdown.demo.basic') }}</text>
      <view class="demo-card">
        <see-count-down :time="10 * 60 * 1000" :auto-start="false" />
      </view>

      <text class="title">{{ t('countdown.demo.days') }}</text>
      <view class="demo-card">
        <see-count-down :time="26 * 60 * 60 * 1000 + 5 * 60 * 1000" show-days :auto-start="false" />
      </view>

      <text class="title">{{ t('countdown.demo.block') }}</text>
      <view class="demo-card">
        <see-count-down :time="90 * 1000" block text-color="var(--see-primary)" font-size="36rpx" />
      </view>

      <text class="title">{{ t('countdown.demo.separator') }}</text>
      <view class="demo-card">
        <see-count-down :time="3661 * 1000" separator=" / " :auto-start="false" />
      </view>

      <text class="title">{{ t('countdown.demo.slot') }}</text>
      <view class="demo-card">
        <see-count-down :time="61000" :auto-start="false">
          <template #default="scope">
            <text class="slot-text">{{ scope.minutes }}{{ t('countdown.minute') }} {{ scope.seconds }}{{ t('countdown.second') }}</text>
          </template>
        </see-count-down>
      </view>

      <text class="title">{{ t('countdown.demo.methods') }}</text>
      <view class="demo-card">
        <see-count-down ref="countDownRef" :time="60 * 1000" :auto-start="false" />
        <view class="actions">
          <button size="mini" type="primary" @tap="start">{{ t('countdown.demo.start') }}</button>
          <button size="mini" @tap="pause">{{ t('countdown.demo.pause') }}</button>
          <button size="mini" @tap="reset">{{ t('countdown.demo.reset') }}</button>
        </view>
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

.slot-text {
  color: var(--see-primary);
  font-size: 32rpx;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}
</style>
