<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('numberBox.demo.basic') }}</text>
      <view class="content">
        <see-number-box v-model="val1" />
        <text class="info">{{ t('numberBox.demo.currentValue') }}{{ val1 }}</text>
      </view>

      <text class="title">{{ t('numberBox.demo.step') }}</text>
      <view class="content">
        <see-number-box v-model="val2" :step="5" />
        <text class="info">{{ t('numberBox.demo.stepHint') }}{{ val2 }}</text>
      </view>

      <text class="title">{{ t('numberBox.demo.range') }}</text>
      <view class="content">
        <see-number-box v-model="val3" :min="1" :max="10" />
        <text class="info">{{ t('numberBox.demo.rangeHint') }}{{ val3 }}</text>
      </view>

      <text class="title">{{ t('numberBox.demo.decimal') }}</text>
      <view class="content">
        <see-number-box v-model="val4" :step="0.1" :decimal-length="1" />
        <text class="info">{{ t('numberBox.demo.decimalHint') }}{{ val4 }}</text>
      </view>

      <text class="title">{{ t('numberBox.demo.disabledInput') }}</text>
      <view class="content">
        <see-number-box v-model="val5" is-disabled-input />
        <text class="info">{{ t('numberBox.demo.buttonOnly') }}</text>
      </view>

      <text class="title">{{ t('numberBox.demo.disabledPlus') }}</text>
      <view class="content">
        <see-number-box v-model="val6" is-disabled-plus />
      </view>

      <text class="title">{{ t('numberBox.demo.disabledMinus') }}</text>
      <view class="content">
        <see-number-box v-model="val7" is-disabled-minus />
      </view>

      <text class="title">{{ t('numberBox.demo.disabled') }}</text>
      <view class="content">
        <see-number-box :model-value="5" is-disabled />
      </view>

      <text class="title">{{ t('numberBox.demo.readonly') }}</text>
      <view class="content">
        <see-number-box :model-value="8" is-readonly />
      </view>

      <text class="title">{{ t('numberBox.demo.sizes') }}</text>
      <view class="content">
        <see-number-box v-model="val8" size="small" />
        <see-number-box v-model="val8" size="default" />
        <see-number-box v-model="val8" size="large" />
      </view>

      <text class="title">{{ t('numberBox.demo.customInputWidth') }}</text>
      <view class="content">
        <see-number-box v-model="val9" :input-width="100" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeNumberBox')

const val1 = ref(1)
const val2 = ref(0)
const val3 = ref(5)
const val4 = ref(1.0)
const val5 = ref(3)
const val6 = ref(0)
const val7 = ref(5)
const val8 = ref(1)
const val9 = ref(0)
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
