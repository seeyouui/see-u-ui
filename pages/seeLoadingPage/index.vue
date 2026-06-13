<template>
  <see-config>
    <view class="demo-loading-page">
      <view class="demo-section">
        <text class="demo-title">{{ t('loadingPage.demo.basic') }}</text>
        <view class="demo-box">
          <see-loading-page :loading="basicLoading" :message="t('loadingPage.loading')">
            <view class="demo-content">
              <text>{{ t('loadingPage.demo.loadedContent') }}</text>
            </view>
          </see-loading-page>
        </view>
        <see-button size="mini" type="primary" is-ripple @click="basicLoading = !basicLoading">
          {{ basicLoading ? t('loadingPage.demo.loadComplete') : t('loadingPage.demo.reload') }}
        </see-button>
      </view>

      <view class="demo-section">
        <text class="demo-title">{{ t('loadingPage.demo.customMessage') }}</text>
        <view class="demo-box">
          <see-loading-page :loading="true" :message="t('loadingPage.demo.fetchingData')" />
        </view>
      </view>

      <view class="demo-section">
        <text class="demo-title">{{ t('loadingPage.demo.customIconType') }}</text>
        <view class="demo-box">
          <see-loading-page :loading="true" icon-type="circular" :message="t('loadingPage.demo.circularType')" />
        </view>
      </view>

      <view class="demo-section">
        <text class="demo-title">{{ t('loadingPage.demo.simulateComplete') }}</text>
        <view class="demo-box">
          <see-loading-page :loading="simLoading" :message="t('loadingPage.demo.simulating')">
            <view class="demo-content">
              <text>{{ t('loadingPage.demo.simulateLoaded') }}</text>
              <text>{{ t('loadingPage.demo.asyncContent') }}</text>
            </view>
          </see-loading-page>
        </view>
        <see-button size="mini" type="primary" is-ripple @click="startSimulate">{{ t('loadingPage.demo.startSimulate') }}</see-button>
      </view>

      <view class="demo-section">
        <text class="demo-title">{{ t('loadingPage.demo.fullscreen') }}</text>
        <see-button size="mini" type="primary" is-ripple @click="fullscreenLoading = true">{{ t('loadingPage.demo.showFullscreen') }}</see-button>
        <see-loading-page :loading="fullscreenLoading" is-fullscreen :message="t('loadingPage.demo.fullscreenLoading')">
          <view class="demo-content">
            <text>{{ t('loadingPage.demo.fullscreenLoaded') }}</text>
          </view>
        </see-loading-page>
        <see-button v-if="fullscreenLoading" size="mini" type="primary" is-ripple @click="fullscreenLoading = false">
          {{ t('loadingPage.demo.closeFullscreen') }}
        </see-button>
      </view>

      <view class="demo-section">
        <text class="demo-title">{{ t('loadingPage.demo.customBg') }}</text>
        <view class="demo-box">
          <see-loading-page :loading="true" :message="t('loadingPage.demo.customBgText')" background="rgba(0, 0, 0, 0.6)" />
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeLoadingPage')

const basicLoading = ref(true)
const simLoading = ref(false)
const fullscreenLoading = ref(false)

function startSimulate() {
  simLoading.value = true
  setTimeout(() => {
    simLoading.value = false
  }, 2000)
}
</script>

<style lang="scss" scoped>
.demo-loading-page {
  padding: 24rpx;
}

.demo-section {
  margin-bottom: 40rpx;
}

.demo-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.demo-box {
  border: 1rpx solid #eee;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
  min-height: 300rpx;
}

.demo-content {
  padding: 40rpx;
  text-align: center;
  font-size: 28rpx;
}
</style>
