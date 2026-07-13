import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCalendar AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCalendar',
  tag: 'see-calendar',
  title: '日历',
  titleEn: 'Calendar',
  category: '表单组件',
  description: '日历,支持单选/多选/范围三种选择模式,可设最小最大日期、自定义格子文案、月份水印及底部确认按钮',
  docUrl: '/components/calendar/',
  examples: [
    {
      title: '单选日期',
      code: '<see-calendar v-model="date" mode="single" @on-confirm="handleConfirm" />'
    },
    {
      title: '范围选择',
      code: '<see-calendar v-model="range" mode="range" :max-range="7" is-show-confirm />'
    }
  ]
}

export default meta
