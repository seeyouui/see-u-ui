/**
 * SeeUpload 组件类型定义
 * @description 上传组件的类型声明
 */

/** 上传文件项 */
export interface UploadFileItem {
  /** 文件 URL */
  url: string
  /** 文件名 */
  name?: string
  /** 文件大小（字节） */
  size?: number
  /** 文件类型 */
  type?: string
  /** 上传状态 */
  status?: 'uploading' | 'done' | 'error'
  /** 状态信息（如错误提示） */
  message?: string
  /** 视频缩略图 */
  thumb?: string
  /** 原始文件对象（H5） */
  file?: File
  /** 小程序临时路径 */
  tempFilePath?: string
  /** 上传进度 0-100 */
  progress?: number
}

/** 接受的文件类型 */
export type UploadAccept = 'image' | 'video' | 'file' | 'media'

/** 上传尺寸 */
export type UploadSize = 'small' | 'default' | 'large'

/** 图片压缩类型 */
export type ImageSizeType = 'original' | 'compressed'

/** 图片来源 */
export type ImageSourceType = 'album' | 'camera'

/** SeeUpload Props */
export interface SeeUploadProps {
  /** 文件列表（v-model） */
  modelValue?: UploadFileItem[]
  /** 接受的文件类型 */
  accept?: UploadAccept
  /** 是否支持多选 */
  isMultiple?: boolean
  /** 最大文件数量 */
  maxCount?: number
  /** 单个文件大小限制，单位 MB */
  maxSize?: number
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否显示删除按钮 */
  isDeletable?: boolean
  /** 是否支持预览 */
  isPreview?: boolean
  /** 是否压缩图片 */
  isCompress?: boolean
  /** 压缩质量 0-100 */
  compressQuality?: number
  /** 是否直接调用摄像头 */
  isCapture?: boolean
  /** 是否使用前置摄像头 */
  isCamera?: boolean
  /** 图片压缩类型 */
  sizeType?: ImageSizeType[]
  /** 图片来源 */
  sourceType?: ImageSourceType[]
  /** 自定义上传函数 */
  upload?: (file: UploadFileItem) => Promise<string>
  /** 上传前校验 */
  beforeRead?: (file: UploadFileItem) => boolean | Promise<boolean>
  /** 上传后回调 */
  afterRead?: (file: UploadFileItem) => void
  /** 是否支持图片预览 */
  isPreviewImage?: boolean
  /** 表单字段名 */
  name?: string
  /** 尺寸 */
  size?: UploadSize
  /** 上传按钮文字 */
  uploadText?: string
  /** 上传图标 */
  uploadIcon?: string
}

/** SeeUpload Events */
export interface SeeUploadEmits {
  /** 文件列表变化时触发 */
  onChange: (fileList: UploadFileItem[]) => void
  /** 文件超出大小限制时触发 */
  onOversize: (file: UploadFileItem) => void
  /** 删除文件时触发 */
  onDelete: (file: UploadFileItem) => void
  /** 预览文件时触发 */
  onPreview: (file: UploadFileItem) => void
  /** 点击上传区域时触发 */
  onClickUpload: () => void
  /** 上传失败时触发 */
  onError: (error: Error) => void
  /** v-model 更新 */
  'update:modelValue': (fileList: UploadFileItem[]) => void
}

/** Form 注入的上下文类型 */
export interface FormContext {
  /** 表单禁用状态 */
  isDisabled?: boolean
  /** 表单只读状态 */
  isReadonly?: boolean
  /** 表单尺寸 */
  size?: UploadSize
}
