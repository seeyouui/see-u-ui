<template>
  <see-config>
    <text class="title">{{ t('noticeBar.demo.basic') }}</text>
    <view class="demo-content">
      <see-notice-bar :text="t('noticeBar.demo.longText')" />
    </view>

    <text class="title">{{ t('noticeBar.demo.type') }}</text>
    <view class="demo-content">
      <see-notice-bar :text="t('noticeBar.demo.infoText')" type="info" />
      <view class="gap" />
      <see-notice-bar :text="t('noticeBar.demo.warningText')" type="warning" />
      <view class="gap" />
      <see-notice-bar :text="t('noticeBar.demo.errorText')" type="error" />
    </view>

    <text class="title">{{ t('noticeBar.demo.closable') }}</text>
    <view class="demo-content">
      <see-notice-bar v-if="show1" :text="t('noticeBar.demo.closableText')" is-closable @on-close="show1 = false" />
    </view>

    <text class="title">{{ t('noticeBar.demo.icon') }}</text>
    <view class="demo-content">
      <see-notice-bar :text="t('noticeBar.demo.iconText')" icon="📢" />
    </view>

    <text class="title">{{ t('noticeBar.demo.noIcon') }}</text>
    <view class="demo-content">
      <see-notice-bar :text="t('noticeBar.demo.noIconText')" :is-show-icon="false" />
    </view>

    <text class="title">{{ t('noticeBar.demo.static') }}</text>
    <view class="demo-content">
      <see-notice-bar :text="t('noticeBar.demo.staticText')" :is-scrollable="false" />
    </view>

    <text class="title">{{ t('noticeBar.demo.vertical') }}</text>
    <view class="demo-content">
      <see-notice-bar vertical :messages="verticalMessages" :vertical-interval="3000" />
    </view>

    <text class="title">{{ t('noticeBar.demo.speed') }}</text>
    <view class="demo-content">
      <see-notice-bar :text="t('noticeBar.demo.speedText')" :speed="100" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeNoticeBar')

const show1 = ref(true)

const verticalMessages = [t('noticeBar.demo.msg1'), t('noticeBar.demo.msg2'), t('noticeBar.demo.msg3')]
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
.gap {
  height: 16rpx;
}
</style>
