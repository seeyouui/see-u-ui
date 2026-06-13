<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('checkbox.demo.basic') }}</text>
      <view class="content">
        <see-checkbox v-model="basicChecked">{{ t('checkbox.demo.option1') }}</see-checkbox>
        <text class="info">{{ t('checkbox.demo.currentStatus') }}{{ basicChecked ? t('checkbox.demo.checked') : t('checkbox.demo.unchecked') }}</text>
      </view>

      <text class="title">{{ t('checkbox.demo.group') }}</text>
      <view class="content">
        <see-checkbox-group v-model="groupValues">
          <see-checkbox label="apple">{{ t('checkbox.demo.apple') }}</see-checkbox>
          <see-checkbox label="banana">{{ t('checkbox.demo.banana') }}</see-checkbox>
          <see-checkbox label="orange">{{ t('checkbox.demo.orange') }}</see-checkbox>
          <see-checkbox label="grape">{{ t('checkbox.demo.grape') }}</see-checkbox>
        </see-checkbox-group>
        <text class="info">{{ t('checkbox.demo.selectedValues') }}{{ groupValues.join(', ') || t('checkbox.demo.none') }}</text>
      </view>

      <text class="title">{{ t('checkbox.demo.checkAll') }}</text>
      <view class="content">
        <see-checkbox :model-value="isAllChecked" :is-indeterminate="isIndeterminate" @on-change="handleCheckAll">
          {{ t('checkbox.demo.checkAllText') }}
        </see-checkbox>
        <view style="height: 8px" />
        <see-checkbox-group v-model="fruitValues">
          <see-checkbox label="apple">{{ t('checkbox.demo.apple') }}</see-checkbox>
          <see-checkbox label="banana">{{ t('checkbox.demo.banana') }}</see-checkbox>
          <see-checkbox label="orange">{{ t('checkbox.demo.orange') }}</see-checkbox>
        </see-checkbox-group>
      </view>

      <text class="title">{{ t('checkbox.demo.limit') }}</text>
      <view class="content">
        <see-checkbox-group v-model="limitValues" :min="1" :max="3">
          <see-checkbox label="a">{{ t('checkbox.demo.optionA') }}</see-checkbox>
          <see-checkbox label="b">{{ t('checkbox.demo.optionB') }}</see-checkbox>
          <see-checkbox label="c">{{ t('checkbox.demo.optionC') }}</see-checkbox>
          <see-checkbox label="d">{{ t('checkbox.demo.optionD') }}</see-checkbox>
          <see-checkbox label="e">{{ t('checkbox.demo.optionE') }}</see-checkbox>
        </see-checkbox-group>
        <text class="info">{{ t('checkbox.demo.limitHint') }}</text>
        <text class="info">{{ t('checkbox.demo.selectedCount') }}{{ limitValues.length }}{{ t('checkbox.demo.countUnit') }}</text>
      </view>

      <text class="title">{{ t('checkbox.demo.inline') }}</text>
      <view class="content">
        <see-checkbox-group v-model="inlineValues" is-inline>
          <see-checkbox label="a">{{ t('checkbox.demo.optionA') }}</see-checkbox>
          <see-checkbox label="b">{{ t('checkbox.demo.optionB') }}</see-checkbox>
          <see-checkbox label="c">{{ t('checkbox.demo.optionC') }}</see-checkbox>
          <see-checkbox label="d">{{ t('checkbox.demo.optionD') }}</see-checkbox>
        </see-checkbox-group>
      </view>

      <text class="title">{{ t('checkbox.demo.sizes') }}</text>
      <view class="content">
        <see-checkbox v-model="sizeChecked" size="small">{{ t('checkbox.demo.small') }}</see-checkbox>
        <see-checkbox v-model="sizeChecked" size="default">{{ t('checkbox.demo.default') }}</see-checkbox>
        <see-checkbox v-model="sizeChecked" size="large">{{ t('checkbox.demo.large') }}</see-checkbox>
      </view>

      <text class="title">{{ t('checkbox.demo.border') }}</text>
      <view class="content">
        <see-checkbox-group v-model="borderValues" is-border>
          <see-checkbox label="a">{{ t('checkbox.demo.optionA') }}</see-checkbox>
          <see-checkbox label="b">{{ t('checkbox.demo.optionB') }}</see-checkbox>
          <see-checkbox label="c">{{ t('checkbox.demo.optionC') }}</see-checkbox>
        </see-checkbox-group>
      </view>

      <text class="title">{{ t('checkbox.demo.borderInline') }}</text>
      <view class="content">
        <see-checkbox-group v-model="borderInlineValues" is-border is-inline>
          <see-checkbox label="a">{{ t('checkbox.demo.optionA') }}</see-checkbox>
          <see-checkbox label="b">{{ t('checkbox.demo.optionB') }}</see-checkbox>
          <see-checkbox label="c">{{ t('checkbox.demo.optionC') }}</see-checkbox>
        </see-checkbox-group>
      </view>

      <text class="title">{{ t('checkbox.demo.customColor') }}</text>
      <view class="content">
        <see-checkbox v-model="colorChecked1" checked-color="#e43d33">{{ t('checkbox.demo.red') }}</see-checkbox>
        <see-checkbox v-model="colorChecked2" checked-color="#19be6b">{{ t('checkbox.demo.green') }}</see-checkbox>
        <see-checkbox v-model="colorChecked3" checked-color="#ff9900">{{ t('checkbox.demo.orangeColor') }}</see-checkbox>
      </view>

      <text class="title">{{ t('checkbox.demo.disabled') }}</text>
      <view class="content">
        <see-checkbox v-model="disabledChecked1" is-disabled>{{ t('checkbox.demo.disabledUnchecked') }}</see-checkbox>
        <see-checkbox v-model="disabledChecked2" is-disabled>{{ t('checkbox.demo.disabledChecked') }}</see-checkbox>
      </view>

      <text class="title">{{ t('checkbox.demo.groupDisabled') }}</text>
      <view class="content">
        <see-checkbox-group v-model="disabledGroupValues" is-disabled>
          <see-checkbox label="a">{{ t('checkbox.demo.optionA') }}</see-checkbox>
          <see-checkbox label="b">{{ t('checkbox.demo.optionB') }}</see-checkbox>
          <see-checkbox label="c">{{ t('checkbox.demo.optionC') }}</see-checkbox>
        </see-checkbox-group>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeCheckbox')

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
    margin-top: 12px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.info {
  font-size: 12px;
  color: #999;
}
</style>
