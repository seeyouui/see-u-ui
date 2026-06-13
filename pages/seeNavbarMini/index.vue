<template>
  <view class="demo-navbar-mini">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navbarMini.demo.basic') }}</text>
      <see-navbar-mini :title="t('navbarMini.demo.subPageTitle')" @on-back="onBack" />
    </view>

    <!-- 2. 自定义标题 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navbarMini.demo.customTitle') }}</text>
      <see-navbar-mini :title="t('navbarMini.demo.settingsPage')" @on-back="onBack" />
    </view>

    <!-- 3. 无返回按钮 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navbarMini.demo.noBack') }}</text>
      <see-navbar-mini :title="t('navbarMini.demo.popupTitle')" :is-show-back="false" />
    </view>

    <!-- 4. 右侧插槽 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navbarMini.demo.rightSlot') }}</text>
      <see-navbar-mini :title="t('navbarMini.demo.details')" @on-back="onBack">
        <template #right>
          <text class="action-text">{{ t('navbarMini.demo.save') }}</text>
        </template>
      </see-navbar-mini>
    </view>

    <!-- 5. 自定义背景色 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navbarMini.demo.customBg') }}</text>
      <see-navbar-mini :title="t('navbarMini.demo.blueTheme')" bg-color="#3ca7ff" @on-back="onBack" />
    </view>

    <!-- 6. 弹窗内使用 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navbarMini.demo.inPopup') }}</text>
      <view class="mock-popup">
        <see-navbar-mini :title="t('navbarMini.demo.popupContent')" :is-show-back="false">
          <template #right>
            <text class="close-icon">✕</text>
          </template>
        </see-navbar-mini>
        <view class="mock-popup__content">
          <text>{{ t('navbarMini.demo.popupContentArea') }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeeNavbarMini from '@/uni_modules/see-u-ui/components/see-navbar-mini/see-navbar-mini.vue'

const { t } = useI18n()
useNavbarI18n('navbar.seeNavbarMini')

const onBack = () => {
  uni.showToast({ title: t('navbarMini.demo.back'), icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-navbar-mini {
  padding-bottom: 40rpx;
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 32rpx;

  &__title {
    display: block;
    padding: 24rpx 32rpx;
    font-size: 28rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }
}

.action-text {
  font-size: 28rpx;
  color: var(--see-primary);
}

.close-icon {
  font-size: 32rpx;
  color: var(--see-tips-color);
}

.mock-popup {
  margin: 0 32rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

  &__content {
    padding: 32rpx;
    min-height: 200rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--see-tips-color);
    font-size: 28rpx;
  }
}
</style>
