<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-copy text="这是要复制的文字">
        <see-button title="点击复制" type="primary" />
      </see-copy>
    </view>

    <text class="title">复制订单号</text>
    <view class="demo-content">
      <view class="copy-row">
        <text class="copy-label">订单号：</text>
        <see-copy text="2024010100001">
          <text class="copy-value">2024010100001</text>
        </see-copy>
      </view>
    </view>

    <text class="title">复制邀请码</text>
    <view class="demo-content">
      <view class="copy-row">
        <text class="copy-label">邀请码：</text>
        <see-copy text="ABC123" toast-message="邀请码已复制">
          <text class="copy-value copy-value--highlight">ABC123</text>
        </see-copy>
      </view>
    </view>

    <text class="title">自定义提示文字</text>
    <view class="demo-content">
      <see-copy text="自定义提示" toast-message="复制成功，请粘贴使用">
        <see-button title="自定义提示" type="primary" />
      </see-copy>
    </view>

    <text class="title">不显示 Toast</text>
    <view class="demo-content">
      <see-copy text="静默复制" :is-show-toast="false" @on-success="onSuccess">
        <see-button title="静默复制" type="primary" />
      </see-copy>
    </view>

    <text class="title">禁用状态</text>
    <view class="demo-content">
      <see-copy text="不会复制" is-disabled>
        <see-button title="禁用复制" type="info" />
      </see-copy>
    </view>

    <text class="title">命令式调用</text>
    <view class="demo-content">
      <see-button title="命令式复制" type="primary" @click="handleCopy" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { toast, seeCopy } from '@/uni_modules/see-u-ui'

const onSuccess = () => {
  toast.success('已复制到剪贴板')
}

const handleCopy = async () => {
  const success = await seeCopy.copy('命令式复制的内容')
  if (success) {
    toast.success('复制成功')
  }
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
.copy-row {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: var(--see-info);
  border-radius: 8rpx;
}
.copy-label {
  font-size: 28rpx;
  color: var(--see-content-color);
}
.copy-value {
  font-size: 28rpx;
  color: var(--see-primary);

  &--highlight {
    font-weight: bold;
    text-decoration: underline;
  }
}
</style>
