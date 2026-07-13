import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeTable AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeTable',
  tag: 'see-table',
  title: '表格',
  titleEn: 'Table',
  category: '数据组件',
  description: '功能完整的表格组件，支持列配置、边框斑马纹、固定表头/列、排序、多选、行展开、树形数据、分页与虚拟滚动',
  docUrl: '/components/table/',
  examples: [
    {
      title: '基本使用',
      code: '<see-table :columns="columns" :data="data" rowKey="id" :border="true" :stripe="true" />'
    },
    {
      title: '可选择与排序',
      code: '<see-table\n  :columns="columns"\n  :data="data"\n  rowKey="id"\n  :selectable="true"\n  :sortable="true"\n  @on-selection-change="onSelectionChange"\n  @on-sort-change="onSortChange"\n  @on-row-click="onRowClick"\n/>'
    }
  ]
}

export default meta
