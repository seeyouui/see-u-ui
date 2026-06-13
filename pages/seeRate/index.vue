<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('rate.demo.basic') }}</text>
      <view class="content">
        <see-rate v-model="val1" />
        <text class="info">{{ t('rate.demo.currentScore') }}{{ val1 }}</text>
      </view>

      <text class="title">{{ t('rate.demo.half') }}</text>
      <view class="content">
        <see-rate v-model="val2" allow-half />
        <text class="info">{{ t('rate.demo.currentScore') }}{{ val2 }}</text>
      </view>

      <text class="title">{{ t('rate.demo.customIconColor') }}</text>
      <view class="content">
        <see-rate v-model="val3" color="#ff6b6b" void-color="#ddd" />
        <text class="info">{{ t('rate.demo.redTheme') }}</text>
      </view>

      <text class="title">{{ t('rate.demo.customIcon') }}</text>
      <view class="content">
        <see-rate v-model="val4" icon="♥" void-icon="♡" color="#ee0a24" />
        <text class="info">{{ t('rate.demo.heartScore') }}</text>
      </view>

      <text class="title">{{ t('rate.demo.clearable') }}</text>
      <view class="content">
        <see-rate v-model="val5" is-clearable />
        <text class="info">{{ t('rate.demo.clearHint') }}{{ val5 }}</text>
      </view>

      <text class="title">{{ t('rate.demo.customCountSize') }}</text>
      <view class="content">
        <see-rate v-model="val6" :count="10" :size="18" :gap="2" />
        <text class="info">{{ t('rate.demo.tenStars') }}</text>
      </view>

      <text class="title">{{ t('rate.demo.disabled') }}</text>
      <view class="content">
        <see-rate :model-value="3.5" is-disabled allow-half />
        <text class="info">{{ t('rate.demo.notOperable') }}</text>
      </view>

      <text class="title">{{ t('rate.demo.readonly') }}</text>
      <view class="content">
        <see-rate :model-value="4" is-readonly />
        <text class="info">{{ t('rate.demo.readonlyDisplay') }}</text>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeRate')

const val1 = ref(3)
const val2 = ref(3.5)
const val3 = ref(4)
const val4 = ref(3)
const val5 = ref(4)
const val6 = ref(7)
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
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.info {
  font-size: 12px;
  color: #999;
}
</style>
