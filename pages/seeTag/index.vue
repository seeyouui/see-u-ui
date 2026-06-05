<template>
  <see-config>
    <view class="container">
      <text class="title">基本使用</text>
      <view class="content">
        <see-tag>默认</see-tag>
        <see-tag type="primary">主要</see-tag>
        <see-tag type="success">成功</see-tag>
        <see-tag type="warning">警告</see-tag>
        <see-tag type="danger">危险</see-tag>
        <see-tag type="info">信息</see-tag>
      </view>

      <text class="title">主题效果</text>
      <view class="content">
        <see-tag type="primary" effect="dark">Dark</see-tag>
        <see-tag type="primary" effect="light">Light</see-tag>
        <see-tag type="primary" effect="plain">Plain</see-tag>
      </view>
      <view class="content">
        <see-tag type="success" effect="dark">Dark</see-tag>
        <see-tag type="success" effect="light">Light</see-tag>
        <see-tag type="success" effect="plain">Plain</see-tag>
      </view>
      <view class="content">
        <see-tag type="danger" effect="dark">Dark</see-tag>
        <see-tag type="danger" effect="light">Light</see-tag>
        <see-tag type="danger" effect="plain">Plain</see-tag>
      </view>

      <text class="title">尺寸</text>
      <view class="content">
        <see-tag type="primary" size="large">大型</see-tag>
        <see-tag type="primary">默认</see-tag>
        <see-tag type="primary" size="small">小型</see-tag>
      </view>

      <text class="title">圆角标签</text>
      <view class="content">
        <see-tag type="primary" round>Round</see-tag>
        <see-tag type="success" round effect="dark">Round</see-tag>
        <see-tag type="warning" round effect="plain">Round</see-tag>
      </view>

      <text class="title">可关闭</text>
      <view class="content">
        <see-tag v-for="(tag, index) in dynamicTags" :key="index" :type="tag.type" closable @on-close="handleClose(index)">
          {{ tag.label }}
        </see-tag>
      </view>
      <view class="flex-sb">
        <see-button size="mini" is-ripple type="primary" @tap="addTag">添加标签</see-button>
      </view>

      <text class="title">标记样式</text>
      <view class="content">
        <see-tag type="primary" mark>Mark</see-tag>
        <see-tag type="success" mark effect="dark">Mark</see-tag>
        <see-tag type="danger" mark effect="plain">Mark</see-tag>
      </view>

      <text class="title">描边</text>
      <view class="content">
        <see-tag type="primary" hit>Hit</see-tag>
        <see-tag type="primary" hit effect="dark">Hit Dark</see-tag>
        <see-tag type="primary" hit effect="plain">Hit Plain</see-tag>
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-tag type="primary" disabled>禁用</see-tag>
        <see-tag type="primary" closable disabled>禁用可关闭</see-tag>
        <see-tag type="success" disabled effect="dark">禁用</see-tag>
      </view>

      <text class="title">自定义颜色</text>
      <view class="content">
        <see-tag color="#7232dd">自定义</see-tag>
        <see-tag color="#7232dd" effect="dark">自定义</see-tag>
        <see-tag color="#7232dd" effect="plain">自定义</see-tag>
      </view>
      <view class="content">
        <see-tag bg-color="#fdf0ff" text-color="#7232dd" border-color="#e8d0f8">完全自定义</see-tag>
      </view>

      <text class="title">点击事件</text>
      <view class="content">
        <see-tag type="primary" @on-click="handleClick">点击我 ({{ clickCount }})</see-tag>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const dynamicTags = ref([
  { label: '标签一', type: 'primary' },
  { label: '标签二', type: 'success' },
  { label: '标签三', type: 'warning' }
])
const tagTypes = ['primary', 'success', 'warning', 'danger', 'info'] as const
let tagIndex = 3

const addTag = () => {
  tagIndex++
  dynamicTags.value.push({ label: `标签${tagIndex}`, type: tagTypes[tagIndex % tagTypes.length] })
}

const handleClose = (index: number) => {
  dynamicTags.value.splice(index, 1)
}

const clickCount = ref(0)
const handleClick = () => {
  clickCount.value++
}
</script>

<style lang="scss" scoped>
.gap-12 {
  width: 100%;
  height: 12px;
}
.flex-sb {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-top: 12px;
}
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
    margin-top: 6px;
    margin-bottom: 24px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: flex-start;
  }
}
</style>
