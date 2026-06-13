<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('calendar.demo.single') }}</text>
      <view class="content">
        <see-calendar v-model="singleValue" :months-count="1" @on-confirm="onSingleConfirm" />
        <text class="info">{{ t('calendar.demo.selected') }}{{ formatDate(singleValue) }}</text>
      </view>

      <text class="title">{{ t('calendar.demo.singleQuick') }}</text>
      <view class="content">
        <see-calendar v-model="quickValue" mode="single" :months-count="1" :is-show-confirm="false" />
        <text class="info">{{ t('calendar.demo.selected') }}{{ formatDate(quickValue) }}</text>
      </view>

      <text class="title">{{ t('calendar.demo.multiple') }}</text>
      <view class="content">
        <see-calendar v-model="multipleValue" mode="multiple" :title="t('calendar.demo.titleMultiple')" :months-count="1" :is-show-confirm="false" />
        <text class="info">
          {{ t('calendar.demo.selectedDays') }}{{ Array.isArray(multipleValue) ? multipleValue.length : 0 }}{{ t('calendar.demo.dayUnit') }}：{{
            formatDateArray(multipleValue)
          }}
        </text>
      </view>

      <text class="title">{{ t('calendar.demo.range') }}</text>
      <view class="content">
        <see-calendar
          v-model="rangeValue"
          mode="range"
          :title="t('calendar.demo.titleRange')"
          :subtitle="t('calendar.demo.subtitleRange')"
          :months-count="2"
          @on-confirm="onRangeConfirm"
        />
        <text class="info">{{ formatRange(rangeValue) }}</text>
      </view>

      <text class="title">{{ t('calendar.demo.rangeMax7') }}</text>
      <view class="content">
        <see-calendar
          v-model="maxRangeValue"
          mode="range"
          :title="t('calendar.demo.titleMax7')"
          :max-range="7"
          :months-count="2"
          @on-over-range="onOverRange"
        />
        <text class="info">{{ formatRange(maxRangeValue) }}</text>
      </view>

      <text class="title">{{ t('calendar.demo.minMaxDate') }}</text>
      <view class="content">
        <see-calendar v-model="minMaxValue" :min-date="minDate" :max-date="maxDate" :months-count="1" :is-show-confirm="false" />
        <text class="info">{{ t('calendar.demo.rangeHint') }}{{ formatYmd(minDate) }} ~ {{ formatYmd(maxDate) }}</text>
      </view>

      <text class="title">{{ t('calendar.demo.mondayFirst') }}</text>
      <view class="content">
        <see-calendar v-model="mondayValue" :first-day-of-week="1" :months-count="1" :is-show-confirm="false" />
      </view>

      <text class="title">{{ t('calendar.demo.formatter') }}</text>
      <view class="content">
        <see-calendar v-model="formatterValue" :formatter="dayFormatter" :months-count="1" :is-show-confirm="false" />
        <text class="info">{{ t('calendar.demo.formatterHint') }}</text>
      </view>

      <text class="title">{{ t('calendar.demo.readonly') }}</text>
      <view class="content">
        <see-calendar :model-value="readonlyValue" is-readonly :months-count="1" />
      </view>

      <text class="title">{{ t('calendar.demo.hideTitleMark') }}</text>
      <view class="content">
        <see-calendar v-model="cleanValue" :is-show-title="false" :is-show-mark="false" :months-count="1" :is-show-confirm="false" />
      </view>

      <text class="title">{{ t('calendar.demo.customText') }}</text>
      <view class="content">
        <see-calendar
          v-model="customTextValue"
          mode="range"
          :title="t('calendar.demo.titleLeave')"
          :subtitle="t('calendar.demo.subtitleLeave')"
          :confirm-text="t('calendar.demo.confirmLeave')"
          :confirm-disabled-text="t('calendar.demo.confirmDisabledText')"
          :months-count="2"
        />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import type { CalendarDay } from '@/uni_modules/see-u-ui/components/see-calendar/type'

const { t } = useI18n()
useNavbarI18n('navbar.seeCalendar')

const today = new Date()
const buildDate = (offsetDay: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + offsetDay)
  return d
}

const singleValue = ref<Date | ''>('')
const quickValue = ref<Date | ''>('')
const multipleValue = ref<Date[]>([])
const rangeValue = ref<Date[]>([])
const maxRangeValue = ref<Date[]>([])
const minMaxValue = ref<Date | ''>('')
const mondayValue = ref<Date | ''>('')
const formatterValue = ref<Date | ''>('')
const readonlyValue = ref<Date>(buildDate(0))
const cleanValue = ref<Date | ''>('')
const customTextValue = ref<Date[]>([])

const minDate = buildDate(-5)
const maxDate = buildDate(15)

const formatYmd = (val: Date | string | number | '') => {
  if (!val) return t('calendar.demo.none')
  const d = val instanceof Date ? val : new Date(val)
  if (isNaN(d.getTime())) return t('calendar.demo.none')
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const formatDate = (val: Date | '' | Date[]) => {
  if (Array.isArray(val)) return formatDateArray(val)
  return formatYmd(val)
}

const formatDateArray = (arr: Date[]) => {
  if (!arr || arr.length === 0) return t('calendar.demo.none')
  return arr.map(formatYmd).join('，')
}

const formatRange = (arr: Date[]) => {
  if (!arr || arr.length === 0) return t('calendar.demo.unselected')
  if (arr.length === 1) return `${formatYmd(arr[0])}${t('calendar.demo.waitingEnd')}`
  return `${formatYmd(arr[0])} → ${formatYmd(arr[1])}`
}

const onSingleConfirm = (val: Date | Date[]) => {
  uni.showToast({ title: `${t('calendar.demo.confirmed')}${formatDate(val as Date)}`, icon: 'none' })
}

const onRangeConfirm = (val: Date | Date[]) => {
  uni.showToast({ title: t('calendar.demo.rangeConfirmed'), icon: 'none' })
  console.log('range confirm', val)
}

const onOverRange = () => {
  uni.showToast({ title: t('calendar.demo.exceedMaxRange'), icon: 'none' })
}

const dayFormatter = (day: CalendarDay): CalendarDay => {
  if (!day.date) return day
  const d = day.date
  const dom = d.getDate()
  const dow = d.getDay()
  if (dom === 1) {
    day.topInfo = t('calendar.demo.topInfoFirst')
  } else if (dom === 15) {
    day.topInfo = t('calendar.demo.topInfoFifteenth')
  }
  if (dow === 0 || dow === 6) {
    day.bottomInfo = t('calendar.demo.bottomInfoRest')
  }
  return day
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
