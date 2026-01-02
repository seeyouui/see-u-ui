<template>
  <view class="container">
    <text class="title">基本使用</text>
    <view class="content">
      <see-image src="https://www.seeuui.cn/logo.png" width="80px" height="80px" />
    </view>

    <text class="title">圆角设置</text>
    <view class="content">
      <see-image src="https://www.seeuui.cn/logo.png" width="80px" height="80px" :radius="40" />
    </view>

    <text class="title">遮罩层</text>
    <view class="content">
      <view class="demo-item">
        <text class="demo-label">无遮罩</text>
        <see-image src="https://www.seeuui.cn/logo.png" width="120px" height="120px" :radius="8" />
      </view>
      <view class="demo-item">
        <text class="demo-label">黑色遮罩(0.3)</text>
        <see-image src="https://www.seeuui.cn/logo.png" width="120px" height="120px" :radius="8" show-mask mask-color="#000" :mask-opacity="0.3" />
      </view>
      <view class="demo-item">
        <text class="demo-label">白色遮罩(0.5)</text>
        <see-image src="https://www.seeuui.cn/logo.png" width="120px" height="120px" :radius="8" show-mask mask-color="#fff" :mask-opacity="0.5" />
      </view>
      <view class="demo-item">
        <text class="demo-label">蓝色遮罩(0.4)</text>
        <see-image src="https://www.seeuui.cn/logo.png" width="120px" height="120px" :radius="8" show-mask mask-color="#3ca7ff" :mask-opacity="0.4" />
      </view>
    </view>

    <text class="title">图片预览</text>
    <view class="content">
      <see-image
        src="https://www.seeuui.cn/logo.png"
        width="200px"
        height="200px"
        :radius="8"
        preview-mode
        preview-tip="点击图片预览大图"
        @on-click="handlePreviewClick"
      />
    </view>

    <text class="title">淡入动画</text>
    <view class="content">
      <view class="demo-item">
        <text class="demo-label">快速淡入(100ms)</text>
        <see-image src="https://www.seeuui.cn/logo.png" width="150px" height="150px" :fade-in-duration="100" />
      </view>
      <view class="demo-item">
        <text class="demo-label">默认淡入(300ms)</text>
        <see-image src="https://www.seeuui.cn/logo.png" width="150px" height="150px" :fade-in-duration="300" />
      </view>
      <view class="demo-item">
        <text class="demo-label">自定义淡入时间(10000ms)</text>
        <see-image src="https://www.seeuui.cn/logo.png" width="150px" height="150px" :fade-in-duration="10000" />
      </view>
    </view>

    <text class="title">错误处理</text>
    <view class="content">
      <view class="demo-item">
        <see-image src="https://invalid-url-for-test.com/image.jpg" width="200px" height="200px" :radius="8" @on-error="handleImageError" />
      </view>
    </view>

    <text class="title">自定义内容</text>
    <view class="content">
      <see-image src="https://www.seeuui.cn/logo.png" width="200px" height="200px" :radius="8" show-mask :mask-opacity="0.4">
        <view class="custom-content">
          <text class="custom-text">自定义内容</text>
          <text class="custom-subtext">可叠加任何元素</text>
        </view>
      </see-image>
    </view>

    <text class="title">懒加载</text>
    <view class="content">
      <text class="lazy-text">已启用懒加载，滚动时加载图片</text>
      <see-image src="https://www.seeuui.cn/logo.png" width="200px" height="200px" :radius="8" :lazy-load="true" loading-text="图片加载中..." />
    </view>

    <text class="title">组件事件</text>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 事件日志
const eventLog = ref('等待事件...')

/**
 * @title 图片加载完成事件
 */
const handleLoad = () => {
  eventLog.value = '✓ 图片加载完成'
  console.log('图片加载完成')
}

/**
 * @title 图片加载失败事件
 */
const handleError = () => {
  eventLog.value = '✗ 图片加载失败'
  console.log('图片加载失败')
}

/**
 * @title 图片点击事件
 */
const handleClick = () => {
  eventLog.value = '◯ 图片被点击'
  console.log('图片被点击')
}

/**
 * @title 图片长按事件
 */
const handleLongpress = () => {
  eventLog.value = '◆ 图片被长按'
  console.log('图片被长按')
}

/**
 * @title 图片错误事件
 */
const handleImageError = () => {
  console.log('图片加载出错')
}

/**
 * @title 预览点击
 */
const handlePreviewClick = () => {
  console.log('点击预览图片')
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
