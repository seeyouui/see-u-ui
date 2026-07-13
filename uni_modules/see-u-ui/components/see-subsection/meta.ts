import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSubsection AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSubsection',
  tag: 'see-subsection',
  title: '分段器',
  titleEn: 'Subsection',
  category: '导航组件',
  description: '分段选择器,在若干互斥选项间单选切换,支持 default/button/pill 三种样式、多种尺寸与自定义选中色',
  docUrl: '/components/subsection/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-subsection v-model="active" :options="options" @on-change="onChange" />\n</template>'
    },
    {
      title: 'pill 样式',
      code: '<template>\n  <see-subsection v-model="active" :options="options" type="pill" size="large" @on-change="onChange" />\n</template>'
    }
  ]
}

export default meta
