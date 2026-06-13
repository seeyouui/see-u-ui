<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('radio.demo.basic') }}</text>
      <view class="content">
        <see-radio-group v-model="basicValue">
          <see-radio label="apple">{{ t('radio.demo.apple') }}</see-radio>
          <see-radio label="banana">{{ t('radio.demo.banana') }}</see-radio>
          <see-radio label="orange">{{ t('radio.demo.orange') }}</see-radio>
        </see-radio-group>
        <text class="info">{{ t('radio.demo.selectedValue') }}{{ basicValue || t('radio.demo.none') }}</text>
      </view>

      <text class="title">{{ t('radio.demo.inline') }}</text>
      <view class="content">
        <see-radio-group v-model="inlineValue" is-inline>
          <see-radio label="a">{{ t('radio.demo.optionA') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.optionB') }}</see-radio>
          <see-radio label="c">{{ t('radio.demo.optionC') }}</see-radio>
        </see-radio-group>
      </view>

      <text class="title">{{ t('radio.demo.block') }}</text>
      <view class="content">
        <see-radio-group v-model="blockValue" :is-inline="false">
          <see-radio label="a">{{ t('radio.demo.optionA') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.optionB') }}</see-radio>
          <see-radio label="c">{{ t('radio.demo.optionC') }}</see-radio>
        </see-radio-group>
      </view>

      <text class="title">{{ t('radio.demo.sizes') }}</text>
      <view class="content">
        <see-radio-group v-model="smallValue" size="small" is-inline>
          <see-radio label="a">{{ t('radio.demo.small') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.small') }}</see-radio>
        </see-radio-group>
        <see-radio-group v-model="defaultValue" size="default" is-inline>
          <see-radio label="a">{{ t('radio.demo.default') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.default') }}</see-radio>
        </see-radio-group>
        <see-radio-group v-model="largeValue" size="large" is-inline>
          <see-radio label="a">{{ t('radio.demo.large') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.large') }}</see-radio>
        </see-radio-group>
      </view>

      <text class="title">{{ t('radio.demo.border') }}</text>
      <view class="content">
        <see-radio-group v-model="borderValue" is-border>
          <see-radio label="a">{{ t('radio.demo.optionA') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.optionB') }}</see-radio>
          <see-radio label="c">{{ t('radio.demo.optionC') }}</see-radio>
        </see-radio-group>
      </view>

      <text class="title">{{ t('radio.demo.borderInline') }}</text>
      <view class="content">
        <see-radio-group v-model="borderInlineValue" is-border is-inline>
          <see-radio label="a">{{ t('radio.demo.optionA') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.optionB') }}</see-radio>
          <see-radio label="c">{{ t('radio.demo.optionC') }}</see-radio>
        </see-radio-group>
      </view>

      <text class="title">{{ t('radio.demo.customColor') }}</text>
      <view class="content">
        <see-radio-group v-model="colorValue" checked-color="#e43d33" is-inline>
          <see-radio label="a">{{ t('radio.demo.red') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.red') }}</see-radio>
        </see-radio-group>
        <see-radio-group v-model="colorValue2" checked-color="#19be6b" is-border is-inline>
          <see-radio label="a">{{ t('radio.demo.green') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.green') }}</see-radio>
        </see-radio-group>
      </view>

      <text class="title">{{ t('radio.demo.disabled') }}</text>
      <view class="content">
        <see-radio-group v-model="disabledValue" is-inline>
          <see-radio label="a">{{ t('radio.demo.normal') }}</see-radio>
          <see-radio label="b" is-disabled>{{ t('radio.demo.disabledItem') }}</see-radio>
          <see-radio label="c">{{ t('radio.demo.normal') }}</see-radio>
        </see-radio-group>
      </view>

      <text class="title">{{ t('radio.demo.groupDisabled') }}</text>
      <view class="content">
        <see-radio-group v-model="disabledGroupValue" is-disabled is-inline>
          <see-radio label="a">{{ t('radio.demo.optionA') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.optionB') }}</see-radio>
          <see-radio label="c">{{ t('radio.demo.optionC') }}</see-radio>
        </see-radio-group>
      </view>

      <text class="title">{{ t('radio.demo.groupReadonly') }}</text>
      <view class="content">
        <see-radio-group v-model="readonlyValue" is-readonly is-inline>
          <see-radio label="a">{{ t('radio.demo.optionA') }}</see-radio>
          <see-radio label="b">{{ t('radio.demo.optionB') }}</see-radio>
          <see-radio label="c">{{ t('radio.demo.optionC') }}</see-radio>
        </see-radio-group>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeRadio')

const basicValue = ref('apple')
const inlineValue = ref('a')
const blockValue = ref('a')
const smallValue = ref('a')
const defaultValue = ref('a')
const largeValue = ref('a')
const borderValue = ref('a')
const borderInlineValue = ref('a')
const colorValue = ref('a')
const colorValue2 = ref('a')
const disabledValue = ref('a')
const disabledGroupValue = ref('b')
const readonlyValue = ref('a')
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
