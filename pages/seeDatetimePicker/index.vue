<template>
  <see-config>
    <view class="container">
      <text class="title">日期选择</text>
      <view class="content">
        <see-datetime-picker v-model="dateValue" type="date" placeholder="请选择日期" toolbar-title="选择日期" @on-confirm="handleDateConfirm" />
        <text class="info">选中值：{{ formatDate(dateValue) }}</text>
      </view>

      <text class="title">时间选择</text>
      <view class="content">
        <see-datetime-picker v-model="timeValue" type="time" placeholder="请选择时间" toolbar-title="选择时间" @on-confirm="handleTimeConfirm" />
        <text class="info">选中值：{{ formatDate(timeValue) }}</text>
      </view>

      <text class="title">日期时间选择</text>
      <view class="content">
        <see-datetime-picker
          v-model="datetimeValue"
          type="datetime"
          placeholder="请选择日期和时间"
          toolbar-title="选择日期时间"
          @on-confirm="handleDatetimeConfirm"
        />
        <text class="info">选中值：{{ formatDate(datetimeValue) }}</text>
      </view>

      <text class="title">年月选择</text>
      <view class="content">
        <see-datetime-picker v-model="yearMonthValue" type="year-month" placeholder="请选择年月" toolbar-title="选择年月" />
        <text class="info">选中值：{{ formatDate(yearMonthValue) }}</text>
      </view>

      <text class="title">月日选择</text>
      <view class="content">
        <see-datetime-picker v-model="monthDayValue" type="month-day" placeholder="请选择月日" toolbar-title="选择月日" />
      </view>

      <text class="title">日期范围限制</text>
      <view class="content">
        <see-datetime-picker
          v-model="rangeValue"
          type="date"
          placeholder="2024-2026年"
          toolbar-title="选择日期"
          min-date="2024-01-01"
          max-date="2026-12-31"
        />
        <text class="info">限制范围：2024-01-01 ~ 2026-12-31</text>
      </view>

      <text class="title">时间范围限制</text>
      <view class="content">
        <see-datetime-picker v-model="timeRangeValue" type="time" placeholder="8:00-18:00" toolbar-title="选择时间" :min-hour="8" :max-hour="18" />
        <text class="info">限制范围：08:00 ~ 18:00</text>
      </view>

      <text class="title">显示秒</text>
      <view class="content">
        <see-datetime-picker v-model="secondsValue" type="datetime" placeholder="精确到秒" toolbar-title="选择日期时间" is-show-seconds />
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-datetime-picker :model-value="new Date()" type="date" is-disabled placeholder="禁用状态" />
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-datetime-picker :model-value="new Date()" type="date" is-readonly placeholder="只读状态" />
      </view>

      <text class="title">自定义按钮文字</text>
      <view class="content">
        <see-datetime-picker
          v-model="customValue"
          type="date"
          placeholder="自定义按钮"
          toolbar-title="请选择日期"
          confirm-text="确定"
          cancel-text="返回"
        />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-datetime-picker v-model="sizeValue1" type="date" size="small" placeholder="小尺寸" />
        <see-datetime-picker v-model="sizeValue2" type="date" size="default" placeholder="默认尺寸" />
        <see-datetime-picker v-model="sizeValue3" type="date" size="large" placeholder="大尺寸" />
      </view>

      <text class="title">无边框</text>
      <view class="content">
        <see-datetime-picker v-model="borderValue" type="date" :is-border="false" placeholder="无边框样式" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const dateValue = ref<Date | string | number>('')
const timeValue = ref<Date | string | number>('')
const datetimeValue = ref<Date | string | number>('')
const yearMonthValue = ref<Date | string | number>('')
const monthDayValue = ref<Date | string | number>('')
const rangeValue = ref<Date | string | number>('')
const timeRangeValue = ref<Date | string | number>('')
const secondsValue = ref<Date | string | number>('')
const customValue = ref<Date | string | number>('')
const sizeValue1 = ref<Date | string | number>('')
const sizeValue2 = ref<Date | string | number>('')
const sizeValue3 = ref<Date | string | number>('')
const borderValue = ref<Date | string | number>('')

const formatDate = (val: Date | string | number) => {
  if (!val) return '无'
  if (val instanceof Date) return val.toLocaleString()
  return String(val)
}

const handleDateConfirm = (value: Date) => {
  console.log('日期确认：', value)
}

const handleTimeConfirm = (value: Date) => {
  console.log('时间确认：', value)
}

const handleDatetimeConfirm = (value: Date) => {
  console.log('日期时间确认：', value)
}
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
  padding: 8px 12px;
  border-radius: 6px;
}
</style>
