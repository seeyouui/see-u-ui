<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('switch.demo.basic') }}</text>
      <view class="content">
        <see-switch v-model="val1" />
        <text class="info">{{ t('switch.demo.currentValue') }}{{ val1 }}</text>
      </view>

      <text class="title">{{ t('switch.demo.customColor') }}</text>
      <view class="content">
        <see-switch v-model="val2" active-color="#07c160" inactive-color="#ee0a24" />
        <text class="info">{{ t('switch.demo.greenOnRedOff') }}</text>
      </view>

      <text class="title">{{ t('switch.demo.customValue') }}</text>
      <view class="content">
        <see-switch v-model="val3" :active-value="activeVal" :inactive-value="inactiveVal" />
        <text class="info">{{ t('switch.demo.currentValue') }}{{ val3 }}</text>
      </view>

      <text class="title">{{ t('switch.demo.textBoth') }}</text>
      <view class="content">
        <see-switch v-model="val4" :active-text="t('switch.demo.on')" :inactive-text="t('switch.demo.off')" />
      </view>

      <text class="title">{{ t('switch.demo.textRight') }}</text>
      <view class="content">
        <see-switch v-model="val5" :active-text="t('switch.demo.enable')" :inactive-text="t('switch.demo.disable')" />
      </view>

      <text class="title">{{ t('switch.demo.disabled') }}</text>
      <view class="content">
        <see-switch :model-value="true" is-disabled />
        <view class="ml-12" />
        <see-switch :model-value="false" is-disabled />
      </view>

      <text class="title">{{ t('switch.demo.readonly') }}</text>
      <view class="content">
        <see-switch :model-value="true" is-readonly />
        <view class="ml-12" />
        <see-switch :model-value="false" is-readonly />
      </view>

      <text class="title">{{ t('switch.demo.sizes') }}</text>
      <view class="content">
        <see-switch v-model="val6" size="small" />
        <view class="ml-12" />
        <see-switch v-model="val6" size="default" />
        <view class="ml-12" />
        <see-switch v-model="val6" size="large" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeSwitch')

const activeVal = ref(t('switch.demo.on'))
const inactiveVal = ref(t('switch.demo.off'))
const val1 = ref(false)
const val2 = ref(true)
const val3 = ref(t('switch.demo.off'))
const val4 = ref(true)
const val5 = ref(false)
const val6 = ref(true)
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
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
}

.info {
  font-size: 12px;
  color: #999;
}

.ml-12 {
  margin-left: 12px;
}
</style>
