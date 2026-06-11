<template>
  <view class="demo-navbar">
    <!-- 1. 基础导航栏 -->
    <view class="demo-section">
      <text class="demo-section__title">1. 基础导航栏</text>
      <see-navbar title="页面标题" :is-fixed="false" @on-back="onBack" />
    </view>

    <!-- 2. 自定义左右插槽 -->
    <view class="demo-section">
      <text class="demo-section__title">2. 自定义左右插槽</text>
      <see-navbar :is-fixed="false">
        <template #left>
          <text class="custom-left">← 返回</text>
        </template>
        <template #center>
          <text class="custom-center">自定义标题</text>
        </template>
        <template #right>
          <text class="custom-right">设置</text>
        </template>
      </see-navbar>
    </view>

    <!-- 3. 右侧多按钮 -->
    <view class="demo-section">
      <text class="demo-section__title">3. 右侧文字 + 图标</text>
      <see-navbar title="详情" right-text="编辑" right-icon="⋮" :is-fixed="false" />
    </view>

    <!-- 4. 搜索栏模式 -->
    <view class="demo-section">
      <text class="demo-section__title">4. 搜索栏模式</text>
      <see-navbar :is-search="true" search-placeholder="搜索商品、店铺" :is-fixed="false" @on-search="onSearch" />
    </view>

    <!-- 5. 毛玻璃效果 -->
    <view class="demo-section">
      <text class="demo-section__title">5. 毛玻璃效果</text>
      <view class="frosted-bg">
        <see-navbar title="毛玻璃导航栏" :is-frosted="true" :is-fixed="false" />
      </view>
    </view>

    <!-- 6. 无边框模式 -->
    <view class="demo-section">
      <text class="demo-section__title">6. 无边框模式</text>
      <see-navbar title="无边框" :border="false" :is-fixed="false" />
    </view>

    <!-- 7. 自定义颜色 -->
    <view class="demo-section">
      <text class="demo-section__title">7. 自定义颜色</text>
      <see-navbar title="蓝色主题" bg-color="#3ca7ff" title-color="#ffffff" :is-fixed="false" />
    </view>

    <!-- 8. 无左侧按钮 -->
    <view class="demo-section">
      <text class="demo-section__title">8. 无左侧按钮</text>
      <see-navbar title="首页" :left-arrow="false" :is-show-left="false" :is-fixed="false" />
    </view>

    <!-- 9. 暗黑模式切换 -->
    <view class="demo-section">
      <text class="demo-section__title">9. 暗黑模式切换</text>
      <see-navbar title="暗黑模式" :is-fixed="false" />
    </view>

    <!-- 10. 完整组合示例 -->
    <view class="demo-section">
      <text class="demo-section__title">10. 完整组合示例</text>
      <see-navbar
        :is-search="true"
        search-placeholder="搜索..."
        :is-frosted="true"
        right-text="消息"
        :is-fixed="false"
        @on-search="onSearch"
        @on-right-click="onRightClick"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import SeeNavbar from '@/uni_modules/see-u-ui/components/see-navbar/see-navbar.vue'

const onBack = () => {
  uni.showToast({ title: '点击返回', icon: 'none' })
}

const onSearch = (query: string) => {
  uni.showToast({ title: `搜索: ${query}`, icon: 'none' })
}

const onRightClick = () => {
  uni.showToast({ title: '点击右侧', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-navbar {
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

.frosted-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.custom-left,
.custom-center,
.custom-right {
  font-size: 28rpx;
  color: var(--see-main-color);
}
</style>
