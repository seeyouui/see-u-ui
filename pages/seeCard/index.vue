<template>
  <see-config>
    <text class="title">基础卡片</text>
    <view class="demo-content">
      <see-card title="卡片标题">
        <text>这是卡片的内容区域</text>
      </see-card>
    </view>

    <text class="title">带副标题</text>
    <view class="demo-content">
      <see-card title="卡片标题" sub-title="这是副标题描述">
        <text>这是卡片的内容区域</text>
      </see-card>
    </view>

    <text class="title">自定义 Header</text>
    <view class="demo-content">
      <see-card>
        <template #header>
          <view style="display: flex; align-items: center; justify-content: space-between">
            <text style="font-size: 30rpx; font-weight: 600">自定义标题</text>
            <text style="font-size: 24rpx; color: #999">更多</text>
          </view>
        </template>
        <text>自定义 header 插槽内容</text>
      </see-card>
    </view>

    <text class="title">带 Footer</text>
    <view class="demo-content">
      <see-card title="卡片标题">
        <text>这是卡片的内容区域</text>
        <template #footer>
          <view style="display: flex; justify-content: flex-end; gap: 20rpx">
            <text style="color: var(--see-primary)">取消</text>
            <text style="color: var(--see-primary)">确定</text>
          </view>
        </template>
      </see-card>
    </view>

    <text class="title">不同阴影</text>
    <view class="demo-content">
      <see-card title="始终显示阴影" shadow="always" margin="0 0 20rpx">
        <text>shadow="always"</text>
      </see-card>
      <see-card title="从不显示阴影" shadow="never" margin="0 0 20rpx">
        <text>shadow="never"</text>
      </see-card>
      <see-card title="悬浮显示阴影" shadow="hover" margin="0 0 20rpx">
        <text>shadow="hover"</text>
      </see-card>
    </view>

    <text class="title">无边框</text>
    <view class="demo-content">
      <see-card title="无边框卡片" :border="false">
        <text>没有边框的卡片</text>
      </see-card>
    </view>
  </see-config>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.title {
  display: block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: var(--see-tips-color);
}
.demo-content {
  padding: 0 30rpx 30rpx;
}
</style>
