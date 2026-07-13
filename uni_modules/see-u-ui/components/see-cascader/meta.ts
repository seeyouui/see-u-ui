import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCascader AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCascader',
  tag: 'see-cascader',
  title: '级联选择器',
  titleEn: 'Cascader',
  category: '表单组件',
  description: '级联选择器,逐级选择有层级关系的选项,v-model 绑定值路径数组,支持懒加载、自定义键名、toolbar 与标签页切换',
  docUrl: '/components/cascader/',
  examples: [
    {
      title: '基本使用',
      code: '<see-cascader v-model="value" :options="options" @on-confirm="handleConfirm" />'
    },
    {
      title: '懒加载子选项',
      code: '<see-cascader v-model="value" :options="options" is-lazy :lazy-load="loadChildren" />'
    }
  ]
}

export default meta
