import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCell AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCell',
  tag: 'see-cell',
  title: '单元格',
  titleEn: 'Cell',
  category: '布局组件',
  description: '列表单元格组件，支持图标、标题、描述、右侧值、箭头，可设必填星号、跳转链接及点击反馈。',
  docUrl: '/components/cell/',
  examples: [
    {
      title: '基本使用',
      code: '<see-cell title="标题" value="内容" />\n<see-cell title="标题" label="描述文字" value="带箭头" is-link />'
    },
    {
      title: '带图标与跳转',
      code: '<see-cell title="设置" icon="⚙" is-required to="/pages/setting/index" @on-click="handleClick" />'
    }
  ]
}

export default meta
