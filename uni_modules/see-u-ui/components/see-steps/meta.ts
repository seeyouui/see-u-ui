import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSteps AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSteps',
  tag: 'see-steps',
  title: '步骤条',
  titleEn: 'Steps',
  category: '导航组件',
  description: '步骤条，展示流程进度，支持横向/纵向、圆点样式、步骤状态(等待/进行/完成/错误)与点击跳转',
  docUrl: '/components/steps/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-steps v-model="current" :steps="steps" @on-change="onChange" />\n</template>'
    },
    {
      title: '纵向可点击',
      code: '<template>\n  <see-steps\n    v-model="current"\n    :steps="steps"\n    direction="vertical"\n    :is-clickable="true"\n    @on-change="onChange"\n  />\n</template>'
    }
  ]
}

export default meta
