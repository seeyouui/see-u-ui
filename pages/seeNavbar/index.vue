<template>
  <view class="demo-navbar">
    <!-- 1. 基础导航栏 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.basic') }}</text>
      <see-navbar :title="t('navBar.demo.pageTitle')" :is-fixed="false" @on-back="onBack" />
    </view>

    <!-- 2. 自定义左右插槽 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.customSlot') }}</text>
      <see-navbar :is-fixed="false">
        <template #left>
          <text class="custom-left">← {{ t('navBar.demo.back') }}</text>
        </template>
        <template #center>
          <text class="custom-center">{{ t('navBar.demo.customTitle') }}</text>
        </template>
        <template #right>
          <text class="custom-right">{{ t('navBar.demo.settings') }}</text>
        </template>
      </see-navbar>
    </view>

    <!-- 3. 右侧多按钮 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.rightIcon') }}</text>
      <see-navbar :title="t('navBar.demo.details')" :right-text="t('navBar.demo.edit')" right-icon="⋮" :is-fixed="false" />
    </view>

    <!-- 4. 搜索栏模式 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.searchMode') }}</text>
      <see-navbar :is-search="true" :search-placeholder="t('navBar.demo.searchPlaceholder')" :is-fixed="false" @on-search="onSearch" />
    </view>

    <!-- 5. 毛玻璃效果 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.frosted') }}</text>
      <view class="frosted-bg">
        <see-navbar :title="t('navBar.demo.frostedTitle')" :is-frosted="true" :is-fixed="false" />
      </view>
    </view>

    <!-- 6. 无边框模式 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.noBorder') }}</text>
      <see-navbar :title="t('navBar.demo.noBorderTitle')" :border="false" :is-fixed="false" />
    </view>

    <!-- 7. 自定义颜色 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.customColor') }}</text>
      <see-navbar :title="t('navBar.demo.blueTheme')" bg-color="#3ca7ff" title-color="#ffffff" :is-fixed="false" />
    </view>

    <!-- 8. 无左侧按钮 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.noLeft') }}</text>
      <see-navbar :title="t('navBar.demo.home')" :left-arrow="false" :is-show-left="false" :is-fixed="false" />
    </view>

    <!-- 9. 暗黑模式切换 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.darkMode') }}</text>
      <see-navbar :title="t('navBar.demo.darkModeTitle')" :is-fixed="false" />
    </view>

    <!-- 10. 完整组合示例 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('navBar.demo.complete') }}</text>
      <see-navbar
        :is-search="true"
        :search-placeholder="t('navBar.demo.searchEllipsis')"
        :is-frosted="true"
        :right-text="t('navBar.demo.message')"
        :is-fixed="false"
        @on-search="onSearch"
        @on-right-click="onRightClick"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeeNavbar from '@/uni_modules/see-u-ui/components/see-navbar/see-navbar.vue'

const { t } = useI18n()
useNavbarI18n('navbar.seeNavbar')

const onBack = () => {
  uni.showToast({ title: t('navBar.demo.back'), icon: 'none' })
}

const onSearch = (query: string) => {
  uni.showToast({ title: t('navBar.demo.searchResult', { query }), icon: 'none' })
}

const onRightClick = () => {
  uni.showToast({ title: t('navBar.demo.rightClick'), icon: 'none' })
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
