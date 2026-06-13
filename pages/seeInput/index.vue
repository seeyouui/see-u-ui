<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('input.demo.basic') }}</text>
      <view class="content">
        <see-input v-model="basicText" :placeholder="t('input.demo.placeholderText')" />
        <see-input v-model="basicNumber" type="number" :placeholder="t('input.demo.placeholderNumber')" />
        <see-input v-model="basicPassword" type="password" :placeholder="t('input.demo.placeholderPassword')" />
      </view>

      <text class="title">{{ t('input.demo.clearable') }}</text>
      <view class="content">
        <see-input v-model="clearableValue" is-clearable :placeholder="t('input.demo.placeholderClearable')" />
      </view>

      <text class="title">{{ t('input.demo.passwordToggle') }}</text>
      <view class="content">
        <see-input v-model="passwordValue" type="password" is-show-password :placeholder="t('input.demo.placeholderShowPwd')" />
      </view>

      <text class="title">{{ t('input.demo.prefixIcon') }}</text>
      <view class="content">
        <see-input v-model="prefixValue" prefix-icon="see-icon-search" :placeholder="t('input.demo.placeholderSearch')" />
        <see-input v-model="phoneValue" prefix-icon="see-icon-phone" type="number" :placeholder="t('input.demo.placeholderPhone')" />
      </view>

      <text class="title">{{ t('input.demo.suffixIcon') }}</text>
      <view class="content">
        <see-input v-model="suffixValue" suffix-icon="see-icon-right" :placeholder="t('input.demo.placeholderSuffix')" />
      </view>

      <text class="title">{{ t('input.demo.prefixSuffixSlot') }}</text>
      <view class="content">
        <see-input v-model="slotValue" :placeholder="t('input.demo.placeholderSlot')">
          <template #prefix>
            <text class="slot-text">{{ t('input.demo.httpsPrefix') }}</text>
          </template>
          <template #suffix>
            <text class="slot-text">{{ t('input.demo.comSuffix') }}</text>
          </template>
        </see-input>
      </view>

      <text class="title">{{ t('input.demo.wordLimit') }}</text>
      <view class="content">
        <see-input v-model="limitValue" :maxlength="20" is-show-word-limit :placeholder="t('input.demo.placeholderWordLimit')" />
      </view>

      <text class="title">{{ t('input.demo.formatter') }}</text>
      <view class="content">
        <see-input
          v-model="phoneFormat"
          type="number"
          :maxlength="11"
          :formatter="phoneFormatter"
          :placeholder="t('input.demo.placeholderPhoneFormat')"
        />
        <see-input
          v-model="bankFormat"
          type="number"
          :maxlength="19"
          :formatter="bankFormatter"
          :placeholder="t('input.demo.placeholderBankFormat')"
        />
      </view>

      <text class="title">{{ t('input.demo.sizes') }}</text>
      <view class="content">
        <see-input v-model="sizeValue" size="small" :placeholder="t('input.demo.placeholderSmall')" />
        <see-input v-model="sizeValue" size="default" :placeholder="t('input.demo.placeholderDefault')" />
        <see-input v-model="sizeValue" size="large" :placeholder="t('input.demo.placeholderLarge')" />
      </view>

      <text class="title">{{ t('input.demo.disabledReadonly') }}</text>
      <view class="content">
        <see-input :model-value="t('input.demo.disabledValue')" is-disabled />
        <see-input :model-value="t('input.demo.readonlyValue')" is-readonly />
      </view>

      <text class="title">{{ t('input.demo.noBorder') }}</text>
      <view class="content">
        <see-input v-model="noBorderValue" :is-border="false" :placeholder="t('input.demo.placeholderNoBorder')" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeInput')

const basicText = ref('')
const basicNumber = ref('')
const basicPassword = ref('')
const clearableValue = ref(t('input.demo.clearableValue'))
const passwordValue = ref('')
const prefixValue = ref('')
const phoneValue = ref('')
const suffixValue = ref('')
const slotValue = ref('')
const limitValue = ref('')
const phoneFormat = ref('')
const bankFormat = ref('')
const sizeValue = ref('')
const noBorderValue = ref('')

/** 手机号格式化：3-4-4 */
const phoneFormatter = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`
}

/** 银行卡号格式化：每4位空格 */
const bankFormatter = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
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

.slot-text {
  font-size: 14px;
  color: #999;
}
</style>
