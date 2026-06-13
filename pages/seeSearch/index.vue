<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('search.demo.basic') }}</text>
      <view class="content">
        <see-search v-model="val1" :placeholder="t('search.placeholder')" />
        <text class="info">{{ t('search.demo.currentValue') }}{{ val1 }}</text>
      </view>

      <text class="title">{{ t('search.demo.round') }}</text>
      <view class="content">
        <see-search v-model="val2" shape="round" :placeholder="t('search.demo.placeholderRound')" />
      </view>

      <text class="title">{{ t('search.demo.square') }}</text>
      <view class="content">
        <see-search v-model="val3" shape="square" :placeholder="t('search.demo.placeholderSquare')" />
      </view>

      <text class="title">{{ t('search.demo.showAction') }}</text>
      <view class="content">
        <see-search v-model="val4" is-show-action :placeholder="t('search.demo.placeholderSearch')" />
      </view>

      <text class="title">{{ t('search.demo.customActionText') }}</text>
      <view class="content">
        <see-search v-model="val5" is-show-action :action-text="t('search')" :placeholder="t('search.demo.placeholderKeyword')" />
      </view>

      <text class="title">{{ t('search.demo.showBorder') }}</text>
      <view class="content">
        <see-search v-model="val6" is-border :placeholder="t('search.demo.placeholderBorder')" />
      </view>

      <text class="title">{{ t('search.demo.customBg') }}</text>
      <view class="content">
        <see-search v-model="val7" bg-color="#e8f5e9" :placeholder="t('search.demo.placeholderBg')" />
      </view>

      <text class="title">{{ t('search.demo.disabled') }}</text>
      <view class="content">
        <see-search :model-value="t('search.demo.disabledValue')" is-disabled />
      </view>

      <text class="title">{{ t('search.demo.readonly') }}</text>
      <view class="content">
        <see-search :model-value="t('search.demo.readonlyValue')" is-readonly />
      </view>

      <text class="title">{{ t('search.demo.sizes') }}</text>
      <view class="content">
        <see-search v-model="val8" size="small" :placeholder="t('search.demo.placeholderSmall')" />
        <see-search v-model="val8" size="default" :placeholder="t('search.demo.placeholderDefault')" />
        <see-search v-model="val8" size="large" :placeholder="t('search.demo.placeholderLarge')" />
      </view>

      <text class="title">{{ t('search.demo.customSlot') }}</text>
      <view class="content">
        <see-search v-model="val9" :placeholder="t('search.demo.placeholderLeftText')">
          <template #left>
            <text class="slot-text">{{ t('search.demo.slotCancel') }}</text>
          </template>
        </see-search>
        <see-search v-model="val9" :placeholder="t('search.demo.placeholderRightIcon')">
          <template #right>
            <text class="slot-text">{{ t('search.demo.slotFilter') }}</text>
          </template>
        </see-search>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeSearch')

const val1 = ref('')
const val2 = ref('')
const val3 = ref('')
const val4 = ref('')
const val5 = ref('')
const val6 = ref('')
const val7 = ref('')
const val8 = ref('')
const val9 = ref('')
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

.slot-text {
  font-size: 14px;
  color: #999;
  white-space: nowrap;
}
</style>
