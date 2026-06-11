<template>
  <see-config>
    <text class="title">基础用法 - 左滑删除</text>
    <view class="demo-content">
      <see-swipe-action :right-actions="deleteActions" @on-click="onDelete">
        <see-cell title="左滑露出删除按钮" />
      </see-swipe-action>
    </view>

    <text class="title">多个操作按钮</text>
    <view class="demo-content">
      <see-swipe-action :right-actions="multiActions" @on-click="onAction">
        <see-cell title="左滑露出多个按钮" />
      </see-swipe-action>
    </view>

    <text class="title">左侧操作按钮</text>
    <view class="demo-content">
      <see-swipe-action :left-actions="leftActions" @on-click="onAction">
        <see-cell title="右滑露出操作按钮" />
      </see-swipe-action>
    </view>

    <text class="title">两侧操作按钮</text>
    <view class="demo-content">
      <see-swipe-action :left-actions="leftActions" :right-actions="multiActions" @on-click="onAction">
        <see-cell title="左右滑动都有按钮" />
      </see-swipe-action>
    </view>

    <text class="title">不同样式</text>
    <view class="demo-content">
      <see-swipe-action :right-actions="styleActions" @on-click="onAction">
        <see-cell title="不同样式的按钮" />
      </see-swipe-action>
    </view>

    <text class="title">禁用滑动</text>
    <view class="demo-content">
      <see-swipe-action :right-actions="deleteActions" is-disabled>
        <see-cell title="禁用滑动状态" />
      </see-swipe-action>
    </view>

    <text class="title">多个列表项</text>
    <view class="demo-content">
      <see-swipe-action v-for="item in list" :key="item.id" :right-actions="deleteActions" @on-click="(action) => onDeleteItem(item, action)">
        <see-cell :title="item.title" />
      </see-swipe-action>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from '@/uni_modules/see-u-ui'
import type { SwipeActionItem } from '@/uni_modules/see-u-ui'

const deleteActions: SwipeActionItem[] = [{ text: '删除', style: 'danger' }]

const multiActions: SwipeActionItem[] = [
  { text: '收藏', style: 'success' },
  { text: '编辑', style: 'warning' },
  { text: '删除', style: 'danger' }
]

const leftActions: SwipeActionItem[] = [{ text: '置顶', style: 'primary' }]

const styleActions: SwipeActionItem[] = [
  { text: '默认', style: 'default' },
  { text: '成功', style: 'success' },
  { text: '警告', style: 'warning' },
  { text: '危险', style: 'danger' }
]

const list = ref([
  { id: 1, title: '列表项 1' },
  { id: 2, title: '列表项 2' },
  { id: 3, title: '列表项 3' }
])

const onDelete = (_action: SwipeActionItem) => {
  toast.success('点击了删除')
}

const onAction = (_action: SwipeActionItem) => {
  toast.success(`点击了: ${_action.text}`)
}

const onDeleteItem = (item: { id: number; title: string }, _action: SwipeActionItem) => {
  list.value = list.value.filter((i) => i.id !== item.id)
  toast.success(`删除了: ${item.title}`)
}
</script>

<style lang="scss" scoped>
.title {
  display: block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: var(--see-tips-color);
}
.demo-content {
  padding: 0 30rpx 30rpx;
}
</style>
