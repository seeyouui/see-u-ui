<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('datetimePicker.demo.date') }}</text>
      <view class="content">
        <see-datetime-picker
          v-model="dateValue"
          type="date"
          :placeholder="t('datetimePicker.demo.placeholderDate')"
          :toolbar-title="t('datetimePicker.demo.toolbarDate')"
          @on-confirm="handleDateConfirm"
        />
        <text class="info">{{ t('datetimePicker.demo.selectedValue') }}{{ formatDate(dateValue) }}</text>
      </view>

      <text class="title">{{ t('datetimePicker.demo.time') }}</text>
      <view class="content">
        <see-datetime-picker
          v-model="timeValue"
          type="time"
          :placeholder="t('datetimePicker.demo.placeholderTime')"
          :toolbar-title="t('datetimePicker.demo.toolbarTime')"
          @on-confirm="handleTimeConfirm"
        />
        <text class="info">{{ t('datetimePicker.demo.selectedValue') }}{{ formatDate(timeValue) }}</text>
      </view>

      <text class="title">{{ t('datetimePicker.demo.datetime') }}</text>
      <view class="content">
        <see-datetime-picker
          v-model="datetimeValue"
          type="datetime"
          :placeholder="t('datetimePicker.demo.placeholderDatetime')"
          :toolbar-title="t('datetimePicker.demo.toolbarDatetime')"
          @on-confirm="handleDatetimeConfirm"
        />
        <text class="info">{{ t('datetimePicker.demo.selectedValue') }}{{ formatDate(datetimeValue) }}</text>
      </view>

      <text class="title">{{ t('datetimePicker.demo.yearMonth') }}</text>
      <view class="content">
        <see-datetime-picker
          v-model="yearMonthValue"
          type="year-month"
          :placeholder="t('datetimePicker.demo.placeholderYearMonth')"
          :toolbar-title="t('datetimePicker.demo.toolbarYearMonth')"
        />
        <text class="info">{{ t('datetimePicker.demo.selectedValue') }}{{ formatDate(yearMonthValue) }}</text>
      </view>

      <text class="title">{{ t('datetimePicker.demo.monthDay') }}</text>
      <view class="content">
        <see-datetime-picker
          v-model="monthDayValue"
          type="month-day"
          :placeholder="t('datetimePicker.demo.placeholderMonthDay')"
          :toolbar-title="t('datetimePicker.demo.toolbarMonthDay')"
        />
      </view>

      <text class="title">{{ t('datetimePicker.demo.dateRange') }}</text>
      <view class="content">
        <see-datetime-picker
          v-model="rangeValue"
          type="date"
          :placeholder="t('datetimePicker.demo.placeholderDateRange')"
          :toolbar-title="t('datetimePicker.demo.toolbarDate')"
          min-date="2024-01-01"
          max-date="2026-12-31"
        />
        <text class="info">{{ t('datetimePicker.demo.dateRangeHint') }}</text>
      </view>

      <text class="title">{{ t('datetimePicker.demo.timeRange') }}</text>
      <view class="content">
        <see-datetime-picker
          v-model="timeRangeValue"
          type="time"
          :placeholder="t('datetimePicker.demo.placeholderTimeRange')"
          :toolbar-title="t('datetimePicker.demo.toolbarTime')"
          :min-hour="8"
          :max-hour="18"
        />
        <text class="info">{{ t('datetimePicker.demo.timeRangeHint') }}</text>
      </view>

      <text class="title">{{ t('datetimePicker.demo.showSeconds') }}</text>
      <view class="content">
        <see-datetime-picker
          v-model="secondsValue"
          type="datetime"
          :placeholder="t('datetimePicker.demo.placeholderSeconds')"
          :toolbar-title="t('datetimePicker.demo.toolbarDatetime')"
          is-show-seconds
        />
      </view>

      <text class="title">{{ t('datetimePicker.demo.disabled') }}</text>
      <view class="content">
        <see-datetime-picker :model-value="new Date()" type="date" is-disabled :placeholder="t('datetimePicker.demo.placeholderDisabled')" />
      </view>

      <text class="title">{{ t('datetimePicker.demo.readonly') }}</text>
      <view class="content">
        <see-datetime-picker :model-value="new Date()" type="date" is-readonly :placeholder="t('datetimePicker.demo.placeholderReadonly')" />
      </view>

      <text class="title">{{ t('datetimePicker.demo.customBtnText') }}</text>
      <view class="content">
        <see-datetime-picker
          v-model="customValue"
          type="date"
          :placeholder="t('datetimePicker.demo.placeholderCustom')"
          :toolbar-title="t('datetimePicker.demo.toolbarDate')"
          :confirm-text="t('datetimePicker.demo.confirm')"
          :cancel-text="t('datetimePicker.demo.cancel')"
        />
      </view>

      <text class="title">{{ t('datetimePicker.demo.sizes') }}</text>
      <view class="content">
        <see-datetime-picker v-model="sizeValue1" type="date" size="small" :placeholder="t('datetimePicker.demo.placeholderSmall')" />
        <see-datetime-picker v-model="sizeValue2" type="date" size="default" :placeholder="t('datetimePicker.demo.placeholderDefault')" />
        <see-datetime-picker v-model="sizeValue3" type="date" size="large" :placeholder="t('datetimePicker.demo.placeholderLarge')" />
      </view>

      <text class="title">{{ t('datetimePicker.demo.noBorder') }}</text>
      <view class="content">
        <see-datetime-picker v-model="borderValue" type="date" :is-border="false" :placeholder="t('datetimePicker.demo.placeholderNoBorder')" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeDatetimePicker')

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
  if (!val) return t('datetimePicker.demo.none')
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
