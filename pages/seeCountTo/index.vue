<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeCountTo')

const target = ref(26880)
const countToRef = ref<{ update: (value: number) => void; reset: () => void } | null>(null)

const updateValue = () => {
  target.value += 1280
  countToRef.value?.update(target.value)
}

const resetValue = () => {
  target.value = 26880
  countToRef.value?.reset()
}
</script>

<template>
  <see-config>
    <view class="page">
      <text class="title">{{ t('countTo.demo.basic') }}</text>
      <view class="stats-card">
        <text class="label">{{ t('countTo.demo.visits') }}</text>
        <see-count-to :start-val="0" :end-val="12890" />
      </view>

      <text class="title">{{ t('countTo.demo.money') }}</text>
      <view class="stats-card">
        <text class="label">{{ t('countTo.demo.turnover') }}</text>
        <see-count-to :start-val="0" :end-val="986543.21" :decimals="2" prefix="¥" :suffix="t('countTo.demo.yuan')" />
      </view>

      <text class="title">{{ t('countTo.demo.decimal') }}</text>
      <view class="stats-card">
        <text class="label">{{ t('countTo.demo.conversion') }}</text>
        <see-count-to :start-val="0" :end-val="73.86" :decimals="2" suffix="%" />
      </view>

      <text class="title">{{ t('countTo.demo.slot') }}</text>
      <view class="stats-card">
        <text class="label">{{ t('countTo.demo.ranking') }}</text>
        <see-count-to :start-val="50" :end-val="12" color="var(--see-success)">
          <template #prefix>
            <text class="slot-prefix">{{ 'TOP ' }}</text>
          </template>
          <template #suffix>
            <text class="slot-suffix">{{ t('countTo.demo.rank') }}</text>
          </template>
        </see-count-to>
      </view>

      <text class="title">{{ t('countTo.demo.methods') }}</text>
      <view class="stats-card">
        <text class="label">{{ t('countTo.demo.income') }}</text>
        <see-count-to ref="countToRef" :start-val="26880" :end-val="target" prefix="¥" :autoplay="false" />
        <view class="actions">
          <button size="mini" type="primary" @tap="updateValue">{{ t('countTo.demo.update') }}</button>
          <button size="mini" @tap="resetValue">{{ t('countTo.demo.reset') }}</button>
        </view>
      </view>
    </view>
  </see-config>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--see-bg-color);
}

.title {
  display: block;
  margin: 28rpx 0 16rpx;
  color: var(--see-tips-color);
  font-size: 28rpx;
}

.stats-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 32rpx;
  border: 1px solid var(--see-border-four-color);
  border-radius: 24rpx;
  background: var(--see-bg-color);
  box-shadow: var(--see-card-shadow);
}

.label {
  color: var(--see-tips-color);
  font-size: 24rpx;
}

.slot-prefix,
.slot-suffix {
  color: inherit;
  font-size: 28rpx;
}

.actions {
  display: flex;
  gap: 16rpx;
  margin-top: 12rpx;
}
</style>
