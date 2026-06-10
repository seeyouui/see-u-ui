<script lang="ts" setup>
const gradientColors = ['var(--see-primary)', 'var(--see-success)']
</script>

<template>
  <see-config>
    <view class="page">
      <text class="title">基础用法</text>
      <view class="demo-card">
        <see-line-progress :percentage="35" />
      </view>

      <text class="title">状态展示</text>
      <view class="demo-card demo-card--gap">
        <see-line-progress :percentage="100" status="success" />
        <see-line-progress :percentage="68" status="warning" />
        <see-line-progress :percentage="42" status="error" />
      </view>

      <text class="title">渐变进度</text>
      <view class="demo-card">
        <see-line-progress :percentage="76" :active-color="gradientColors" stroke-width="20rpx" />
      </view>

      <text class="title">条纹动画</text>
      <view class="demo-card">
        <see-line-progress :percentage="58" striped animated />
      </view>

      <text class="title">内嵌文字</text>
      <view class="demo-card">
        <see-line-progress :percentage="88" text-inside stroke-width="32rpx" />
      </view>

      <text class="title">插槽用法</text>
      <view class="demo-card">
        <see-line-progress :percentage="64">
          <template #text="scope">
            <text class="custom-text">已完成 {{ scope.percentage }}%</text>
          </template>
        </see-line-progress>
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

.demo-card--gap {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.custom-text {
  color: var(--see-primary);
  font-size: 24rpx;
  font-weight: 600;
}
</style>
