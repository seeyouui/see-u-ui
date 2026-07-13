import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeTabbar AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeTabbar',
  tag: 'see-tabbar',
  title: '底部导航栏',
  titleEn: 'Tabbar',
  category: '导航组件',
  description: '底部导航栏,通过 tabs 数组配置标签,支持徽标/红点、中央凸起按钮、毛玻璃、路由模式与底部安全区适配',
  docUrl: '/components/tabbar/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-tabbar v-model="activeTab" :tabs="tabs" @on-change="onChange" />\n</template>'
    },
    {
      title: '带中央按钮',
      code: '<template>\n  <see-tabbar\n    v-model="activeTab"\n    :tabs="tabs"\n    :is-frosted="true"\n    @on-change="onChange"\n    @on-center-click="onCenterClick"\n  />\n</template>'
    }
  ]
}

export default meta
