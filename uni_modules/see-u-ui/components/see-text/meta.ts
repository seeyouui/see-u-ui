import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeText AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeText',
  tag: 'see-text',
  title: '文本',
  titleEn: 'Text',
  category: '基础组件',
  description: '多功能文本组件，通过 mode 处理普通文本/链接/电话/日期/时间距今/金额，并支持数字滚动与打字机效果',
  docUrl: '/components/text/',
  examples: [
    {
      title: '基本使用',
      code: '<see-text text="我的愿望是世界上没有加班" type="primary"></see-text>'
    },
    {
      title: '金额与数字滚动',
      code: '<see-text :text="1299.99" mode="price" :isCountUp="true"></see-text>\n<see-text text="13800138000" mode="phone" type="primary"></see-text>'
    }
  ]
}

export default meta
