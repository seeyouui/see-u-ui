import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeDatetimePicker AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeDatetimePicker',
  tag: 'see-datetime-picker',
  title: '日期选择器',
  titleEn: 'DatetimePicker',
  category: '表单组件',
  description: '日期时间选择器,滚轮选择,支持 date/time/datetime/year-month/month-day 类型,可限定最小最大日期时间与秒显示',
  docUrl: '/components/datetime-picker/',
  examples: [
    {
      title: '日期选择',
      code: '<see-datetime-picker v-model="value" type="date" @on-confirm="handleConfirm" />'
    },
    {
      title: '日期时间带范围',
      code: '<see-datetime-picker v-model="value" type="datetime" :min-date="minDate" :max-date="maxDate" />'
    }
  ]
}

export default meta
