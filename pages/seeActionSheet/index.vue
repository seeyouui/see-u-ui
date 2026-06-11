<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-button title="基础 ActionSheet" type="primary" is-ripple @click="show1 = true" />
      <see-action-sheet v-model:show="show1" :actions="basicActions" @on-select="onSelect" />
    </view>

    <text class="title">带标题和描述</text>
    <view class="demo-content">
      <see-button title="带标题" type="primary" is-ripple @click="show2 = true" />
      <see-action-sheet v-model:show="show2" title="请选择操作" description="请选择你要执行的操作" :actions="basicActions" @on-select="onSelect" />
    </view>

    <text class="title">危险操作</text>
    <view class="demo-content">
      <see-button title="危险操作" type="primary" is-ripple @click="show3 = true" />
      <see-action-sheet v-model:show="show3" title="确认删除？" :actions="dangerActions" @on-select="onSelect" />
    </view>

    <text class="title">禁用选项</text>
    <view class="demo-content">
      <see-button title="禁用选项" type="primary" is-ripple @click="show4 = true" />
      <see-action-sheet v-model:show="show4" :actions="disabledActions" @on-select="onSelect" />
    </view>

    <text class="title">无取消按钮</text>
    <view class="demo-content">
      <see-button title="无取消按钮" type="primary" is-ripple @click="show5 = true" />
      <see-action-sheet v-model:show="show5" :actions="basicActions" :is-show-cancel-btn="false" @on-select="onSelect" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from '@/uni_modules/see-u-ui'
import type { ActionSheetAction } from '@/uni_modules/see-u-ui'

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)

const basicActions: ActionSheetAction[] = [{ name: '选项一' }, { name: '选项二' }, { name: '选项三' }]

const dangerActions: ActionSheetAction[] = [{ name: '编辑' }, { name: '删除', color: 'var(--see-error)' }]

const disabledActions: ActionSheetAction[] = [{ name: '选项一' }, { name: '选项二（禁用）', isDisabled: true }, { name: '选项三' }]

const onSelect = (action: ActionSheetAction, _index: number) => {
  toast.success(`选择了: ${action.name}`)
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
