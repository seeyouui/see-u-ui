<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('code.demo.basic') }}</text>
      <view class="content">
        <see-code v-model="code1" @on-complete="onComplete1" />
        <text class="info">{{ t('code.demo.currentValue') }}{{ code1 }}</text>
      </view>

      <text class="title">{{ t('code.demo.sixDigits') }}</text>
      <view class="content">
        <see-code v-model="code2" :length="6" @on-complete="onComplete2" />
        <text class="info">{{ t('code.demo.currentValue') }}{{ code2 }}</text>
      </view>

      <text class="title">{{ t('code.demo.boxType') }}</text>
      <view class="content">
        <see-code v-model="code3" type="box" />
      </view>

      <text class="title">{{ t('code.demo.lineType') }}</text>
      <view class="content">
        <see-code v-model="code4" type="line" />
      </view>

      <text class="title">{{ t('code.demo.bottomType') }}</text>
      <view class="content">
        <see-code v-model="code5" type="bottom" />
      </view>

      <text class="title">{{ t('code.demo.mask') }}</text>
      <view class="content">
        <see-code v-model="code6" is-mask />
        <text class="info">{{ t('code.demo.maskHint') }}</text>
      </view>

      <text class="title">{{ t('code.demo.cursor') }}</text>
      <view class="content">
        <see-code v-model="code7" is-cursor />
        <text class="info">{{ t('code.demo.cursorHint') }}</text>
      </view>

      <text class="title">{{ t('code.demo.autoFocus') }}</text>
      <view class="content">
        <see-code v-model="code8" :is-focus="true" />
        <text class="info">{{ t('code.demo.focusHint') }}</text>
      </view>

      <text class="title">{{ t('code.demo.disabled') }}</text>
      <view class="content">
        <see-code v-model="code9" is-disabled />
      </view>

      <text class="title">{{ t('code.demo.readonly') }}</text>
      <view class="content">
        <see-code v-model="code10" is-readonly />
      </view>

      <text class="title">{{ t('code.demo.sizes') }}</text>
      <view class="content">
        <see-code v-model="code11" size="small" />
        <text class="info">{{ t('code.demo.smallHint') }}</text>
        <see-code v-model="code12" size="default" />
        <text class="info">{{ t('code.demo.defaultHint') }}</text>
        <see-code v-model="code13" size="large" />
        <text class="info">{{ t('code.demo.largeHint') }}</text>
      </view>

      <text class="title">{{ t('code.demo.customGap') }}</text>
      <view class="content">
        <see-code v-model="code14" :gap="20" />
        <text class="info">{{ t('code.demo.gapHint') }}</text>
      </view>

      <text class="title">{{ t('code.demo.textKeyboard') }}</text>
      <view class="content">
        <see-code v-model="code15" keyboard="text" :length="6" />
        <text class="info">{{ t('code.demo.textHint') }}</text>
      </view>

      <text class="title">{{ t('code.demo.combined') }}</text>
      <view class="content">
        <see-code v-model="code16" :length="6" is-mask is-cursor type="box" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeCode')

const code1 = ref('')
const code2 = ref('')
const code3 = ref('')
const code4 = ref('')
const code5 = ref('')
const code6 = ref('')
const code7 = ref('')
const code8 = ref('')
const code9 = ref('1234')
const code10 = ref('5678')
const code11 = ref('')
const code12 = ref('')
const code13 = ref('')
const code14 = ref('')
const code15 = ref('')
const code16 = ref('')

const onComplete1 = (value: string) => {
  console.log('4位验证码输入完成：', value)
}

const onComplete2 = (value: string) => {
  console.log('6位验证码输入完成：', value)
}
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
