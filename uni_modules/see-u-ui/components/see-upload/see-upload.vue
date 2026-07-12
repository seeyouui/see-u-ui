<template>
  <view class="see-upload" :class="uploadClasses">
    <!-- 文件列表 -->
    <view v-for="(file, index) in fileList" :key="getFileKey(file, index)" class="see-upload__item" :class="itemClasses" :style="itemStyle">
      <!-- 预览插槽 -->
      <slot name="preview" :file="file" :index="index">
        <!-- 图片预览 -->
        <view v-if="isImageFile(file)" class="see-upload__preview" @click="handlePreview(file, index)">
          <image class="see-upload__image" :src="file.thumb || file.url" mode="aspectFill" :lazy-load="true" />
          <!-- 上传中遮罩 -->
          <view v-if="file.status === 'uploading'" class="see-upload__mask">
            <view class="see-upload__loading">
              <text class="see-upload__loading-icon">&#8635;</text>
            </view>
            <view v-if="file.progress !== undefined" class="see-upload__progress">
              <view class="see-upload__progress-bar" :style="{ width: file.progress + '%' }" />
            </view>
            <text v-if="file.message" class="see-upload__mask-text">{{ file.message }}</text>
          </view>
          <!-- 上传失败遮罩 -->
          <view v-if="file.status === 'error'" class="see-upload__mask see-upload__mask--error">
            <text class="see-upload__error-icon">&#9888;</text>
            <text class="see-upload__mask-text">{{ file.message || t('upload.fail') }}</text>
          </view>
        </view>

        <!-- 视频预览 -->
        <view v-else-if="isVideoFile(file)" class="see-upload__preview see-upload__preview--video" @click="handlePreview(file, index)">
          <image v-if="file.thumb" class="see-upload__image" :src="file.thumb" mode="aspectFill" :lazy-load="true" />
          <view v-else class="see-upload__video-placeholder">
            <text class="see-upload__video-icon">&#9654;</text>
          </view>
          <view class="see-upload__play-icon">
            <text class="see-upload__play-icon-text">&#9654;</text>
          </view>
          <!-- 上传中/失败遮罩 -->
          <view v-if="file.status === 'uploading'" class="see-upload__mask">
            <view class="see-upload__loading">
              <text class="see-upload__loading-icon">&#8635;</text>
            </view>
            <view v-if="file.progress !== undefined" class="see-upload__progress">
              <view class="see-upload__progress-bar" :style="{ width: file.progress + '%' }" />
            </view>
          </view>
          <view v-if="file.status === 'error'" class="see-upload__mask see-upload__mask--error">
            <text class="see-upload__error-icon">&#9888;</text>
            <text class="see-upload__mask-text">{{ file.message || t('upload.fail') }}</text>
          </view>
        </view>

        <!-- 文件预览 -->
        <view v-else class="see-upload__preview see-upload__preview--file">
          <view class="see-upload__file-info">
            <text class="see-upload__file-icon">&#128196;</text>
            <text class="see-upload__file-name">{{ file.name || t('upload.file') }}</text>
          </view>
          <!-- 上传中/失败遮罩 -->
          <view v-if="file.status === 'uploading'" class="see-upload__mask">
            <view class="see-upload__loading">
              <text class="see-upload__loading-icon">&#8635;</text>
            </view>
            <view v-if="file.progress !== undefined" class="see-upload__progress">
              <view class="see-upload__progress-bar" :style="{ width: file.progress + '%' }" />
            </view>
          </view>
          <view v-if="file.status === 'error'" class="see-upload__mask see-upload__mask--error">
            <text class="see-upload__error-icon">&#9888;</text>
            <text class="see-upload__mask-text">{{ file.message || t('upload.fail') }}</text>
          </view>
        </view>
      </slot>

      <!-- 删除按钮 -->
      <view v-if="isShowDelete && file.status !== 'uploading'" class="see-upload__delete" @click.stop="handleDelete(file, index)">
        <slot name="preview-delete">
          <view class="see-upload__delete-icon">
            <text class="see-upload__delete-icon-text">&#10005;</text>
          </view>
        </slot>
      </view>
    </view>

    <!-- 上传按钮 -->
    <view v-if="isShowUpload" class="see-upload__add" :class="itemClasses" :style="itemStyle" @click="handleClickUpload">
      <slot>
        <text class="see-upload__add-icon" :class="safeUploadIcon">
          {{ props.uploadIcon ? '' : '+' }}
        </text>
        <text v-if="props.uploadText" class="see-upload__add-text">{{ props.uploadText }}</text>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Upload 上传
 * @description 文件上传组件，支持图片、视频、文件上传，支持预览、压缩、自定义上传等功能。
 * @tutorial https://www.seeuui.cn/components/upload/
 *
 * @property {UploadFileItem[]}  modelValue        文件列表（v-model）
 * @property {UploadAccept}      accept            接受的文件类型（默认 'image'）
 * @property {Boolean}           isMultiple         是否支持多选
 * @property {Number}            maxCount           最大文件数量（默认 9）
 * @property {Number}            maxSize            单个文件大小限制，单位 MB
 * @property {Boolean}           isDisabled          是否禁用
 * @property {Boolean}           isReadonly          是否只读
 * @property {Boolean}           isDeletable         是否显示删除按钮（默认 true）
 * @property {Boolean}           isPreview           是否支持预览（默认 true）
 * @property {Boolean}           isCompress          是否压缩图片（默认 true）
 * @property {Number}            compressQuality     压缩质量 0-100（默认 80）
 * @property {Boolean}           isCapture           是否直接调用摄像头
 * @property {Boolean}           isCamera            是否使用前置摄像头
 * @property {ImageSizeType[]}   sizeType            图片压缩类型
 * @property {ImageSourceType[]} sourceType          图片来源
 * @property {Function}          upload              自定义上传函数
 * @property {Function}          beforeRead          上传前校验
 * @property {Function}          afterRead           上传后回调
 * @property {Boolean}           isPreviewImage      是否支持图片预览（默认 true）
 * @property {String}            name                表单字段名
 * @property {UploadSize}        size                尺寸
 * @property {String}            uploadText          上传按钮文字
 * @property {String}            uploadIcon          上传图标
 */
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import { formKey } from '../../utils/shared/form-keys'
import { useI18n } from '../../locale'
import type { UploadFileItem, UploadAccept, UploadSize, ImageSizeType, ImageSourceType } from './type'

defineOptions({ name: 'SeeUpload' })

const { t } = useI18n()

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    modelValue: () => [],
    accept: 'image',
    isMultiple: false,
    maxCount: 9,
    maxSize: undefined,
    isDisabled: false,
    isReadonly: false,
    isDeletable: true,
    isPreview: true,
    isCompress: true,
    compressQuality: 80,
    isCapture: false,
    isCamera: false,
    sizeType: () => ['original', 'compressed'],
    sourceType: () => ['album', 'camera'],
    upload: undefined,
    beforeRead: undefined,
    afterRead: undefined,
    isPreviewImage: true,
    name: '',
    size: 'default',
    uploadText: '',
    uploadIcon: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 文件列表变化时触发 */
  (e: 'onChange', fileList: UploadFileItem[]): void
  /** 文件超出大小限制时触发 */
  (e: 'onOversize', file: UploadFileItem): void
  /** 删除文件时触发 */
  (e: 'onDelete', file: UploadFileItem): void
  /** 预览文件时触发 */
  (e: 'onPreview', file: UploadFileItem): void
  /** 点击上传区域时触发 */
  (e: 'onClickUpload'): void
  /** 上传失败时触发 */
  (e: 'onError', error: Error): void
  /** v-model 更新 */
  (e: 'update:modelValue', fileList: UploadFileItem[]): void
}>()

/** ---------- inject ---------- */
const formContext = inject(formKey, null)

/** ---------- computed ---------- */

/** 实际禁用状态 */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.props?.isDisabled || false
})

/** 实际只读状态 */
const mergedReadonly = computed(() => {
  return props.isReadonly || formContext?.props?.isReadonly || false
})

/** 实际尺寸 */
const mergedSize = computed(() => {
  return props.size || formContext?.props?.size || 'default'
})

/**
 * 组件内部文件列表副本
 * @description 作为上传过程中的"单一数据源"，避免依赖 prop（modelValue）异步回流。
 * emit update:modelValue 后 prop 不会同步更新，若直接读 prop 会读到旧列表，
 * 导致上传状态/进度/url 丢失。所有变更先写内部副本，再统一 emit。
 */
const innerList = ref<UploadFileItem[]>([...(props.modelValue || [])])

/** 外部 modelValue 变化时同步内部副本（如父组件主动重置列表） */
watch(
  () => props.modelValue,
  (val) => {
    innerList.value = [...(val || [])]
  }
)

/** 文件列表（模板渲染以内部副本为准） */
const fileList = computed(() => innerList.value)

/** 是否显示上传按钮 */
const isShowUpload = computed(() => {
  if (mergedDisabled.value || mergedReadonly.value) return false
  return fileList.value.length < props.maxCount
})

/** 是否显示删除按钮 */
const isShowDelete = computed(() => {
  if (mergedDisabled.value || mergedReadonly.value) return false
  return props.isDeletable
})

/** 安全的上传图标类名（防止 CSS 注入） */
const safeUploadIcon = computed(() => {
  if (!props.uploadIcon) return 'see-upload-icon-plus'
  return props.uploadIcon.replace(/[^a-zA-Z0-9_\-\s]/g, '')
})

/** ---------- classes ---------- */
const uploadClasses = computed(() => {
  const classes: string[] = [`see-upload--${mergedSize.value}`]
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  return classes
})

const itemClasses = computed(() => {
  return [`see-upload__item--${mergedSize.value}`]
})

const itemStyle = computed(() => {
  const sizeMap = {
    small: 140,
    default: 180,
    large: 220
  }
  const s = sizeMap[mergedSize.value]
  return {
    width: `${s}rpx`,
    height: `${s}rpx`
  }
})

/** ---------- utils ---------- */

/** 生成唯一 ID */
let fileIdCounter = 0
function generateFileId(): string {
  return `see-upload-${Date.now()}-${++fileIdCounter}`
}

/** 获取文件唯一 key */
function getFileKey(file: UploadFileItem, index: number): string {
  return file.id || file.url || file.tempFilePath || `file_${index}`
}

/** 是否为图片文件 */
function isImageFile(file: UploadFileItem): boolean {
  if (file.type) {
    return file.type.startsWith('image/')
  }
  const url = file.url || file.thumb || ''
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|tiff|avif)/i.test(url)
}

/** 是否为视频文件 */
function isVideoFile(file: UploadFileItem): boolean {
  if (file.type) {
    return file.type.startsWith('video/')
  }
  const url = file.url || ''
  return /\.(mp4|avi|mov|wmv|flv|mkv|webm|3gp|m4v)/i.test(url)
}

/** 获取文件扩展名 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFileExtension(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop()! : ''
}

/** 检查文件大小 */
function checkFileSize(file: UploadFileItem): boolean {
  if (!props.maxSize) return true
  if (file.size === undefined || file.size === null) {
    console.warn('[see-upload] File size unknown, skipping size check')
    return true
  }
  const maxSizeBytes = props.maxSize * 1024 * 1024
  return file.size <= maxSizeBytes
}

/** 检查文件类型是否符合 accept 要求 */
function matchesAccept(file: UploadFileItem): boolean {
  if (!props.accept || props.accept === 'file') return true
  if (props.accept === 'image') return file.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|tiff|avif)$/i.test(file.name || '')
  if (props.accept === 'video') return file.type?.startsWith('video/') || /\.(mp4|avi|mov|wmv|flv|mkv)$/i.test(file.name || '')
  if (props.accept === 'media')
    return (
      file.type?.startsWith('image/') || file.type?.startsWith('video/') || /\.(jpg|jpeg|png|gif|bmp|webp|svg|mp4|avi|mov)$/i.test(file.name || '')
    )
  return true
}

/** 更新文件列表并触发事件（先写内部副本，再 emit） */
function updateFileList(list: UploadFileItem[]) {
  innerList.value = list
  emit('update:modelValue', list)
  emit('onChange', list)
}

/**
 * 按 id 更新单个文件的状态
 * @description 用 id 定位而非索引，避免上传过程中删除靠前项导致的索引错位，
 * 且始终基于内部副本读写，不受 prop 异步回流影响。
 */
function updateFileStatusById(id: string, updates: Partial<UploadFileItem>) {
  const list = [...innerList.value]
  const idx = list.findIndex((f) => f.id === id)
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates }
    updateFileList(list)
  }
}

/** ---------- 图片压缩 ---------- */

/**
 * @title 压缩图片
 * @description 使用 uni.compressImage 压缩图片，失败时返回原路径
 */
async function compressImage(tempFilePath: string): Promise<string> {
  // #ifdef H5
  // H5 端 uni.compressImage 可能不可用，直接返回原路径
  return tempFilePath
  // #endif

  /* eslint-disable no-unreachable */
  // #ifndef H5
  try {
    const result = await new Promise<{ tempFilePath: string }>((resolve, reject) => {
      uni.compressImage({
        src: tempFilePath,
        quality: props.compressQuality,
        success: (res) => resolve(res as { tempFilePath: string }),
        fail: (err) => reject(err)
      })
    })
    return result.tempFilePath
  } catch {
    return tempFilePath
  }
  // #endif
  /* eslint-enable no-unreachable */
}

/** ---------- 核心方法 ---------- */

/**
 * @title 选择文件
 * @description 根据 accept 类型调用对应的 uni API 选择文件
 */
async function chooseFile(): Promise<UploadFileItem[]> {
  const remaining = props.maxCount - fileList.value.length
  if (remaining <= 0) return []

  const count = props.isMultiple ? remaining : 1

  if (props.accept === 'image') {
    return chooseImage(count)
  } else if (props.accept === 'video') {
    return chooseVideo()
  } else if (props.accept === 'media') {
    return chooseMedia(count)
  } else {
    return chooseFileByInput()
  }
}

/**
 * @title 选择图片
 */
async function chooseImage(count: number): Promise<UploadFileItem[]> {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count,
      sizeType: props.sizeType,
      sourceType: getSourceType(),
      success: async (res) => {
        const files: UploadFileItem[] = []
        for (const path of res.tempFilePaths) {
          const tempFile = res.tempFiles.find((f) => f.path === path)
          let finalPath = path

          // 压缩图片
          if (props.isCompress) {
            finalPath = await compressImage(path)
          }

          files.push({
            id: generateFileId(),
            url: finalPath,
            tempFilePath: finalPath,
            size: tempFile?.size,
            type: tempFile?.type || 'image/jpeg',
            name: tempFile?.path?.split('/').pop() || '',
            status: 'done'
          })
        }
        resolve(files)
      },
      fail: (err) => {
        // 用户取消选择不算错误
        if (err.errMsg?.includes('cancel')) {
          resolve([])
        } else {
          reject(new Error(err.errMsg || '选择图片失败'))
        }
      }
    })
  })
}

/**
 * @title 选择视频
 */
async function chooseVideo(): Promise<UploadFileItem[]> {
  return new Promise((resolve, reject) => {
    uni.chooseVideo({
      sourceType: getSourceType(),
      compressed: true,
      maxDuration: 60,
      camera: props.isCamera ? 'front' : 'back',
      success: (res) => {
        const file: UploadFileItem = {
          id: generateFileId(),
          url: res.tempFilePath,
          tempFilePath: res.tempFilePath,
          size: res.size,
          type: res.type || 'video/mp4',
          name: res.tempFilePath.split('/').pop() || '',
          thumb: res.thumbTempFilePath || '',
          status: 'done'
        }
        resolve([file])
      },
      fail: (err) => {
        if (err.errMsg?.includes('cancel')) {
          resolve([])
        } else {
          reject(new Error(err.errMsg || '选择视频失败'))
        }
      }
    })
  })
}

/**
 * @title 选择媒体文件（图片或视频）
 */
async function chooseMedia(count: number): Promise<UploadFileItem[]> {
  // #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO || MP-LARK
  interface ChooseMediaTempFile {
    tempFilePath: string
    size: number
    fileType: string
    thumbTempFilePath?: string
  }
  interface ChooseMediaSuccessResult {
    tempFiles: ChooseMediaTempFile[]
  }
  interface ChooseMediaOptions {
    count: number
    mediaType: string[]
    sourceType: ('album' | 'camera')[]
    sizeType: ('original' | 'compressed')[]
    camera: 'front' | 'back'
    success: (res: ChooseMediaSuccessResult) => void
    fail: (err: { errMsg?: string }) => void
  }
  return new Promise((resolve, reject) => {
    ;(
      uni as unknown as {
        chooseMedia: (options: ChooseMediaOptions) => void
      }
    ).chooseMedia({
      count,
      mediaType: ['image', 'video'],
      sourceType: getSourceType(),
      sizeType: props.sizeType,
      camera: props.isCamera ? 'front' : 'back',
      success: async (res: ChooseMediaSuccessResult) => {
        const files: UploadFileItem[] = []
        for (const item of res.tempFiles || []) {
          let finalPath = item.tempFilePath
          const isImage = item.fileType === 'image'

          // 压缩图片
          if (isImage && props.isCompress) {
            finalPath = await compressImage(item.tempFilePath)
          }

          files.push({
            id: generateFileId(),
            url: finalPath,
            tempFilePath: finalPath,
            size: item.size,
            type: item.fileType === 'image' ? 'image/jpeg' : 'video/mp4',
            name: item.tempFilePath.split('/').pop() || '',
            thumb: item.thumbTempFilePath || '',
            status: 'done'
          })
        }
        resolve(files)
      },
      fail: (err: { errMsg?: string }) => {
        if (err.errMsg?.includes('cancel')) {
          resolve([])
        } else {
          reject(new Error(err.errMsg || '选择文件失败'))
        }
      }
    })
  })
  // #endif

  /* eslint-disable no-unreachable */
  // #ifndef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO || MP-LARK
  // 不支持 chooseMedia 的平台降级为 chooseImage
  return chooseImage(count)
  // #endif
  /* eslint-enable no-unreachable */
}

/**
 * @title 通过 input 选择文件（H5）
 */
function chooseFileByInput(): Promise<UploadFileItem[]> {
  // #ifdef H5
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = props.isMultiple
    input.accept = getFileAccept()
    input.style.display = 'none'
    document.body.appendChild(input)

    const cleanup = () => {
      if (input.parentNode) {
        document.body.removeChild(input)
      }
    }

    input.onchange = () => {
      const files = Array.from(input.files || [])
      const result: UploadFileItem[] = files.map((file) => ({
        id: generateFileId(),
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        status: 'done' as const
      }))
      cleanup()
      resolve(result)
    }

    input.click()
  })
  // #endif

  /* eslint-disable no-unreachable */
  // #ifndef H5
  // 非 H5 端降级为 chooseImage
  return chooseImage(props.isMultiple ? props.maxCount - fileList.value.length : 1)
  // #endif
  /* eslint-enable no-unreachable */
}

/** 获取 uni chooseImage/chooseVideo 的 sourceType */
function getSourceType(): ('album' | 'camera')[] {
  if (props.isCapture) return ['camera']
  return props.sourceType
}

/** 获取 H5 input 的 accept 属性 */
function getFileAccept(): string {
  const acceptMap: Record<UploadAccept, string> = {
    image: 'image/*',
    video: 'video/*',
    file: '*/*',
    media: 'image/*,video/*'
  }
  return acceptMap[props.accept] || '*/*'
}

/**
 * @title 执行上传
 * @description 调用自定义上传函数，更新文件状态和进度
 */
async function performUpload(file: UploadFileItem): Promise<void> {
  if (!props.upload) return

  const id = file.id
  if (!id) return

  updateFileStatusById(id, { status: 'uploading', progress: 0, message: '' })

  try {
    const url = await props.upload(file)
    updateFileStatusById(id, {
      status: 'done',
      url,
      progress: 100,
      message: ''
    })
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    updateFileStatusById(id, {
      status: 'error',
      message: error.message || t('upload.fail')
    })
    emit('onError', error)
  }
}

/**
 * @title 处理选择文件后的逻辑
 * @description 包含大小校验、beforeRead 校验、上传、afterRead 回调
 */
async function processFiles(selectedFiles: UploadFileItem[]) {
  const validFiles: UploadFileItem[] = []

  for (const file of selectedFiles) {
    // 大小校验
    if (!checkFileSize(file)) {
      emit('onOversize', file)
      continue
    }

    // 文件类型校验
    if (!matchesAccept(file)) {
      emit('onError', new Error(`文件类型不符合要求`))
      continue
    }

    // beforeRead 校验
    if (props.beforeRead) {
      try {
        const result = await props.beforeRead(file)
        if (!result) continue
      } catch {
        continue
      }
    }

    validFiles.push(file)
  }

  if (validFiles.length === 0) return

  // 合并到内部文件列表副本
  const newList = [...innerList.value, ...validFiles]
  updateFileList(newList)

  // 对每个新文件执行上传，全程用 id 定位，不受回流/删除导致的索引错位影响
  for (const file of validFiles) {
    // 执行上传（内部按 id 更新状态/进度/url）
    await performUpload(file)

    // afterRead 回调，读取内部副本中最新的文件状态
    if (props.afterRead) {
      const latest = file.id ? innerList.value.find((f) => f.id === file.id) : undefined
      props.afterRead(latest || file)
    }
  }
}

/** ---------- 事件处理 ---------- */

/**
 * @title 点击上传区域
 */
async function handleClickUpload() {
  if (mergedDisabled.value || mergedReadonly.value) return

  emit('onClickUpload')

  try {
    const files = await chooseFile()
    if (files.length > 0) {
      await processFiles(files)
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    emit('onError', error)
  }
}

/**
 * @title 预览文件
 */
function handlePreview(file: UploadFileItem, _index: number) {
  if (!props.isPreview) return
  emit('onPreview', file)

  // 图片预览
  if (props.isPreviewImage && isImageFile(file) && file.url) {
    const urls = fileList.value.filter((f) => isImageFile(f) && f.url).map((f) => f.url as string)

    uni.previewImage({
      urls,
      current: file.url,
      showmenu: true
    })
  }
}

/**
 * @title 删除文件
 */
function handleDelete(file: UploadFileItem, index: number) {
  if (!isShowDelete.value) return

  // 释放 Object URL 避免内存泄漏
  revokeObjectUrl(file)

  emit('onDelete', file)

  const newList = [...fileList.value]
  newList.splice(index, 1)
  updateFileList(newList)
}

/**
 * @title 释放 Object URL
 */
function revokeObjectUrl(file: UploadFileItem) {
  // #ifdef H5
  if (file.url && file.url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(file.url)
    } catch {
      // ignore
    }
  }
  // #endif
}

/** ---------- lifecycle ---------- */
onBeforeUnmount(() => {
  // 组件卸载时释放所有 Object URL
  // #ifdef H5
  for (const file of fileList.value) {
    revokeObjectUrl(file)
  }
  // #endif
})

/** ---------- expose ---------- */
defineExpose({
  /** 获取文件列表 */
  getFileList: () => fileList.value,
  /** 手动触发选择文件 */
  chooseFile: async () => {
    if (mergedDisabled.value || mergedReadonly.value) return
    try {
      const files = await chooseFile()
      if (files.length > 0) {
        await processFiles(files)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      emit('onError', error)
    }
  },
  /** 清空文件列表 */
  clearFiles: () => {
    updateFileList([])
  },
  /** 删除指定文件 */
  removeFile: (index: number) => {
    const list = [...fileList.value]
    if (list[index]) {
      const file = list[index]
      revokeObjectUrl(file)
      emit('onDelete', file)
      list.splice(index, 1)
      updateFileList(list)
    }
  }
})
</script>

<style lang="scss" scoped>
/* ---------- CSS 变量 ---------- */
.see-upload {
  --upload-item-gap: 16rpx;
  --upload-border-radius: 12rpx;
  --upload-bg-color: var(--see-bg-color, #f5f7fa);
  --upload-border-color: var(--see-border-color, #dcdfe6);
  --upload-text-color: var(--see-tips-color, #909399);
  --upload-icon-color: var(--see-tips-color, #c0c4cc);
  --upload-delete-size: 32rpx;
  --upload-delete-bg: rgba(0, 0, 0, 0.5);
  --upload-mask-bg: rgba(0, 0, 0, 0.45);
  --upload-progress-color: var(--see-primary, #007aff);
  --upload-error-color: var(--see-error, #e43d33);
  --upload-add-icon-size: 56rpx;
  --upload-add-text-size: 24rpx;
  --upload-file-icon-size: 48rpx;
  --upload-file-name-size: 22rpx;
}

/* ---------- 基础布局 ---------- */
.see-upload {
  display: flex;
  flex-wrap: wrap;
  gap: var(--upload-item-gap);
  width: 100%;
}

/* ---------- 文件项 ---------- */
.see-upload__item {
  position: relative;
  border-radius: var(--upload-border-radius);
  overflow: hidden;
  flex-shrink: 0;
}

/* ---------- 尺寸 ---------- */
.see-upload__item--small {
  border-radius: 8rpx;
}

.see-upload__item--large {
  border-radius: 16rpx;
}

/* ---------- 预览区域 ---------- */
.see-upload__preview {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--upload-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.see-upload__image {
  width: 100%;
  height: 100%;
  display: block;
}

/* ---------- 视频预览 ---------- */
.see-upload__preview--video {
  background-color: var(--see-bg-dark-color, #000);
}

.see-upload__video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--see-bg-dark-color, #1a1a1a);
}

.see-upload__video-icon {
  font-size: 48rpx;
  color: var(--see-text);
}

.see-upload__play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64rpx;
  height: 64rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.see-upload__play-icon-text {
  font-size: 28rpx;
  color: var(--see-text);
  margin-left: 4rpx;
}

/* ---------- 文件预览 ---------- */
.see-upload__preview--file {
  flex-direction: column;
  gap: 8rpx;
  padding: 16rpx;
  box-sizing: border-box;
}

.see-upload__file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  width: 100%;
}

.see-upload__file-icon {
  font-size: var(--upload-file-icon-size);
}

.see-upload__file-name {
  font-size: var(--upload-file-name-size);
  color: var(--upload-text-color);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* ---------- 遮罩层 ---------- */
.see-upload__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--upload-mask-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.see-upload__mask--error {
  background-color: rgba(0, 0, 0, 0.5);
}

.see-upload__mask-text {
  font-size: 20rpx;
  color: var(--see-text);
  text-align: center;
  padding: 0 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* ---------- 加载动画 ---------- */
.see-upload__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.see-upload__loading-icon {
  font-size: 40rpx;
  color: var(--see-text);
  animation: upload-spin 1s linear infinite;
}

@keyframes upload-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ---------- 进度条 ---------- */
.see-upload__progress {
  width: 80%;
  height: 6rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3rpx;
  overflow: hidden;
}

.see-upload__progress-bar {
  height: 100%;
  background-color: var(--upload-progress-color);
  border-radius: 3rpx;
  transition: width 0.2s ease;
}

/* ---------- 错误图标 ---------- */
.see-upload__error-icon {
  font-size: 36rpx;
  color: var(--see-text);
}

/* ---------- 删除按钮 ---------- */
.see-upload__delete {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  cursor: pointer;
}

.see-upload__delete-icon {
  width: var(--upload-delete-size);
  height: var(--upload-delete-size);
  background-color: var(--upload-delete-bg);
  border-radius: 0 0 0 var(--upload-border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.see-upload__delete-icon-text {
  font-size: 20rpx;
  color: var(--see-text);
  line-height: 1;
}

/* ---------- 上传按钮 ---------- */
.see-upload__add {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  background-color: var(--upload-bg-color);
  border: 2rpx dashed var(--upload-border-color);
  border-radius: var(--upload-border-radius);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
  flex-shrink: 0;

  &:active {
    border-color: var(--upload-progress-color);
    background-color: rgba(0, 0, 0, 0.02);
  }
}

.see-upload__add-icon {
  font-size: var(--upload-add-icon-size);
  color: var(--upload-icon-color);
  line-height: 1;
}

.see-upload-icon-plus::before {
  content: '+';
}

.see-upload__add-text {
  font-size: var(--upload-add-text-size);
  color: var(--upload-text-color);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 90%;
}

/* ---------- 禁用状态 ---------- */
.see-upload.is-disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* ---------- 只读状态 ---------- */
.see-upload.is-readonly {
  .see-upload__add {
    display: none;
  }

  .see-upload__delete {
    display: none;
  }
}

/* ---------- 尺寸变体 ---------- */
.see-upload--small {
  --upload-add-icon-size: 40rpx;
  --upload-add-text-size: 20rpx;
  --upload-file-icon-size: 36rpx;
  --upload-file-name-size: 20rpx;
  --upload-delete-size: 28rpx;
  --upload-item-gap: 12rpx;
}

.see-upload--large {
  --upload-add-icon-size: 72rpx;
  --upload-add-text-size: 28rpx;
  --upload-file-icon-size: 56rpx;
  --upload-file-name-size: 24rpx;
  --upload-delete-size: 36rpx;
  --upload-item-gap: 20rpx;
}
</style>
