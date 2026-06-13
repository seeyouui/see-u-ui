<template>
  <view class="demo-index-list">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('indexList.demo.basic') }}</text>
      <see-index-list :data="basicData" height="400px" @on-select="onSelect" />
    </view>

    <!-- 2. 带搜索框 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('indexList.demo.search') }}</text>
      <see-index-list :data="basicData" :is-show-search="true" height="400px" />
    </view>

    <!-- 3. 通讯录示例 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('indexList.demo.contacts') }}</text>
      <see-index-list :data="contactData" height="500px" @on-select="onContactSelect" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeeIndexList from '@/uni_modules/see-u-ui/components/see-index-list/see-index-list.vue'

const { t } = useI18n()
useNavbarI18n('navbar.seeIndexList')

const basicData = [
  { index: 'A', name: 'Alice' },
  { index: 'A', name: 'Andy' },
  { index: 'B', name: 'Bob' },
  { index: 'B', name: 'Ben' },
  { index: 'C', name: 'Charlie' },
  { index: 'D', name: 'David' },
  { index: 'E', name: 'Eve' },
  { index: 'F', name: 'Frank' },
  { index: 'G', name: 'Grace' }
]

const contactData = [
  { index: 'A', name: '安妮' },
  { index: 'B', name: '白鸽' },
  { index: 'C', name: '陈明' },
  { index: 'D', name: '邓丽' },
  { index: 'F', name: '方圆' },
  { index: 'G', name: '郭靖' },
  { index: 'H', name: '黄蓉' },
  { index: 'L', name: '李四' },
  { index: 'M', name: '马云' },
  { index: 'W', name: '王五' },
  { index: 'Z', name: '张三' },
  { index: 'Z', name: '赵六' }
]

const onSelect = (item: any) => {
  uni.showToast({ title: t('indexList.demo.selected', { name: item.name }), icon: 'none' })
}

const onContactSelect = (item: any) => {
  uni.showToast({ title: t('indexList.demo.contact', { name: item.name }), icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-index-list {
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
</style>
