<template>
  <see-config>
    <text class="title">{{ t('swipeAction.demo.basic') }}</text>
    <view class="demo-content">
      <see-swipe-action :right-actions="deleteActions" @on-click="onDelete">
        <see-cell :title="t('swipeAction.demo.swipeDelete')" />
      </see-swipe-action>
    </view>

    <text class="title">{{ t('swipeAction.demo.multi') }}</text>
    <view class="demo-content">
      <see-swipe-action :right-actions="multiActions" @on-click="onAction">
        <see-cell :title="t('swipeAction.demo.swipeMulti')" />
      </see-swipe-action>
    </view>

    <text class="title">{{ t('swipeAction.demo.left') }}</text>
    <view class="demo-content">
      <see-swipe-action :left-actions="leftActions" @on-click="onAction">
        <see-cell :title="t('swipeAction.demo.swipeLeft')" />
      </see-swipe-action>
    </view>

    <text class="title">{{ t('swipeAction.demo.both') }}</text>
    <view class="demo-content">
      <see-swipe-action :left-actions="leftActions" :right-actions="multiActions" @on-click="onAction">
        <see-cell :title="t('swipeAction.demo.swipeBoth')" />
      </see-swipe-action>
    </view>

    <text class="title">{{ t('swipeAction.demo.style') }}</text>
    <view class="demo-content">
      <see-swipe-action :right-actions="styleActions" @on-click="onAction">
        <see-cell :title="t('swipeAction.demo.swipeStyle')" />
      </see-swipe-action>
    </view>

    <text class="title">{{ t('swipeAction.demo.disabled') }}</text>
    <view class="demo-content">
      <see-swipe-action :right-actions="deleteActions" is-disabled>
        <see-cell :title="t('swipeAction.demo.swipeDisabled')" />
      </see-swipe-action>
    </view>

    <text class="title">{{ t('swipeAction.demo.list') }}</text>
    <view class="demo-content">
      <see-swipe-action v-for="item in list" :key="item.id" :right-actions="deleteActions" @on-click="(action) => onDeleteItem(item, action)">
        <see-cell :title="item.title" />
      </see-swipe-action>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { toast, useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import type { SwipeActionItem } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeSwipeAction')

const deleteActions: SwipeActionItem[] = [{ text: t('swipeAction.demo.delete'), style: 'danger' }]

const multiActions: SwipeActionItem[] = [
  { text: t('swipeAction.demo.favorite'), style: 'success' },
  { text: t('swipeAction.demo.edit'), style: 'warning' },
  { text: t('swipeAction.demo.delete'), style: 'danger' }
]

const leftActions: SwipeActionItem[] = [{ text: t('swipeAction.demo.top'), style: 'primary' }]

const styleActions: SwipeActionItem[] = [
  { text: t('swipeAction.demo.default'), style: 'default' },
  { text: t('swipeAction.demo.success'), style: 'success' },
  { text: t('swipeAction.demo.warning'), style: 'warning' },
  { text: t('swipeAction.demo.danger'), style: 'danger' }
]

const list = ref([
  { id: 1, title: t('swipeAction.demo.item1') },
  { id: 2, title: t('swipeAction.demo.item2') },
  { id: 3, title: t('swipeAction.demo.item3') }
])

const onDelete = (_action: SwipeActionItem) => {
  toast.success(t('swipeAction.demo.deleted'))
}

const onAction = (_action: SwipeActionItem) => {
  toast.success(t('swipeAction.demo.clicked', { name: _action.text }))
}

const onDeleteItem = (item: { id: number; title: string }, _action: SwipeActionItem) => {
  list.value = list.value.filter((i) => i.id !== item.id)
  toast.success(t('swipeAction.demo.deletedItem', { name: item.title }))
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
