import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeButton AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeButton',
  tag: 'see-button',
  title: '按钮',
  titleEn: 'Button',
  category: '基础组件',
  description: '基于 uni-app button 二次封装，支持 5 种预置类型、4 种尺寸、镂空、水波纹与自定义颜色。',
  docUrl: '/components/button/',
  examples: [
    {
      title: '基本使用',
      code: '<see-button title="默认按钮" />'
    },
    {
      title: '类型与点击事件',
      code: '<see-button title="主要按钮" type="primary" @click="onClick" />'
    },
    {
      title: '镂空 / 禁用',
      code: '<see-button title="镂空" type="primary" isHollow />\n<see-button title="禁用" type="primary" isDisabled />'
    }
  ],
  related: ['see-icon']
}

export default meta
