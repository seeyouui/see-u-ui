import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeImage AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeImage',
  tag: 'see-image',
  title: '图片',
  titleEn: 'Image',
  category: '基础组件',
  description: '基于 uni-app image 二次封装的图片组件，集成加载动画、错误占位、点击预览、遮罩层与淡入效果',
  docUrl: '/components/image/',
  examples: [
    {
      title: '基本使用',
      code: '<see-image src="https://www.seeuui.cn/logo.png" width="80px" height="80px" :radius="8" />'
    },
    {
      title: '开启预览与错误占位',
      code: '<see-image\n  src="https://www.seeuui.cn/logo.png"\n  width="120px"\n  height="120px"\n  :previewMode="true"\n  :showErrorImage="true"\n  errorImage="/static/error.png"\n  @on-click="onClick"\n/>'
    }
  ]
}

export default meta
