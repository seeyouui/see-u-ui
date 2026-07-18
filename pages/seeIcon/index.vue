<template>
  <see-config>
    <view class="container">
      <!-- 基本使用 -->
      <view class="section">
        <text class="title">基本使用</text>
        <view class="content">
          <view class="item">
            <see-icon name="✓" :size="24" />
            <text class="label">checkmark</text>
          </view>
          <view class="item">
            <see-icon name="★" :size="24" />
            <text class="label">star</text>
          </view>
          <view class="item">
            <see-icon name="♥" :size="24" />
            <text class="label">heart</text>
          </view>
          <view class="item">
            <see-icon name="●" :size="24" />
            <text class="label">circle</text>
          </view>
          <view class="item">
            <see-icon name="✕" :size="24" />
            <text class="label">close</text>
          </view>
          <view class="item">
            <see-icon name="ℹ" :size="24" />
            <text class="label">info</text>
          </view>
        </view>
      </view>

      <!-- 图标大小 -->
      <view class="section">
        <text class="title">图标大小</text>
        <view class="content">
          <view class="item">
            <see-icon name="✓" :size="16" />
            <text class="label">16px</text>
          </view>
          <view class="item">
            <see-icon name="✓" :size="24" />
            <text class="label">24px</text>
          </view>
          <view class="item">
            <see-icon name="✓" :size="32" />
            <text class="label">32px</text>
          </view>
          <view class="item">
            <see-icon name="✓" :size="48" />
            <text class="label">48px</text>
          </view>
        </view>
      </view>

      <!-- 图标颜色 -->
      <view class="section">
        <text class="title">图标颜色</text>
        <view class="content">
          <view class="item">
            <see-icon name="✓" :size="24" color="var(--see-primary)" />
            <text class="label">primary</text>
          </view>
          <view class="item">
            <see-icon name="✓" :size="24" color="var(--see-error)" />
            <text class="label">error</text>
          </view>
          <view class="item">
            <see-icon name="✓" :size="24" color="var(--see-success)" />
            <text class="label">success</text>
          </view>
          <view class="item">
            <see-icon name="✓" :size="24" color="var(--see-warning)" />
            <text class="label">warning</text>
          </view>
          <view class="item">
            <see-icon name="✓" :size="24" color="var(--see-info)" />
            <text class="label">info</text>
          </view>
          <view class="item">
            <see-icon name="✓" :size="24" color="#7232dd" />
            <text class="label">custom</text>
          </view>
        </view>
      </view>

      <!-- 图片图标 -->
      <view class="section">
        <text class="title">图片图标</text>
        <view class="content">
          <view class="item">
            <see-icon name="/static/logo.png" :size="48" />
            <text class="label">本地图片</text>
          </view>
        </view>
      </view>

      <!-- 综合示例 -->
      <view class="section">
        <text class="title">综合示例</text>
        <view class="content">
          <view class="item">
            <see-icon name="★" :size="32" color="var(--see-warning)" />
            <text class="label">收藏</text>
          </view>
          <view class="item">
            <see-icon name="♥" :size="32" color="var(--see-error)" />
            <text class="label">喜欢</text>
          </view>
          <view class="item">
            <see-icon name="●" :size="32" color="var(--see-success)" />
            <text class="label">在线</text>
          </view>
          <view class="item">
            <see-icon name="✕" :size="32" color="var(--see-info)" />
            <text class="label">关闭</text>
          </view>
        </view>
      </view>

      <!-- 点击事件 -->
      <view class="section">
        <text class="title">点击事件</text>
        <view class="content">
          <view class="item" @click="handleIconClick">
            <see-icon name="✓" :size="32" color="var(--see-primary)" />
            <text class="label">点击我</text>
          </view>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.icon')

const handleIconClick = () => {
  uni.showToast({
    title: '图标被点击了',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;
  background-color: var(--see-bg-color);
}

.section {
  margin-bottom: 24px;
}

.title {
  font-size: 16px;
  color: var(--see-main-color);
  font-weight: bold;
  margin-bottom: 12px;
  display: block;
}

.content {
  display: flex;
  flex-wrap: wrap;
  background-color: var(--see-bg-light-color);
  border-radius: 8px;
  padding: 12px;
}

.item {
  width: 25%;
  height: 80px;
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.label {
  font-size: 12px;
  color: var(--see-tips-color);
}
</style>
