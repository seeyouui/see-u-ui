<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-button type="primary" is-ripple style="margin-right: 20rpx" @click="showBasic = true">显示无网络提示</see-button>
      <see-button type="primary" is-ripple @click="showBasic = false">隐藏</see-button>
      <see-no-network v-model:show="showBasic" :auto-check="false" />
    </view>

    <text class="title">自定义文案</text>
    <view class="demo-content">
      <see-button type="primary" is-ripple @click="showCustom = true">显示自定义文案</see-button>
      <see-no-network v-model:show="showCustom" text="哎呀，网络开小差了~" retry-text="点击重试" :auto-check="false" />
    </view>

    <text class="title">全屏模式</text>
    <view class="demo-content">
      <see-button type="primary" is-ripple @click="showFullscreen = true">显示全屏无网络提示</see-button>
      <see-no-network v-model:show="showFullscreen" is-fullscreen :auto-check="false" />
    </view>

    <text class="title">重试事件</text>
    <view class="demo-content">
      <see-button type="primary" is-ripple @click="showRetry = true">显示（带重试回调）</see-button>
      <see-no-network v-model:show="showRetry" :auto-check="false" @on-retry="handleRetry" />
      <text v-if="retryCount > 0" class="retry-tip">已重试 {{ retryCount }} 次</text>
    </view>

    <text class="title">自动监听网络状态</text>
    <view class="demo-content">
      <text class="demo-tip">autoCheck 默认为 true，组件会自动监听网络变化并显示/隐藏</text>
      <see-no-network v-model:show="showAuto" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const showBasic = ref(false)
const showCustom = ref(false)
const showFullscreen = ref(false)
const showRetry = ref(false)
const showAuto = ref(false)
const retryCount = ref(0)

const handleRetry = () => {
  retryCount.value++
}
</script>

<style lang="scss" scoped>
.title {
  display: block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: var(--see-tips-color);
}
.demo-content {
  padding: 0 30rpx 30rpx;
}
.retry-tip {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--see-primary);
}
.demo-tip {
  display: block;
  margin-bottom: 16rpx;
  font-size: 24rpx;
  color: var(--see-tips-color);
}
</style>
