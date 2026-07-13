import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeTree AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeTree',
  tag: 'see-tree',
  title: '树形组件',
  titleEn: 'Tree',
  category: '导航组件',
  description: '树形控件,展示层级数据,支持单选/多选/级联勾选、手风琴、连接线、搜索过滤、懒加载与虚拟滚动',
  docUrl: '/components/tree/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-tree :data="data" @on-node-click="onNodeClick" />\n</template>'
    },
    {
      title: '可勾选级联',
      code: '<template>\n  <see-tree\n    v-model="checkedKeys"\n    :data="data"\n    :is-checkable="true"\n    select-mode="check-cascade"\n    :is-filterable="true"\n    @on-check-change="onCheckChange"\n  />\n</template>'
    }
  ]
}

export default meta
