<template>
  <see-config>
    <text class="title">基础骨架屏</text>
    <view class="demo-content">
      <see-skeleton />
    </view>

    <text class="title">自定义行数</text>
    <view class="demo-content">
      <see-skeleton :rows="5" />
    </view>

    <text class="title">自定义行宽度</text>
    <view class="demo-content">
      <see-skeleton :row-width="['100%', '80%', '60%']" />
    </view>

    <text class="title">带标题模式</text>
    <view class="demo-content">
      <see-skeleton :title="true" :rows="3" />
    </view>

    <text class="title">带头像 + 标题</text>
    <view class="demo-content">
      <see-skeleton :avatar="true" :title="true" :rows="3" />
    </view>

    <text class="title">方形头像</text>
    <view class="demo-content">
      <see-skeleton :avatar="true" avatar-shape="square" :rows="2" />
    </view>

    <text class="title">关闭动画</text>
    <view class="demo-content">
      <see-skeleton :is-animate="false" />
    </view>

    <text class="title">加载完成显示内容</text>
    <view class="demo-content">
      <see-skeleton :loading="isLoading">
        <view class="loaded-content">
          <text>这是实际加载完成的内容</text>
          <text class="loaded-sub">数据已成功加载</text>
        </view>
      </see-skeleton>
      <view class="btn-wrap">
        <see-button size="small" type="primary" is-ripple @click="toggleLoading">
          {{ isLoading ? '加载完成' : '重新加载' }}
        </see-button>
      </view>
    </view>

    <text class="title">带头像的加载完成</text>
    <view class="demo-content">
      <see-skeleton :loading="isLoading2" :avatar="true" :title="true" :rows="3">
        <view class="loaded-content">
          <view class="loaded-header">
            <view class="loaded-avatar" />
            <text class="loaded-name">用户名称</text>
          </view>
          <text>这是带头像骨架屏加载完成后的实际内容展示。</text>
        </view>
      </see-skeleton>
      <view class="btn-wrap">
        <see-button size="small" type="primary" is-ripple @click="toggleLoading2">
          {{ isLoading2 ? '加载完成' : '重新加载' }}
        </see-button>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isLoading = ref(true)
const isLoading2 = ref(true)

const toggleLoading = () => {
  isLoading.value = !isLoading.value
}

const toggleLoading2 = () => {
  isLoading2.value = !isLoading2.value
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

.btn-wrap {
  margin-top: 20rpx;
}

.loaded-content {
  padding: 24rpx 0;
}

.loaded-sub {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: var(--see-tips-color);
}

.loaded-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.loaded-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: var(--see-primary);
  margin-right: 24rpx;
}

.loaded-name {
  font-size: 30rpx;
  font-weight: bold;
}
</style>
