import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeePicker AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeePicker',
  tag: 'see-picker',
  title: '选择器',
  titleEn: 'Picker',
  category: '表单组件',
  description: '滚轮选择器,支持单列、多列及联动三种模式,通过 columns 传选项,可自定义键名、toolbar 与可见项数',
  docUrl: '/components/picker/',
  examples: [
    {
      title: '单列选择',
      code: '<see-picker v-model="value" :columns="columns" @on-confirm="handleConfirm" />'
    },
    {
      title: '联动选择',
      code: '<see-picker v-model="value" :columns="columns" is-cascade />'
    }
  ]
}

export default meta
