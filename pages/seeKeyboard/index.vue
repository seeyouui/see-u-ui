<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('keyboard.demo.number') }}</text>
      <view class="content">
        <view class="input-box" @tap="showNumber = true">
          <text class="input-text">{{ numberValue || t('keyboard.demo.hintNumber') }}</text>
        </view>
        <see-keyboard
          v-model="showNumber"
          type="number"
          :title="t('keyboard.demo.titleNumber')"
          @on-input="onNumberInput"
          @on-delete="onNumberDelete"
          @on-confirm="onNumberConfirm"
        />
      </view>

      <text class="title">{{ t('keyboard.demo.idcard') }}</text>
      <view class="content">
        <view class="input-box" @tap="showIdcard = true">
          <text class="input-text">{{ idcardValue || t('keyboard.demo.hintIdcard') }}</text>
        </view>
        <see-keyboard
          v-model="showIdcard"
          type="idcard"
          :title="t('keyboard.demo.titleIdcard')"
          @on-input="onIdcardInput"
          @on-delete="onIdcardDelete"
          @on-confirm="onIdcardConfirm"
        />
      </view>

      <text class="title">{{ t('keyboard.demo.bankCard') }}</text>
      <view class="content">
        <view class="input-box" @tap="showCard = true">
          <text class="input-text">{{ cardValue || t('keyboard.demo.hintCard') }}</text>
        </view>
        <see-keyboard
          v-model="showCard"
          type="card"
          :title="t('keyboard.demo.titleCard')"
          @on-input="onCardInput"
          @on-delete="onCardDelete"
          @on-confirm="onCardConfirm"
        />
      </view>

      <text class="title">{{ t('keyboard.demo.fullText') }}</text>
      <view class="content">
        <view class="input-box" @tap="showText = true">
          <text class="input-text">{{ textValue || t('keyboard.demo.hintText') }}</text>
        </view>
        <see-keyboard
          v-model="showText"
          type="text"
          :title="t('keyboard.demo.titleFull')"
          @on-input="onTextInput"
          @on-delete="onTextDelete"
          @on-confirm="onTextConfirm"
        />
      </view>

      <text class="title">{{ t('keyboard.demo.secure') }}</text>
      <view class="content">
        <view class="input-box" @tap="showRandom = true">
          <text class="input-text">{{ randomValue || t('keyboard.demo.hintRandom') }}</text>
        </view>
        <see-keyboard
          v-model="showRandom"
          type="number"
          is-random
          :title="t('keyboard.demo.titleSecure')"
          @on-input="onRandomInput"
          @on-delete="onRandomDelete"
          @on-confirm="onRandomConfirm"
        />
        <text class="info">{{ t('keyboard.demo.secureHint') }}</text>
      </view>

      <text class="title">{{ t('keyboard.demo.withCode') }}</text>
      <view class="content">
        <see-code v-model="codeValue" :length="6" :is-focus="false" is-cursor @tap="showCodeKeyboard = true" />
        <see-keyboard
          v-model="showCodeKeyboard"
          type="number"
          :title="t('keyboard.demo.titleCode')"
          @on-input="onCodeInput"
          @on-delete="onCodeDelete"
          @on-confirm="onCodeConfirm"
        />
        <text class="info">{{ t('keyboard.demo.codeHint') }}</text>
      </view>

      <text class="title">{{ t('keyboard.demo.noToolbar') }}</text>
      <view class="content">
        <view class="input-box" @tap="showNoToolbar = true">
          <text class="input-text">{{ noToolbarValue || t('keyboard.demo.hintInput') }}</text>
        </view>
        <see-keyboard v-model="showNoToolbar" type="number" :is-show-toolbar="false" @on-input="onNoToolbarInput" @on-delete="onNoToolbarDelete" />
      </view>

      <text class="title">{{ t('keyboard.demo.noConfirm') }}</text>
      <view class="content">
        <view class="input-box" @tap="showNoConfirm = true">
          <text class="input-text">{{ noConfirmValue || t('keyboard.demo.hintInput') }}</text>
        </view>
        <see-keyboard
          v-model="showNoConfirm"
          type="number"
          :title="t('keyboard.demo.titleNoConfirm')"
          :is-show-confirm="false"
          @on-input="onNoConfirmInput"
          @on-delete="onNoConfirmDelete"
        />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeKeyboard')

/* ========== 数字键盘 ========== */
const showNumber = ref(false)
const numberValue = ref('')
const onNumberInput = (key: string) => {
  numberValue.value += key
}
const onNumberDelete = () => {
  numberValue.value = numberValue.value.slice(0, -1)
}
const onNumberConfirm = () => {
  console.log('数字键盘确认：', numberValue.value)
}

/* ========== 身份证键盘 ========== */
const showIdcard = ref(false)
const idcardValue = ref('')
const onIdcardInput = (key: string) => {
  idcardValue.value += key
}
const onIdcardDelete = () => {
  idcardValue.value = idcardValue.value.slice(0, -1)
}
const onIdcardConfirm = () => {
  console.log('身份证键盘确认：', idcardValue.value)
}

/* ========== 银行卡键盘 ========== */
const showCard = ref(false)
const cardValue = ref('')
const onCardInput = (key: string) => {
  cardValue.value += key
}
const onCardDelete = () => {
  cardValue.value = cardValue.value.slice(0, -1)
}
const onCardConfirm = () => {
  console.log('银行卡键盘确认：', cardValue.value)
}

/* ========== 完整键盘 ========== */
const showText = ref(false)
const textValue = ref('')
const onTextInput = (key: string) => {
  textValue.value += key
}
const onTextDelete = () => {
  textValue.value = textValue.value.slice(0, -1)
}
const onTextConfirm = () => {
  console.log('完整键盘确认：', textValue.value)
}

/* ========== 安全键盘 ========== */
const showRandom = ref(false)
const randomValue = ref('')
const onRandomInput = (key: string) => {
  randomValue.value += key
}
const onRandomDelete = () => {
  randomValue.value = randomValue.value.slice(0, -1)
}
const onRandomConfirm = () => {
  console.log('安全键盘确认：', randomValue.value)
}

/* ========== 配合 Code 组件 ========== */
const showCodeKeyboard = ref(false)
const codeValue = ref('')
const onCodeInput = (key: string) => {
  if (codeValue.value.length < 6) {
    codeValue.value += key
  }
}
const onCodeDelete = () => {
  codeValue.value = codeValue.value.slice(0, -1)
}
const onCodeConfirm = () => {
  console.log('验证码确认：', codeValue.value)
}

/* ========== 无 Toolbar ========== */
const showNoToolbar = ref(false)
const noToolbarValue = ref('')
const onNoToolbarInput = (key: string) => {
  noToolbarValue.value += key
}
const onNoToolbarDelete = () => {
  noToolbarValue.value = noToolbarValue.value.slice(0, -1)
}

/* ========== 无确认按钮 ========== */
const showNoConfirm = ref(false)
const noConfirmValue = ref('')
const onNoConfirmInput = (key: string) => {
  noConfirmValue.value += key
}
const onNoConfirmDelete = () => {
  noConfirmValue.value = noConfirmValue.value.slice(0, -1)
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

.input-box {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
}

.input-text {
  font-size: 16px;
  color: #333;
}
</style>
