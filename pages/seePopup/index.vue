<template>
  <see-config>
    <text class="title">{{ t('popup.demo.basic') }}</text>
    <view class="demo-content">
      <see-button :title="t('popup.demo.bottom')" type="primary" is-ripple @click="show1 = true" />
      <see-popup v-model:show="show1">
        <view class="popup-content">
          <text class="popup-text">{{ t('popup.demo.bottomContent') }}</text>
        </view>
      </see-popup>
    </view>

    <text class="title">{{ t('popup.demo.top') }}</text>
    <view class="demo-content">
      <see-button :title="t('popup.demo.top')" type="primary" is-ripple @click="show2 = true" />
      <see-popup v-model:show="show2" position="top">
        <view class="popup-content">
          <text class="popup-text">{{ t('popup.demo.topContent') }}</text>
        </view>
      </see-popup>
    </view>

    <text class="title">{{ t('popup.demo.left') }}</text>
    <view class="demo-content">
      <see-button :title="t('popup.demo.left')" type="primary" is-ripple @click="show3 = true" />
      <see-popup v-model:show="show3" position="left">
        <view class="popup-content popup-content--side">
          <text class="popup-text">{{ t('popup.demo.leftContent') }}</text>
        </view>
      </see-popup>
    </view>

    <text class="title">{{ t('popup.demo.right') }}</text>
    <view class="demo-content">
      <see-button :title="t('popup.demo.right')" type="primary" is-ripple @click="show4 = true" />
      <see-popup v-model:show="show4" position="right">
        <view class="popup-content popup-content--side">
          <text class="popup-text">{{ t('popup.demo.rightContent') }}</text>
        </view>
      </see-popup>
    </view>

    <text class="title">{{ t('popup.demo.center') }}</text>
    <view class="demo-content">
      <see-button :title="t('popup.demo.center')" type="primary" is-ripple @click="show5 = true" />
      <see-popup v-model:show="show5" position="center">
        <view class="popup-content popup-content--center">
          <text class="popup-text">{{ t('popup.demo.centerContent') }}</text>
        </view>
      </see-popup>
    </view>

    <text class="title">{{ t('popup.demo.titleBar') }}</text>
    <view class="demo-content">
      <see-button :title="t('popup.demo.titleBar')" type="primary" is-ripple @click="show6 = true" />
      <see-popup v-model:show="show6" :title="t('popup.demo.title')" is-show-header>
        <view class="popup-content">
          <text class="popup-text">{{ t('popup.demo.titleContent') }}</text>
        </view>
      </see-popup>
    </view>

    <text class="title">{{ t('popup.demo.closeBtn') }}</text>
    <view class="demo-content">
      <see-button :title="t('popup.demo.closeBtn')" type="primary" is-ripple @click="show7 = true" />
      <see-popup v-model:show="show7" is-show-close-btn>
        <view class="popup-content">
          <text class="popup-text">{{ t('popup.demo.closeContent') }}</text>
        </view>
      </see-popup>
    </view>

    <text class="title">{{ t('popup.demo.noOverlay') }}</text>
    <view class="demo-content">
      <see-button :title="t('popup.demo.noOverlay')" type="primary" is-ripple @click="show8 = true" />
      <see-popup v-model:show="show8" :is-overlay="false">
        <view class="popup-content">
          <text class="popup-text">{{ t('popup.demo.noOverlayContent') }}</text>
        </view>
      </see-popup>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seePopup')

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)
const show6 = ref(false)
const show7 = ref(false)
const show8 = ref(false)
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
.popup-content {
  padding: 60rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300rpx;

  &--side {
    min-height: 100vh;
    width: 500rpx;
  }

  &--center {
    width: 500rpx;
    min-height: 300rpx;
    background-color: var(--see-bg-color);
    border-radius: 16rpx;
  }
}
.popup-text {
  font-size: 28rpx;
  color: var(--see-main-color);
}
</style>
