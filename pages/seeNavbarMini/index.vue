<template>
  <view class="demo-navbar-mini">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">1. 基础用法</text>
      <see-navbar-mini title="子页面标题" @on-back="onBack" />
    </view>

    <!-- 2. 自定义标题 -->
    <view class="demo-section">
      <text class="demo-section__title">2. 自定义标题</text>
      <see-navbar-mini title="设置页面" @on-back="onBack" />
    </view>

    <!-- 3. 无返回按钮 -->
    <view class="demo-section">
      <text class="demo-section__title">3. 无返回按钮</text>
      <see-navbar-mini title="弹窗标题" :is-show-back="false" />
    </view>

    <!-- 4. 右侧插槽 -->
    <view class="demo-section">
      <text class="demo-section__title">4. 右侧插槽</text>
      <see-navbar-mini title="详情" @on-back="onBack">
        <template #right>
          <text class="action-text">保存</text>
        </template>
      </see-navbar-mini>
    </view>

    <!-- 5. 自定义背景色 -->
    <view class="demo-section">
      <text class="demo-section__title">5. 自定义背景色</text>
      <see-navbar-mini title="蓝色主题" bg-color="#3ca7ff" @on-back="onBack" />
    </view>

    <!-- 6. 弹窗内使用 -->
    <view class="demo-section">
      <text class="demo-section__title">6. 弹窗内使用</text>
      <view class="mock-popup">
        <see-navbar-mini title="弹窗内容" :is-show-back="false">
          <template #right>
            <text class="close-icon">✕</text>
          </template>
        </see-navbar-mini>
        <view class="mock-popup__content">
          <text>弹窗内容区域</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import SeeNavbarMini from '@/uni_modules/see-u-ui/components/see-navbar-mini/see-navbar-mini.vue'

const onBack = () => {
  uni.showToast({ title: '点击返回', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-navbar-mini {
  padding-bottom: 40rpx;
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 32rpx;

  &__title {
    display: block;
    padding: 24rpx 32rpx;
    font-size: 28rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }
}

.action-text {
  font-size: 28rpx;
  color: var(--see-primary);
}

.close-icon {
  font-size: 32rpx;
  color: var(--see-tips-color);
}

.mock-popup {
  margin: 0 32rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

  &__content {
    padding: 32rpx;
    min-height: 200rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--see-tips-color);
    font-size: 28rpx;
  }
}
</style>
