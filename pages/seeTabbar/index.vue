<template>
  <view class="demo-tabbar">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.basic') }}</text>
      <see-tabbar v-model="activeTab1" :tabs="basicTabs" :is-fixed="false" />
    </view>

    <!-- 2. 自定义图标 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.customIcon') }}</text>
      <see-tabbar v-model="activeTab2" :tabs="customIconTabs" :is-fixed="false" />
    </view>

    <!-- 3. Badge/Dot -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.badge') }}</text>
      <see-tabbar v-model="activeTab3" :tabs="badgeTabs" :is-fixed="false" />
    </view>

    <!-- 4. 中央凸起按钮 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.centerBtn') }}</text>
      <see-tabbar v-model="activeTab4" :tabs="centerTabs" :is-fixed="false" @on-center-click="onCenterClick" />
    </view>

    <!-- 5. 自定义颜色 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.customColor') }}</text>
      <see-tabbar v-model="activeTab5" :tabs="basicTabs" :is-fixed="false" active-color="#ff6b6b" inactive-color="#999999" />
    </view>

    <!-- 6. 毛玻璃效果 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.frosted') }}</text>
      <view class="frosted-bg">
        <see-tabbar v-model="activeTab6" :tabs="basicTabs" :is-frosted="true" :is-fixed="false" />
      </view>
    </view>

    <!-- 7. 无边框 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.noBorder') }}</text>
      <see-tabbar v-model="activeTab7" :tabs="basicTabs" :border="false" :is-fixed="false" />
    </view>

    <!-- 8. 禁用状态 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.disabledState') }}</text>
      <see-tabbar v-model="activeTab8" :tabs="disabledTabs" :is-fixed="false" />
    </view>

    <!-- 9. 动态 tab -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.dynamic') }}</text>
      <see-tabbar v-model="activeTab9" :tabs="dynamicTabs" :is-fixed="false" />
      <view class="demo-actions">
        <text class="demo-btn" @tap="addTab">{{ t('tabBar.demo.addTab') }}</text>
        <text class="demo-btn" @tap="removeTab">{{ t('tabBar.demo.removeTab') }}</text>
      </view>
    </view>

    <!-- 10. 完整应用导航 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabBar.demo.full') }}</text>
      <see-tabbar v-model="activeTab10" :tabs="fullTabs" :is-fixed="false" />
    </view>

    <!-- 底部占位 -->
    <view style="height: 200rpx" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeeTabbar from '@/uni_modules/see-u-ui/components/see-tabbar/see-tabbar.vue'

const { t } = useI18n()
useNavbarI18n('navbar.seeTabbar')

const activeTab1 = ref('home')
const activeTab2 = ref('home')
const activeTab3 = ref('home')
const activeTab4 = ref('home')
const activeTab5 = ref('home')
const activeTab6 = ref('home')
const activeTab7 = ref('home')
const activeTab8 = ref('home')
const activeTab9 = ref('home')
const activeTab10 = ref('home')

const basicTabs = [
  { name: 'home', text: t('tabBar.demo.home'), icon: '🏠' },
  { name: 'category', text: t('tabBar.demo.category'), icon: '📂' },
  { name: 'cart', text: t('tabBar.demo.cart'), icon: '🛒' },
  { name: 'mine', text: t('tabBar.demo.mine'), icon: '👤' }
]

const customIconTabs = [
  { name: 'home', text: t('tabBar.demo.home'), icon: '🏠', activeIcon: '🏡' },
  { name: 'category', text: t('tabBar.demo.category'), icon: '📂', activeIcon: '📁' },
  { name: 'cart', text: t('tabBar.demo.cart'), icon: '🛒', activeIcon: '🛍️' },
  { name: 'mine', text: t('tabBar.demo.mine'), icon: '👤', activeIcon: '🧑' }
]

const badgeTabs = [
  { name: 'home', text: t('tabBar.demo.home'), icon: '🏠' },
  { name: 'msg', text: t('tabBar.demo.msg'), icon: '💬', badge: 99 },
  { name: 'cart', text: t('tabBar.demo.cart'), icon: '🛒', dot: true },
  { name: 'mine', text: t('tabBar.demo.mine'), icon: '👤' }
]

const centerTabs = [
  { name: 'home', text: t('tabBar.demo.home'), icon: '🏠' },
  { name: 'category', text: t('tabBar.demo.category'), icon: '📂' },
  { name: 'publish', text: t('tabBar.demo.publish'), icon: '➕', isCenter: true, centerIcon: '✚' },
  { name: 'cart', text: t('tabBar.demo.cart'), icon: '🛒' },
  { name: 'mine', text: t('tabBar.demo.mine'), icon: '👤' }
]

const disabledTabs = [
  { name: 'home', text: t('tabBar.demo.home'), icon: '🏠' },
  { name: 'disabled', text: t('tabBar.demo.disabled'), icon: '🚫', isDisabled: true },
  { name: 'cart', text: t('tabBar.demo.cart'), icon: '🛒' },
  { name: 'mine', text: t('tabBar.demo.mine'), icon: '👤' }
]

const dynamicTabs = ref([
  { name: 'home', text: t('tabBar.demo.home'), icon: '🏠' },
  { name: 'tab2', text: t('tabBar.demo.tab2'), icon: '📄' }
])

let tabIndex = 3
const addTab = () => {
  dynamicTabs.value.push({ name: `tab${tabIndex}`, text: `Tab${tabIndex}`, icon: '📄' })
  tabIndex++
}

const removeTab = () => {
  if (dynamicTabs.value.length > 2) {
    dynamicTabs.value.pop()
    tabIndex--
  }
}

const fullTabs = [
  { name: 'home', text: t('tabBar.demo.home'), icon: '🏠', activeIcon: '🏡' },
  { name: 'category', text: t('tabBar.demo.category'), icon: '📂', activeIcon: '📁' },
  { name: 'publish', text: t('tabBar.demo.publish'), icon: '➕', isCenter: true, centerIcon: '✚' },
  { name: 'cart', text: t('tabBar.demo.cart'), icon: '🛒', badge: 5, activeIcon: '🛍️' },
  { name: 'mine', text: t('tabBar.demo.mine'), icon: '👤', dot: true, activeIcon: '🧑' }
]

const onCenterClick = () => {
  uni.showToast({ title: t('tabBar.demo.centerClick'), icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-tabbar {
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

.demo-actions {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 32rpx;
}

.demo-btn {
  padding: 12rpx 24rpx;
  background: var(--see-primary);
  color: #ffffff;
  border-radius: 8rpx;
  font-size: 24rpx;
}
</style>
