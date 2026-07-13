import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeLineProgress AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeLineProgress',
  tag: 'see-line-progress',
  title: '线形进度条',
  titleEn: 'LineProgress',
  category: '数据组件',
  description: '线形进度条组件，用于任务/上传/步骤进度展示，支持 normal/success/warning/error 状态、条纹动画、内外文本与圆角',
  docUrl: '/components/line-progress/',
  examples: [
    {
      title: '基本使用',
      code: '<see-line-progress :percentage="50" />'
    },
    {
      title: '状态与条纹动画',
      code: '<see-line-progress :percentage="80" status="success" :striped="true" :animated="true" :textInside="true" @on-complete="onComplete" />'
    }
  ]
}

export default meta
