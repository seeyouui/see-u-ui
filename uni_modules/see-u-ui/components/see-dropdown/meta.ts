import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeDropdown AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeDropdown',
  tag: 'see-dropdown',
  title: '下拉菜单',
  titleEn: 'Dropdown',
  category: '导航组件',
  description: '下拉菜单容器，通过 #menu 插槽放置菜单项、#panels 插槽放置面板，管理面板展开/收起、遮罩与选项变更事件',
  docUrl: '/components/dropdown/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-dropdown @on-change="onChange">\n    <template #menu>\n      <see-dropdown-item name="sort" title="排序" />\n      <see-dropdown-item name="filter" title="筛选" />\n    </template>\n    <template #panels>\n      <see-dropdown-panel name="sort">排序内容</see-dropdown-panel>\n      <see-dropdown-panel name="filter">筛选内容</see-dropdown-panel>\n    </template>\n  </see-dropdown>\n</template>'
    }
  ]
}

export default meta
