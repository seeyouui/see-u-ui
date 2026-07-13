import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCountTo AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCountTo',
  tag: 'see-count-to',
  title: '数字滚动',
  titleEn: 'CountTo',
  category: '数据组件',
  description: '数字滚动组件，用于统计卡片、金额变化与数据大屏，支持起止值、缓动动画、小数位、千分位分隔与前后缀',
  docUrl: '/components/count-to/',
  examples: [
    {
      title: '基本使用',
      code: '<see-count-to :startVal="0" :endVal="2024" />'
    },
    {
      title: '金额格式与前后缀',
      code: '<see-count-to :startVal="0" :endVal="88888.88" :decimals="2" separator="," prefix="￥" :duration="3000" @on-finish="onFinish" />'
    }
  ]
}

export default meta
