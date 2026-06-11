<template>
  <see-config>
    <text class="title">长按触发（默认）</text>
    <view class="demo-content">
      <see-tooltip content="长按显示提示">
        <see-button title="长按我" type="primary" />
      </see-tooltip>
    </view>

    <text class="title">点击触发</text>
    <view class="demo-content">
      <see-tooltip content="点击显示提示" trigger="click">
        <see-button title="点击我" type="primary" />
      </see-tooltip>
    </view>

    <text class="title">不同位置</text>
    <view class="demo-content">
      <view class="tooltip-grid">
        <see-tooltip content="顶部提示" position="top">
          <see-button title="上" type="primary" size="small" />
        </see-tooltip>
        <see-tooltip content="底部提示" position="bottom">
          <see-button title="下" type="primary" size="small" />
        </see-tooltip>
        <see-tooltip content="左侧提示" position="left">
          <see-button title="左" type="primary" size="small" />
        </see-tooltip>
        <see-tooltip content="右侧提示" position="right">
          <see-button title="右" type="primary" size="small" />
        </see-tooltip>
      </view>
    </view>

    <text class="title">浅色效果</text>
    <view class="demo-content">
      <see-tooltip content="浅色效果提示" effect="light">
        <see-button title="浅色效果" type="primary" />
      </see-tooltip>
    </view>

    <text class="title">手动控制</text>
    <view class="demo-content">
      <see-tooltip v-model:show="show1" content="手动控制的提示" trigger="manual">
        <see-button title="手动控制" type="primary" @click="show1 = !show1" />
      </see-tooltip>
    </view>

    <text class="title">禁用状态</text>
    <view class="demo-content">
      <see-tooltip content="不会显示" is-disabled>
        <see-button title="禁用状态" type="info" />
      </see-tooltip>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const show1 = ref(false)
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
.tooltip-grid {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
