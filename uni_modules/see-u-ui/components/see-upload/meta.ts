import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeUpload AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeUpload',
  tag: 'see-upload',
  title: '上传',
  titleEn: 'Upload',
  category: '表单组件',
  description: '文件上传,v-model 绑定文件列表,支持图片/视频/文件类型、多选、数量与大小限制、预览、删除、压缩及自定义上传函数',
  docUrl: '/components/upload/',
  examples: [
    {
      title: '基本使用',
      code: '<see-upload v-model="fileList" accept="image" :max-count="9" @on-change="handleChange" />'
    },
    {
      title: '自定义上传',
      code: '<see-upload v-model="fileList" :max-size="5" :upload="customUpload" @on-oversize="handleOversize" />'
    }
  ]
}

export default meta
