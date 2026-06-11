<template>
  <view class="demo-tree">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">1. 基础用法</text>
      <see-tree :data="basicData" />
    </view>

    <!-- 2. 复选框 -->
    <view class="demo-section">
      <text class="demo-section__title">2. 复选框</text>
      <see-tree :data="basicData" :is-checkable="true" />
    </view>

    <!-- 3. 搜索过滤 -->
    <view class="demo-section">
      <text class="demo-section__title">3. 搜索过滤</text>
      <see-tree :data="basicData" :is-filterable="true" />
    </view>

    <!-- 4. 组织架构示例 -->
    <view class="demo-section">
      <text class="demo-section__title">4. 组织架构示例</text>
      <see-tree :data="orgData" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import SeeTree from '@/uni_modules/see-u-ui/components/see-tree/see-tree.vue'

const basicData = [
  {
    id: 1,
    label: '文件夹1',
    children: [
      { id: 11, label: '文件1-1.txt' },
      { id: 12, label: '文件1-2.txt' }
    ]
  },
  {
    id: 2,
    label: '文件夹2',
    children: [
      {
        id: 21,
        label: '子文件夹2-1',
        children: [
          { id: 211, label: '文件2-1-1.txt' },
          { id: 212, label: '文件2-1-2.txt' }
        ]
      },
      { id: 22, label: '文件2-2.txt' }
    ]
  },
  { id: 3, label: '文件3.txt' }
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
          { id: 'dev1', label: '前端开发组' },
          { id: 'dev2', label: '后端开发组' },
          { id: 'dev3', label: '测试组' }
        ]
      },
      {
        id: 'cfo',
        label: 'CFO',
        children: [
          { id: 'fin1', label: '财务部' },
          { id: 'fin2', label: '审计部' }
        ]
      },
      {
        id: 'coo',
        label: 'COO',
        children: [
          { id: 'ops1', label: '运营部' },
          { id: 'ops2', label: '市场部' }
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
