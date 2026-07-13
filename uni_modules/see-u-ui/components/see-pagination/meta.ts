import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeePagination AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeePagination',
  tag: 'see-pagination',
  title: '分页器',
  titleEn: 'Pagination',
  category: '导航组件',
  description: '分页器，支持 button/simple/number 三种模式，可显示总数、每页条数选择器,v-model 绑定当前页',
  docUrl: '/components/pagination/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-pagination v-model="page" :total="200" :page-size="10" @on-change="onChange" />\n</template>'
    },
    {
      title: 'number 模式带总数',
      code: '<template>\n  <see-pagination\n    v-model="page"\n    :total="200"\n    :page-size="10"\n    mode="number"\n    :is-show-total="true"\n    @on-change="onChange"\n  />\n</template>'
    }
  ]
}

export default meta
