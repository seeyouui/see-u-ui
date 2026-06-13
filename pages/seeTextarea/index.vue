<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('textarea.demo.basic') }}</text>
      <view class="content">
        <see-textarea v-model="basicValue" :placeholder="t('textarea.demo.placeholderBasic')" />
      </view>

      <text class="title">{{ t('textarea.demo.customRows') }}</text>
      <view class="content">
        <see-textarea v-model="rowsValue" :rows="5" :placeholder="t('textarea.demo.placeholderRows')" />
      </view>

      <text class="title">{{ t('textarea.demo.autoHeight') }}</text>
      <view class="content">
        <see-textarea v-model="autoHeightValue" is-auto-height :placeholder="t('textarea.demo.placeholderAutoHeight')" />
      </view>

      <text class="title">{{ t('textarea.demo.wordLimit') }}</text>
      <view class="content">
        <see-textarea v-model="limitValue" :maxlength="200" is-show-word-limit :placeholder="t('textarea.demo.placeholderWordLimit')" />
      </view>

      <text class="title">{{ t('textarea.demo.wordLimitAutoHeight') }}</text>
      <view class="content">
        <see-textarea
          v-model="autoLimitValue"
          is-auto-height
          :maxlength="500"
          is-show-word-limit
          :placeholder="t('textarea.demo.placeholderAutoLimit')"
        />
      </view>

      <text class="title">{{ t('textarea.demo.clearable') }}</text>
      <view class="content">
        <see-textarea v-model="clearableValue" is-clearable :placeholder="t('textarea.demo.placeholderClearable')" />
      </view>

      <text class="title">{{ t('textarea.demo.sizes') }}</text>
      <view class="content">
        <see-textarea v-model="smallValue" size="small" :placeholder="t('textarea.demo.placeholderSmall')" />
        <see-textarea v-model="defaultValue" size="default" :placeholder="t('textarea.demo.placeholderDefault')" />
        <see-textarea v-model="largeValue" size="large" :placeholder="t('textarea.demo.placeholderLarge')" />
      </view>

      <text class="title">{{ t('textarea.demo.disabledReadonly') }}</text>
      <view class="content">
        <see-textarea :model-value="t('textarea.demo.disabledValue')" is-disabled />
        <see-textarea :model-value="t('textarea.demo.readonlyValue')" is-readonly />
      </view>

      <text class="title">{{ t('textarea.demo.noBorder') }}</text>
      <view class="content">
        <see-textarea v-model="noBorderValue" :is-border="false" :placeholder="t('textarea.demo.placeholderNoBorder')" />
      </view>

      <text class="title">{{ t('textarea.demo.confirmType') }}</text>
      <view class="content">
        <see-textarea v-model="sendValue" confirm-type="send" :placeholder="t('textarea.demo.placeholderSend')" />
        <see-textarea v-model="nextValue" confirm-type="next" :placeholder="t('textarea.demo.placeholderNext')" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeTextarea')

const basicValue = ref('')
const rowsValue = ref('')
const autoHeightValue = ref('')
const limitValue = ref('')
const autoLimitValue = ref('')
const clearableValue = ref(t('textarea.demo.clearable'))
const smallValue = ref('')
const defaultValue = ref('')
const largeValue = ref('')
const noBorderValue = ref('')
const sendValue = ref('')
const nextValue = ref('')
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
