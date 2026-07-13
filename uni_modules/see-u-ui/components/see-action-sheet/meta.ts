import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeActionSheet AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeActionSheet',
  tag: 'see-action-sheet',
  title: '操作菜单',
  titleEn: 'ActionSheet',
  category: '反馈组件',
  description: '从底部弹出的操作菜单，通过 actions 配置选项列表（支持图标、描述、禁用、加载态），v-model 控制显隐，可选带取消按钮',
  docUrl: '/components/action-sheet/',
  examples: [
    {
      title: '基本使用',
      code: '<see-action-sheet v-model:show="show" :actions="actions" @on-select="onSelect" />\n// actions: [{ name: \'选项一\' }, { name: \'选项二\', color: \'#ee0a24\' }]'
    },
    {
      title: '带标题与描述',
      code: '<see-action-sheet v-model:show="show" title="标题" description="这是一段描述文字" :actions="actions" @on-cancel="onCancel" />'
    }
  ]
}

export default meta
