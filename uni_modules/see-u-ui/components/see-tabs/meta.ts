import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeTabs AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeTabs',
  tag: 'see-tabs',
  title: '标签页',
  titleEn: 'Tabs',
  category: '导航组件',
  description: '标签页容器,内嵌 see-tab-pane 子组件,支持 line/card/button 样式、滑动切换、吸顶、滚动标签栏、懒加载与徽标',
  docUrl: '/components/tabs/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-tabs v-model="activeTab" @on-change="onChange">\n    <see-tab-pane name="tab1" title="标签一">内容一</see-tab-pane>\n    <see-tab-pane name="tab2" title="标签二">内容二</see-tab-pane>\n  </see-tabs>\n</template>'
    },
    {
      title: '卡片式可滑动',
      code: '<template>\n  <see-tabs v-model="activeTab" type="card" :is-swipeable="true" :is-sticky="true">\n    <see-tab-pane name="a" title="推荐">推荐内容</see-tab-pane>\n    <see-tab-pane name="b" title="关注" :badge="5">关注内容</see-tab-pane>\n  </see-tabs>\n</template>'
    }
  ]
}

export default meta
