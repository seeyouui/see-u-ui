import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSearch AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSearch',
  tag: 'see-search',
  title: '搜索',
  titleEn: 'Search',
  category: '表单组件',
  description: '搜索框，支持占位提示、清除按钮、右侧操作按钮、round/square 形状及尺寸，键盘确认触发搜索',
  docUrl: '/components/search/',
  examples: [
    {
      title: '基本使用',
      code: '<see-search v-model="value" placeholder="请输入搜索内容" @on-search="handleSearch" />'
    },
    {
      title: '带操作按钮',
      code: '<see-search v-model="value" is-show-action action-text="搜索" @on-cancel="handleCancel" />'
    }
  ]
}

export default meta
