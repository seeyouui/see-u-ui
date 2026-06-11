<template>
  <view class="demo-empty">
    <!-- 1. 默认类型 -->
    <view class="demo-section">
      <text class="demo-section__title">1. 默认类型</text>
      <see-empty type="default" />
    </view>

    <!-- 2. 搜索无结果 -->
    <view class="demo-section">
      <text class="demo-section__title">2. 搜索无结果</text>
      <see-empty type="search" />
    </view>

    <!-- 3. 网络异常 -->
    <view class="demo-section">
      <text class="demo-section__title">3. 网络异常</text>
      <see-empty type="network" :is-show-action="true" action-text="重试" @on-action="onRetry" />
    </view>

    <!-- 4. 页面出错 -->
    <view class="demo-section">
      <text class="demo-section__title">4. 页面出错</text>
      <see-empty type="error" :is-show-action="true" action-text="刷新" @on-action="onRefresh" />
    </view>

    <!-- 5. 404 -->
    <view class="demo-section">
      <text class="demo-section__title">5. 404 页面不存在</text>
      <see-empty type="404" :is-show-action="true" action-text="返回首页" @on-action="onGoHome" />
    </view>

    <!-- 6. 自定义标题和描述 -->
    <view class="demo-section">
      <text class="demo-section__title">6. 自定义标题和描述</text>
      <see-empty title="购物车是空的" description="快去挑选心仪的商品吧" :is-show-action="true" action-text="去逛逛" />
    </view>

    <!-- 底部占位 -->
    <view style="height: 100rpx" />
  </view>
</template>

<script lang="ts" setup>
import SeeEmpty from '@/uni_modules/see-u-ui/components/see-empty/see-empty.vue'

const onRetry = () => {
  uni.showToast({ title: '重试中...', icon: 'none' })
}

const onRefresh = () => {
  uni.showToast({ title: '刷新中...', icon: 'none' })
}

const onGoHome = () => {
  uni.showToast({ title: '返回首页', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-empty {
  padding: 0 32rpx 40rpx;
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 48rpx;
  border-bottom: 1rpx solid var(--see-border-four-color);
  padding-bottom: 32rpx;

  &:last-child {
    border-bottom: none;
  }

  &__title {
    display: block;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }
}
</style>
