<template>
  <see-config>
    <text class="title">{{ t('noNetwork.demo.basic') }}</text>
    <view class="demo-content">
      <see-button type="primary" is-ripple style="margin-right: 20rpx" @click="showBasic = true">{{ t('noNetwork.demo.showBasic') }}</see-button>
      <see-button type="primary" is-ripple @click="showBasic = false">{{ t('noNetwork.demo.hide') }}</see-button>
      <see-no-network v-model:show="showBasic" :auto-check="false" />
    </view>

    <text class="title">{{ t('noNetwork.demo.customText') }}</text>
    <view class="demo-content">
      <see-button type="primary" is-ripple @click="showCustom = true">{{ t('noNetwork.demo.showCustom') }}</see-button>
      <see-no-network
        v-model:show="showCustom"
        :text="t('noNetwork.demo.customErrorText')"
        :retry-text="t('noNetwork.demo.tapToRetry')"
        :auto-check="false"
      />
    </view>

    <text class="title">{{ t('noNetwork.demo.fullscreen') }}</text>
    <view class="demo-content">
      <see-button type="primary" is-ripple @click="showFullscreen = true">{{ t('noNetwork.demo.showFullscreen') }}</see-button>
      <see-no-network v-model:show="showFullscreen" is-fullscreen :auto-check="false" />
    </view>

    <text class="title">{{ t('noNetwork.demo.retryEvent') }}</text>
    <view class="demo-content">
      <see-button type="primary" is-ripple @click="showRetry = true">{{ t('noNetwork.demo.showWithRetry') }}</see-button>
      <see-no-network v-model:show="showRetry" :auto-check="false" @on-retry="handleRetry" />
      <text v-if="retryCount > 0" class="retry-tip">{{ t('noNetwork.demo.retryCount', { count: retryCount }) }}</text>
    </view>

    <text class="title">{{ t('noNetwork.demo.autoListen') }}</text>
    <view class="demo-content">
      <text class="demo-tip">{{ t('noNetwork.demo.autoCheckTip') }}</text>
      <see-no-network v-model:show="showAuto" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeNoNetwork')

const showBasic = ref(false)
const showCustom = ref(false)
const showFullscreen = ref(false)
const showRetry = ref(false)
const showAuto = ref(false)
const retryCount = ref(0)

const handleRetry = () => {
  retryCount.value++
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
.retry-tip {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--see-primary);
}
.demo-tip {
  display: block;
  margin-bottom: 16rpx;
  font-size: 24rpx;
  color: var(--see-tips-color);
}
</style>
