import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeDropdownItem AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeDropdownItem',
  tag: 'see-dropdown-item',
  title: '下拉菜单',
  titleEn: 'Dropdown',
  category: '导航组件',
  description: '下拉菜单项，作为 see-dropdown 的 #menu 子组件，通过 name 与面板关联，显示标题与展开箭头，支持禁用',
  docUrl: '/components/dropdown/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-dropdown>\n    <template #menu>\n      <see-dropdown-item name="sort" title="排序" />\n      <see-dropdown-item name="filter" title="筛选" :is-disabled="true" />\n    </template>\n  </see-dropdown>\n</template>'
    }
  ]
}

export default meta
