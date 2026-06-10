<script lang="ts" setup>
import { ref } from 'vue'

const countDownRef = ref<{ start: () => void; pause: () => void; reset: (time?: number) => void } | null>(null)

const start = () => countDownRef.value?.start()
const pause = () => countDownRef.value?.pause()
const reset = () => countDownRef.value?.reset(60 * 1000)
</script>

<template>
  <see-config>
    <view class="page">
      <text class="title">基础用法</text>
      <view class="demo-card">
        <see-count-down :time="10 * 60 * 1000" :auto-start="false" />
      </view>

      <text class="title">天数展示</text>
      <view class="demo-card">
        <see-count-down :time="26 * 60 * 60 * 1000 + 5 * 60 * 1000" show-days :auto-start="false" />
      </view>

      <text class="title">块级展示</text>
      <view class="demo-card">
        <see-count-down :time="90 * 1000" block text-color="var(--see-primary)" font-size="36rpx" />
      </view>

      <text class="title">自定义分隔符</text>
      <view class="demo-card">
        <see-count-down :time="3661 * 1000" separator=" / " :auto-start="false" />
      </view>

      <text class="title">插槽用法</text>
      <view class="demo-card">
        <see-count-down :time="61000" :auto-start="false">
          <template #default="scope">
            <text class="slot-text">{{ scope.minutes }} 分 {{ scope.seconds }} 秒</text>
          </template>
        </see-count-down>
      </view>

      <text class="title">方法控制</text>
      <view class="demo-card">
        <see-count-down ref="countDownRef" :time="60 * 1000" :auto-start="false" />
        <view class="actions">
          <button size="mini" type="primary" @tap="start">开始</button>
          <button size="mini" @tap="pause">暂停</button>
          <button size="mini" @tap="reset">重置</button>
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

.demo-card {
  padding: 28rpx;
  border: 1px solid var(--see-border-four-color);
  border-radius: 20rpx;
  background: var(--see-bg-color);
  box-shadow: var(--see-card-shadow);
}

.slot-text {
  color: var(--see-primary);
  font-size: 32rpx;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}
</style>
