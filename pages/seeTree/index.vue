<template>
  <view class="demo-tree">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tree.demo.basic') }}</text>
      <see-tree :data="basicData" />
    </view>

    <!-- 2. 复选框 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tree.demo.checkbox') }}</text>
      <see-tree :data="basicData" :is-checkable="true" />
    </view>

    <!-- 3. 搜索过滤 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tree.demo.search') }}</text>
      <see-tree :data="basicData" :is-filterable="true" />
    </view>

    <!-- 4. 组织架构示例 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tree.demo.org') }}</text>
      <see-tree :data="orgData" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeeTree from '@/uni_modules/see-u-ui/components/see-tree/see-tree.vue'

const { t } = useI18n()
useNavbarI18n('navbar.seeTree')

const basicData = [
  {
    id: 1,
    label: t('tree.demo.folder1'),
    children: [
      { id: 11, label: t('tree.demo.file11') },
      { id: 12, label: t('tree.demo.file12') }
    ]
  },
  {
    id: 2,
    label: t('tree.demo.folder2'),
    children: [
      {
        id: 21,
        label: t('tree.demo.subfolder21'),
        children: [
          { id: 211, label: t('tree.demo.file211') },
          { id: 212, label: t('tree.demo.file212') }
        ]
      },
      { id: 22, label: t('tree.demo.file22') }
    ]
  },
  { id: 3, label: t('tree.demo.file3') }
]

const orgData = [
  {
    id: 'ceo',
    label: 'CEO',
    children: [
      {
        id: 'cto',
        label: 'CTO',
        children: [
          { id: 'dev1', label: t('tree.demo.frontend') },
          { id: 'dev2', label: t('tree.demo.backend') },
          { id: 'dev3', label: t('tree.demo.qa') }
        ]
      },
      {
        id: 'cfo',
        label: 'CFO',
        children: [
          { id: 'fin1', label: t('tree.demo.finance') },
          { id: 'fin2', label: t('tree.demo.audit') }
        ]
      },
      {
        id: 'coo',
        label: 'COO',
        children: [
          { id: 'ops1', label: t('tree.demo.operations') },
          { id: 'ops2', label: t('tree.demo.marketing') }
        ]
      }
    ]
  }
]
</script>

<style lang="scss" scoped>
.demo-tree {
  padding: 0 32rpx 40rpx;
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 48rpx;

  &__title {
    display: block;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }
}
</style>
