<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('upload.demo.image') }}</text>
      <view class="content">
        <see-upload v-model="imageList" accept="image" :upload-text="t('upload.demo.uploadImage')" @on-change="handleImageChange" />
      </view>

      <text class="title">{{ t('upload.demo.multiImage') }}</text>
      <view class="content">
        <see-upload
          v-model="multiImageList"
          accept="image"
          is-multiple
          :max-count="9"
          :upload-text="t('upload.demo.uploadMulti')"
          @on-change="handleMultiImageChange"
        />
      </view>

      <text class="title">{{ t('upload.demo.sizeLimit') }}</text>
      <view class="content">
        <see-upload
          v-model="sizeLimitList"
          accept="image"
          :max-size="2"
          :upload-text="t('upload.demo.uploadSizeLimit')"
          @on-oversize="handleOversize"
        />
        <text class="info">{{ t('upload.demo.sizeHint') }}</text>
      </view>

      <text class="title">{{ t('upload.demo.video') }}</text>
      <view class="content">
        <see-upload v-model="videoList" accept="video" :upload-text="t('upload.demo.uploadVideo')" :max-count="3" />
      </view>

      <text class="title">{{ t('upload.demo.file') }}</text>
      <view class="content">
        <see-upload v-model="fileList" accept="file" :upload-text="t('upload.demo.uploadFile')" :max-count="5" />
      </view>

      <text class="title">{{ t('upload.demo.custom') }}</text>
      <view class="content">
        <see-upload
          v-model="customList"
          accept="image"
          :upload="customUpload"
          :upload-text="t('upload.demo.uploadCustom')"
          @on-change="handleCustomChange"
          @on-error="handleUploadError"
        />
        <text class="info">{{ t('upload.demo.customHint') }}</text>
      </view>

      <text class="title">{{ t('upload.demo.beforeRead') }}</text>
      <view class="content">
        <see-upload v-model="beforeReadList" accept="image" :before-read="beforeReadCheck" :upload-text="t('upload.demo.uploadBeforeRead')" />
        <text class="info">{{ t('upload.demo.formatHint') }}</text>
      </view>

      <text class="title">{{ t('upload.demo.disabled') }}</text>
      <view class="content">
        <see-upload v-model="disabledList" accept="image" is-disabled :upload-text="t('upload.demo.uploadDisabled')" />
      </view>

      <text class="title">{{ t('upload.demo.readonly') }}</text>
      <view class="content">
        <see-upload :model-value="readonlyFiles" accept="image" is-readonly :upload-text="t('upload.demo.uploadReadonly')" />
      </view>

      <text class="title">{{ t('upload.demo.noDelete') }}</text>
      <view class="content">
        <see-upload v-model="noDeleteList" accept="image" :is-deletable="false" :upload-text="t('upload.demo.uploadNoDelete')" />
      </view>

      <text class="title">{{ t('upload.demo.sizes') }}</text>
      <view class="content">
        <view class="size-row">
          <text class="info">{{ t('upload.demo.smallSize') }}</text>
          <see-upload v-model="sizeList1" accept="image" size="small" :upload-text="t('upload.demo.uploadSmall')" />
        </view>
        <view class="size-row">
          <text class="info">{{ t('upload.demo.defaultSize') }}</text>
          <see-upload v-model="sizeList2" accept="image" size="default" :upload-text="t('upload.demo.uploadDefault')" />
        </view>
        <view class="size-row">
          <text class="info">{{ t('upload.demo.largeSize') }}</text>
          <see-upload v-model="sizeList3" accept="image" size="large" :upload-text="t('upload.demo.uploadLarge')" />
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import type { UploadFileItem } from '../../uni_modules/see-u-ui/components/see-upload/type'

const { t } = useI18n()
useNavbarI18n('navbar.seeUpload')

const imageList = ref<UploadFileItem[]>([])
const multiImageList = ref<UploadFileItem[]>([])
const sizeLimitList = ref<UploadFileItem[]>([])
const videoList = ref<UploadFileItem[]>([])
const fileList = ref<UploadFileItem[]>([])
const customList = ref<UploadFileItem[]>([])
const beforeReadList = ref<UploadFileItem[]>([])
const disabledList = ref<UploadFileItem[]>([])
const noDeleteList = ref<UploadFileItem[]>([])
const sizeList1 = ref<UploadFileItem[]>([])
const sizeList2 = ref<UploadFileItem[]>([])
const sizeList3 = ref<UploadFileItem[]>([])

const readonlyFiles = ref<UploadFileItem[]>([{ url: 'https://www.seeuui.cn/logo.png', name: '示例图片.png', status: 'done' }])

/** 自定义上传函数 */
const customUpload = (file: UploadFileItem): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('开始自定义上传：', file.name)
    // 模拟上传过程
    setTimeout(() => {
      if (file.url) {
        resolve(file.url)
      } else {
        reject(new Error(t('upload.fail')))
      }
    }, 1500)
  })
}

/** 上传前校验 */
const beforeReadCheck = (file: UploadFileItem): boolean => {
  const name = file.name || ''
  const isJpgOrPng = name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png')
  if (!isJpgOrPng) {
    console.log('仅支持 JPG/PNG 格式')
    return false
  }
  return true
}

const handleImageChange = (list: UploadFileItem[]) => {
  console.log('图片列表变化：', list.length)
}

const handleMultiImageChange = (list: UploadFileItem[]) => {
  console.log('多图列表变化：', list.length)
}

const handleOversize = (file: UploadFileItem) => {
  console.log('文件超出大小限制：', file.name)
}

const handleCustomChange = (list: UploadFileItem[]) => {
  console.log('自定义上传列表变化：', list.length)
}

const handleUploadError = (error: Error) => {
  console.log('上传失败：', error.message)
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    color: #999;
  }
  .content {
    margin-top: 12px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.info {
  font-size: 12px;
  color: #999;
}

.size-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
