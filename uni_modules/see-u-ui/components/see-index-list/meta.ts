import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeIndexList AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeIndexList',
  tag: 'see-index-list',
  title: '索引列表',
  titleEn: 'IndexList',
  category: '导航组件',
  description: '索引列表，将数据按索引字段分组展示，支持吸顶分组标题、右侧字母导航、搜索与拼音索引',
  docUrl: '/components/index-list/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-index-list :data="data" @on-select="onSelect" />\n</template>'
    },
    {
      title: '带搜索与拼音索引',
      code: '<template>\n  <see-index-list\n    :data="data"\n    :is-show-search="true"\n    :is-pinyin="true"\n    :is-sticky-header="true"\n    @on-select="onSelect"\n    @on-index-change="onIndexChange"\n  />\n</template>'
    }
  ]
}

export default meta
