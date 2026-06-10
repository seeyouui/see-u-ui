<template>
  <see-config>
    <view class="demo-loading-icon">
      <view class="demo-section">
        <text class="demo-title">动画类型</text>
        <view class="demo-row">
          <view class="demo-item">
            <see-loading-icon type="spinner" />
            <text class="demo-label">spinner</text>
          </view>
          <view class="demo-item">
            <see-loading-icon type="circular" />
            <text class="demo-label">circular</text>
          </view>
          <view class="demo-item">
            <see-loading-icon type="dots" />
            <text class="demo-label">dots</text>
          </view>
          <view class="demo-item">
            <see-loading-icon type="pulse" />
            <text class="demo-label">pulse</text>
          </view>
        </view>
      </view>

      <view class="demo-section">
        <text class="demo-title">自定义颜色</text>
        <view class="demo-row">
          <view class="demo-item">
            <see-loading-icon color="#07c160" />
            <text class="demo-label">绿色</text>
          </view>
          <view class="demo-item">
            <see-loading-icon color="#ee0a24" />
            <text class="demo-label">红色</text>
          </view>
          <view class="demo-item">
            <see-loading-icon color="#1989fa" />
            <text class="demo-label">蓝色</text>
          </view>
          <view class="demo-item">
            <see-loading-icon color="#ff976a" />
            <text class="demo-label">橙色</text>
          </view>
        </view>
      </view>

      <view class="demo-section">
        <text class="demo-title">自定义尺寸</text>
        <view class="demo-row">
          <view class="demo-item">
            <see-loading-icon size="32rpx" />
            <text class="demo-label">32rpx</text>
          </view>
          <view class="demo-item">
            <see-loading-icon size="48rpx" />
            <text class="demo-label">48rpx</text>
          </view>
          <view class="demo-item">
            <see-loading-icon size="64rpx" />
            <text class="demo-label">64rpx</text>
          </view>
          <view class="demo-item">
            <see-loading-icon size="96rpx" />
            <text class="demo-label">96rpx</text>
          </view>
        </view>
      </view>

      <view class="demo-section">
        <text class="demo-title">自定义速度</text>
        <view class="demo-row">
          <view class="demo-item">
            <see-loading-icon :speed="0.4" />
            <text class="demo-label">0.4s</text>
          </view>
          <view class="demo-item">
            <see-loading-icon :speed="0.8" />
            <text class="demo-label">0.8s</text>
          </view>
          <view class="demo-item">
            <see-loading-icon :speed="1.2" />
            <text class="demo-label">1.2s</text>
          </view>
          <view class="demo-item">
            <see-loading-icon :speed="2.0" />
            <text class="demo-label">2.0s</text>
          </view>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.demo-loading-icon {
  padding: 32rpx;
}

.demo-section {
  margin-bottom: 48rpx;
}

.demo-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  display: block;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 40rpx;
}

.demo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.demo-label {
  font-size: 24rpx;
  color: #999;
}
</style>
