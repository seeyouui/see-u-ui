import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeDropdownPanel AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeDropdownPanel',
  tag: 'see-dropdown-panel',
  title: '下拉菜单',
  titleEn: 'Dropdown',
  category: '导航组件',
  description: '下拉菜单面板，作为 see-dropdown 的 #panels 子组件，通过 name 与菜单项关联,对应项激活时展示插槽内容',
  docUrl: '/components/dropdown/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-dropdown>\n    <template #panels>\n      <see-dropdown-panel name="sort">\n        <view>排序面板内容</view>\n      </see-dropdown-panel>\n    </template>\n  </see-dropdown>\n</template>'
    }
  ]
}

export default meta
