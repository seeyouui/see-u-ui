import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSelect AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSelect',
  tag: 'see-select',
  title: '经典下拉框',
  titleEn: 'Select',
  category: '表单组件',
  description: '下拉选择器,支持单选/多选、搜索过滤、远程搜索、分组、清除及标签数限制,options 用 label/value 结构',
  docUrl: '/components/select/',
  examples: [
    {
      title: '基本使用',
      code: '<see-select v-model="value" :options="options" placeholder="请选择" @on-change="handleChange" />'
    },
    {
      title: '多选可搜索',
      code: '<see-select v-model="list" :options="options" is-multiple is-filterable is-clearable />'
    }
  ]
}

export default meta
