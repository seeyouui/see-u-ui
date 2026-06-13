<template>
  <see-config>
    <text class="title">{{ t('overlay.demo.basic') }}</text>
    <view class="demo-content">
      <see-button :title="t('overlay.demo.showOverlay')" type="primary" is-ripple @click="show1 = true" />
      <see-overlay v-model:show="show1" />
    </view>

    <text class="title">{{ t('overlay.demo.customBg') }}</text>
    <view class="demo-content">
      <see-button :title="t('overlay.demo.redOverlay')" type="primary" is-ripple @click="show2 = true" />
      <see-overlay v-model:show="show2" background="rgba(255, 0, 0, 0.3)" />
    </view>

    <text class="title">{{ t('overlay.demo.notClickable') }}</text>
    <view class="demo-content">
      <see-button :title="t('overlay.demo.manualClose')" type="primary" is-ripple @click="show3 = true" />
      <see-overlay v-model:show="show3" :clickable="false">
        <view class="overlay-content">
          <text class="overlay-text">{{ t('overlay.demo.wontClose') }}</text>
          <see-button :title="t('overlay.demo.manualCloseBtn')" type="primary" is-ripple @click="show3 = false" />
        </view>
      </see-overlay>
    </view>

    <text class="title">{{ t('overlay.demo.withContent') }}</text>
    <view class="demo-content">
      <see-button :title="t('overlay.demo.contentOverlay')" type="primary" is-ripple @click="show4 = true" />
      <see-overlay v-model:show="show4">
        <view class="overlay-content">
          <text class="overlay-text">{{ t('overlay.demo.customContent') }}</text>
          <see-button :title="t('overlay.demo.close')" type="primary" is-ripple @click="show4 = false" />
        </view>
      </see-overlay>
    </view>

    <text class="title">{{ t('overlay.demo.noAnimation') }}</text>
    <view class="demo-content">
      <see-button :title="t('overlay.demo.noAnimateOverlay')" type="primary" is-ripple @click="show5 = true" />
      <see-overlay v-model:show="show5" :is-animated="false" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeOverlay')

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)
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
.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 40rpx;
}
.overlay-text {
  color: #fff;
  font-size: 36rpx;
}
</style>
