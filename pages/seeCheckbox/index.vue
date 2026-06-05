<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法（独立 Checkbox）</text>
      <view class="content">
        <see-checkbox v-model="basicChecked">选项一</see-checkbox>
        <text class="info">当前状态：{{ basicChecked ? '已选中' : '未选中' }}</text>
      </view>

      <text class="title">CheckboxGroup 用法</text>
      <view class="content">
        <see-checkbox-group v-model="groupValues">
          <see-checkbox label="apple">苹果</see-checkbox>
          <see-checkbox label="banana">香蕉</see-checkbox>
          <see-checkbox label="orange">橘子</see-checkbox>
          <see-checkbox label="grape">葡萄</see-checkbox>
        </see-checkbox-group>
        <text class="info">选中值：{{ groupValues.join(', ') || '无' }}</text>
      </view>

      <text class="title">全选 / 半选</text>
      <view class="content">
        <see-checkbox v-model="isAllChecked" :is-indeterminate="isIndeterminate" @on-change="handleCheckAll">全选</see-checkbox>
        <view style="height: 8px" />
        <see-checkbox-group v-model="fruitValues">
          <see-checkbox label="apple">苹果</see-checkbox>
          <see-checkbox label="banana">香蕉</see-checkbox>
          <see-checkbox label="orange">橘子</see-checkbox>
        </see-checkbox-group>
      </view>

      <text class="title">最少 / 最多选择限制</text>
      <view class="content">
        <see-checkbox-group v-model="limitValues" :min="1" :max="3">
          <see-checkbox label="a">选项 A</see-checkbox>
          <see-checkbox label="b">选项 B</see-checkbox>
          <see-checkbox label="c">选项 C</see-checkbox>
          <see-checkbox label="d">选项 D</see-checkbox>
          <see-checkbox label="e">选项 E</see-checkbox>
        </see-checkbox-group>
        <text class="info">最少选1个，最多选3个</text>
        <text class="info">当前选中：{{ limitValues.length }} 个</text>
      </view>

      <text class="title">行内排列</text>
      <view class="content">
        <see-checkbox-group v-model="inlineValues" is-inline>
          <see-checkbox label="a">选项 A</see-checkbox>
          <see-checkbox label="b">选项 B</see-checkbox>
          <see-checkbox label="c">选项 C</see-checkbox>
          <see-checkbox label="d">选项 D</see-checkbox>
        </see-checkbox-group>
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-checkbox v-model="sizeChecked" size="small">小型</see-checkbox>
        <see-checkbox v-model="sizeChecked" size="default">默认</see-checkbox>
        <see-checkbox v-model="sizeChecked" size="large">大型</see-checkbox>
      </view>

      <text class="title">带边框</text>
      <view class="content">
        <see-checkbox-group v-model="borderValues" is-border>
          <see-checkbox label="a">选项 A</see-checkbox>
          <see-checkbox label="b">选项 B</see-checkbox>
          <see-checkbox label="c">选项 C</see-checkbox>
        </see-checkbox-group>
      </view>

      <text class="title">带边框（行内）</text>
      <view class="content">
        <see-checkbox-group v-model="borderInlineValues" is-border is-inline>
          <see-checkbox label="a">选项 A</see-checkbox>
          <see-checkbox label="b">选项 B</see-checkbox>
          <see-checkbox label="c">选项 C</see-checkbox>
        </see-checkbox-group>
      </view>

      <text class="title">自定义颜色</text>
      <view class="content">
        <see-checkbox v-model="colorChecked1" checked-color="#e43d33">红色</see-checkbox>
        <see-checkbox v-model="colorChecked2" checked-color="#19be6b">绿色</see-checkbox>
        <see-checkbox v-model="colorChecked3" checked-color="#ff9900">橙色</see-checkbox>
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-checkbox v-model="disabledChecked1" is-disabled>禁用未选</see-checkbox>
        <see-checkbox v-model="disabledChecked2" is-disabled>禁用已选</see-checkbox>
      </view>

      <text class="title">整组禁用</text>
      <view class="content">
        <see-checkbox-group v-model="disabledGroupValues" is-disabled>
          <see-checkbox label="a">选项 A</see-checkbox>
          <see-checkbox label="b">选项 B</see-checkbox>
          <see-checkbox label="c">选项 C</see-checkbox>
        </see-checkbox-group>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

// 基础用法
const basicChecked = ref(false)

// Group 用法
const groupValues = ref<string[]>(['apple'])

// 全选/半选
const fruitOptions = ['apple', 'banana', 'orange']
const fruitValues = ref<string[]>(['apple'])

const isAllChecked = computed(() => {
  return fruitOptions.every((item) => fruitValues.value.includes(item))
})

const isIndeterminate = computed(() => {
  const checkedCount = fruitValues.value.length
  return checkedCount > 0 && checkedCount < fruitOptions.length
})

const handleCheckAll = (checked: boolean) => {
  fruitValues.value = checked ? [...fruitOptions] : []
}

// 最少/最多限制
const limitValues = ref<string[]>(['a'])

// 行内排列
const inlineValues = ref<string[]>(['a', 'b'])

// 不同尺寸
const sizeChecked = ref(true)

// 带边框
const borderValues = ref<string[]>(['a'])
const borderInlineValues = ref<string[]>(['a', 'b'])

// 自定义颜色
const colorChecked1 = ref(true)
const colorChecked2 = ref(true)
const colorChecked3 = ref(true)

// 禁用状态
const disabledChecked1 = ref(false)
const disabledChecked2 = ref(true)

// 整组禁用
const disabledGroupValues = ref<string[]>(['a', 'c'])
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    color: #999;
  }
  .content {
    margin-top: 6px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .info {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
