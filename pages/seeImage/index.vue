<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('image.demo.basic') }}</text>
      <view class="content">
        <see-image src="https://www.seeuui.cn/logo.png" width="80px" height="80px" />
      </view>

      <text class="title">{{ t('image.demo.radius') }}</text>
      <view class="content">
        <see-image src="https://www.seeuui.cn/logo.png" width="80px" height="80px" :radius="40" />
      </view>

      <text class="title">{{ t('image.demo.mask') }}</text>
      <view class="content">
        <view class="demo-item">
          <text class="demo-label">{{ t('image.demo.noMask') }}</text>
          <see-image src="https://www.seeuui.cn/logo.png" width="120px" height="120px" :radius="8" />
        </view>
        <view class="demo-item">
          <text class="demo-label">{{ t('image.demo.blackMask') }}</text>
          <see-image src="https://www.seeuui.cn/logo.png" width="120px" height="120px" :radius="8" show-mask mask-color="#000" :mask-opacity="0.3" />
        </view>
        <view class="demo-item">
          <text class="demo-label">{{ t('image.demo.whiteMask') }}</text>
          <see-image src="https://www.seeuui.cn/logo.png" width="120px" height="120px" :radius="8" show-mask mask-color="#fff" :mask-opacity="0.5" />
        </view>
        <view class="demo-item">
          <text class="demo-label">{{ t('image.demo.blueMask') }}</text>
          <see-image
            src="https://www.seeuui.cn/logo.png"
            width="120px"
            height="120px"
            :radius="8"
            show-mask
            mask-color="#3ca7ff"
            :mask-opacity="0.4"
          />
        </view>
      </view>

      <text class="title">{{ t('image.demo.preview') }}</text>
      <view class="content">
        <see-image
          src="https://www.seeuui.cn/logo.png"
          width="200px"
          height="200px"
          :radius="8"
          preview-mode
          :preview-tip="t('image.demo.previewTip')"
          @on-click="handlePreviewClick"
        />
      </view>

      <text class="title">{{ t('image.demo.fadeIn') }}</text>
      <view class="content">
        <view class="demo-item">
          <text class="demo-label">{{ t('image.demo.fastFade') }}</text>
          <see-image src="https://www.seeuui.cn/logo.png" width="150px" height="150px" :fade-in-duration="100" />
        </view>
        <view class="demo-item">
          <text class="demo-label">{{ t('image.demo.defaultFade') }}</text>
          <see-image src="https://www.seeuui.cn/logo.png" width="150px" height="150px" :fade-in-duration="300" />
        </view>
        <view class="demo-item">
          <text class="demo-label">{{ t('image.demo.customFade') }}</text>
          <see-image src="https://www.seeuui.cn/logo.png" width="150px" height="150px" :fade-in-duration="10000" />
        </view>
      </view>

      <text class="title">{{ t('image.demo.errorHandle') }}</text>
      <view class="content">
        <view class="demo-item">
          <see-image src="https://invalid-url-for-test.com/image.jpg" width="200px" height="200px" :radius="8" @on-error="handleImageError" />
        </view>
      </view>

      <text class="title">{{ t('image.demo.custom') }}</text>
      <view class="content">
        <see-image src="https://www.seeuui.cn/logo.png" width="200px" height="200px" :radius="8" show-mask :mask-opacity="0.4">
          <view class="custom-content">
            <text class="custom-text">{{ t('image.demo.customContent') }}</text>
            <text class="custom-subtext">{{ t('image.demo.overlayAny') }}</text>
          </view>
        </see-image>
      </view>

      <text class="title">{{ t('image.demo.lazy') }}</text>
      <view class="content">
        <text class="lazy-text">{{ t('image.demo.lazyEnabled') }}</text>
        <see-image
          src="https://www.seeuui.cn/logo.png"
          width="200px"
          height="200px"
          :radius="8"
          :lazy-load="true"
          :loading-text="t('image.demo.loadingText')"
        />
      </view>

      <text class="title">{{ t('image.demo.events') }}</text>
      <view class="content">
        <see-image
          src="https://www.seeuui.cn/logo.png"
          width="200px"
          height="200px"
          :radius="8"
          @on-load="handleLoad"
          @on-error="handleError"
          @on-click="handleClick"
          @on-longpress="handleLongpress"
        />
        <text class="event-text">{{ eventLog }}</text>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.image')

// 事件日志
const eventLog = ref(t('image.demo.waitingEvent'))

/**
 * @title 图片加载完成事件
 */
const handleLoad = () => {
  eventLog.value = t('image.demo.loadSuccess')
  console.log(t('image.demo.loadSuccess'))
}

/**
 * @title 图片加载失败事件
 */
const handleError = () => {
  eventLog.value = t('image.demo.loadFail')
  console.log(t('image.demo.loadFail'))
}

/**
 * @title 图片点击事件
 */
const handleClick = () => {
  eventLog.value = t('image.demo.clicked')
  console.log(t('image.demo.clicked'))
}

/**
 * @title 图片长按事件
 */
const handleLongpress = () => {
  eventLog.value = t('image.demo.longPressed')
  console.log(t('image.demo.longPressed'))
}

/**
 * @title 图片错误事件
 */
const handleImageError = () => {
  console.log(t('image.demo.loadFail'))
}

/**
 * @title 预览点击
 */
const handlePreviewClick = () => {
  console.log('preview click')
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  overflow: hidden;
  padding: 12px;
  padding-top: 0;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    color: #999;
    margin-top: 24px;
    margin-bottom: 12px;
    display: block;
  }

  .content {
    margin-bottom: 24px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
}

/* 演示项通用样式 */
.demo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;

  .demo-label {
    font-size: 12px;
    color: #ccc;
    margin-bottom: 8px;
  }
}

/* 自定义内容 */
.custom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;

  .custom-text {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .custom-subtext {
    font-size: 14px;
    opacity: 0.8;
  }
}

/* 懒加载 */
.lazy-text {
  font-size: 14px;
  color: #999;
}

.gap-12 {
  width: 100%;
  height: 12px;
}

.gap-24 {
  width: 100%;
  height: 24px;
}

/* 事件日志 */
.event-text {
  font-size: 14px;
  color: var(--see-primary);
  font-weight: bold;
  padding: 12px;
  background-color: #f0f8ff;
  border-radius: 4px;
}
</style>
