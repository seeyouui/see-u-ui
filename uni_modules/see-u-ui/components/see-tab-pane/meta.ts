import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeTabPane AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeTabPane',
  tag: 'see-tab-pane',
  title: '标签页',
  titleEn: 'Tabs',
  category: '导航组件',
  description: '标签页面板,作为 see-tabs 的子组件,通过 name 关联标签,支持标题、图标、徽标、红点、禁用与可关闭',
  docUrl: '/components/tabs/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-tabs v-model="activeTab">\n    <see-tab-pane name="tab1" title="标签一">内容一</see-tab-pane>\n    <see-tab-pane name="tab2" title="标签二" :dot="true" :is-disabled="true">内容二</see-tab-pane>\n  </see-tabs>\n</template>'
    }
  ]
}

export default meta
