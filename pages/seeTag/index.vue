<template>
  <see-config>
    <view class="container">
      <!-- ========== 基本使用 ========== -->
      <text class="title">{{ t('tag.demo.basic') }}</text>
      <view class="content">
        <see-tag>{{ t('tag.demo.default') }}</see-tag>
        <see-tag type="primary">{{ t('tag.demo.primary') }}</see-tag>
        <see-tag type="success">{{ t('tag.demo.success') }}</see-tag>
        <see-tag type="warning">{{ t('tag.demo.warning') }}</see-tag>
        <see-tag type="danger">{{ t('tag.demo.danger') }}</see-tag>
        <see-tag type="info">{{ t('tag.demo.info') }}</see-tag>
      </view>

      <!-- ========== 主题效果 ========== -->
      <text class="title">{{ t('tag.demo.theme') }}</text>
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

      <!-- ========== 尺寸 ========== -->
      <text class="title">{{ t('tag.demo.size') }}</text>
      <view class="content">
        <see-tag type="primary" size="large">{{ t('tag.demo.large') }}</see-tag>
        <see-tag type="primary">{{ t('tag.demo.default') }}</see-tag>
        <see-tag type="primary" size="small">{{ t('tag.demo.small') }}</see-tag>
      </view>

      <!-- ========== 圆角标签 ========== -->
      <text class="title">{{ t('tag.demo.round') }}</text>
      <view class="content">
        <see-tag type="primary" round>Round</see-tag>
        <see-tag type="success" round effect="dark">Round</see-tag>
        <see-tag type="warning" round effect="plain">Round</see-tag>
      </view>

      <!-- ========== 可关闭 ========== -->
      <text class="title">{{ t('tag.demo.closable') }}</text>
      <view class="content">
        <see-tag v-for="(tag, index) in dynamicTags" :key="index" :type="tag.type" closable @on-close="handleClose(index)">
          {{ tag.label }}
        </see-tag>
      </view>
      <view class="flex-sb">
        <see-button size="mini" is-ripple type="primary" @tap="addTag">{{ t('tag.demo.addTag') }}</see-button>
      </view>

      <!-- ========== 标记样式 ========== -->
      <text class="title">{{ t('tag.demo.mark') }}</text>
      <view class="content">
        <see-tag type="primary" mark>Mark</see-tag>
        <see-tag type="success" mark effect="dark">Mark</see-tag>
        <see-tag type="danger" mark effect="plain">Mark</see-tag>
      </view>

      <!-- ========== 描边 ========== -->
      <text class="title">{{ t('tag.demo.hit') }}</text>
      <view class="content">
        <see-tag type="primary" hit>Hit</see-tag>
        <see-tag type="primary" hit effect="dark">Hit Dark</see-tag>
        <see-tag type="primary" hit effect="plain">Hit Plain</see-tag>
      </view>

      <!-- ========== 禁用状态 ========== -->
      <text class="title">{{ t('tag.demo.disabled') }}</text>
      <view class="content">
        <see-tag type="primary" is-disabled>{{ t('tag.demo.tagDisabled') }}</see-tag>
        <see-tag type="primary" closable is-disabled>{{ t('tag.demo.closableDisabled') }}</see-tag>
        <see-tag type="success" is-disabled effect="dark">{{ t('tag.demo.tagDisabled') }}</see-tag>
      </view>

      <!-- ========== 自定义颜色 ========== -->
      <text class="title">{{ t('tag.demo.customColor') }}</text>
      <view class="content">
        <see-tag color="#7232dd">{{ t('tag.demo.custom') }}</see-tag>
        <see-tag color="#7232dd" effect="dark">{{ t('tag.demo.custom') }}</see-tag>
        <see-tag color="#7232dd" effect="plain">{{ t('tag.demo.custom') }}</see-tag>
      </view>
      <view class="content">
        <see-tag bg-color="#fdf0ff" text-color="#7232dd" border-color="#e8d0f8">{{ t('tag.demo.fullCustom') }}</see-tag>
      </view>

      <!-- ========== 点击事件 ========== -->
      <text class="title">{{ t('tag.demo.click') }}</text>
      <view class="content">
        <see-tag type="primary" @on-click="handleClick">{{ t('tag.demo.clickMe') }} ({{ clickCount }})</see-tag>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.tag')

const dynamicTags = ref([
  { label: t('tag.demo.tag1'), type: 'primary' },
  { label: t('tag.demo.tag2'), type: 'success' },
  { label: t('tag.demo.tag3'), type: 'warning' }
])
const tagTypes = ['primary', 'success', 'warning', 'danger', 'info'] as const
let tagIndex = 3

const addTag = () => {
  tagIndex++
  dynamicTags.value.push({ label: t('tag.demo.tagLabel', { index: tagIndex + 1 }), type: tagTypes[tagIndex % tagTypes.length] })
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
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    justify-content: flex-start;
  }
}

.info {
  font-size: 12px;
  color: #999;
}

.flex-sb {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-top: 12px;
}
</style>
