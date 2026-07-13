import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeEmpty AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeEmpty',
  tag: 'see-empty',
  title: '空状态',
  titleEn: 'Empty',
  category: '导航组件',
  description: '空状态占位，内置默认/搜索/网络/错误/404 多种预设图标与文案，支持自定义图片、标题、描述及操作按钮',
  docUrl: '/components/empty/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-empty type="search" />\n</template>'
    },
    {
      title: '带操作按钮',
      code: '<template>\n  <see-empty\n    type="network"\n    title="网络异常"\n    description="请检查网络后重试"\n    action-text="重新加载"\n    :is-show-action="true"\n    @on-action="reload"\n  />\n</template>'
    }
  ]
}

export default meta
