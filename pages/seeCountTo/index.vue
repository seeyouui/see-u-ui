<script lang="ts" setup>
import { ref } from 'vue'

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
      <text class="title">基础统计</text>
      <view class="stats-card">
        <text class="label">访问量</text>
        <see-count-to :start-val="0" :end-val="12890" />
      </view>

      <text class="title">金额格式化</text>
      <view class="stats-card">
        <text class="label">成交额</text>
        <see-count-to :start-val="0" :end-val="986543.21" :decimals="2" prefix="¥" suffix=" 元" />
      </view>

      <text class="title">小数展示</text>
      <view class="stats-card">
        <text class="label">转化率</text>
        <see-count-to :start-val="0" :end-val="73.86" :decimals="2" suffix="%" />
      </view>

      <text class="title">插槽用法</text>
      <view class="stats-card">
        <text class="label">排名变化</text>
        <see-count-to :start-val="50" :end-val="12" color="var(--see-success)">
          <template #prefix>
            <text class="slot-prefix">{{ 'TOP ' }}</text>
          </template>
          <template #suffix>
            <text class="slot-suffix">{{ ' 名' }}</text>
          </template>
        </see-count-to>
      </view>

      <text class="title">方法控制</text>
      <view class="stats-card">
        <text class="label">实时收入</text>
        <see-count-to ref="countToRef" :start-val="26880" :end-val="target" prefix="¥" :autoplay="false" />
        <view class="actions">
          <button size="mini" type="primary" @tap="updateValue">更新</button>
          <button size="mini" @tap="resetValue">重置</button>
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
