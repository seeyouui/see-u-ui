<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-collapse v-model="active1">
        <see-collapse-item name="1" title="标题1">
          <text class="collapse-text">内容1</text>
        </see-collapse-item>
        <see-collapse-item name="2" title="标题2">
          <text class="collapse-text">内容2</text>
        </see-collapse-item>
        <see-collapse-item name="3" title="标题3">
          <text class="collapse-text">内容3</text>
        </see-collapse-item>
      </see-collapse>
    </view>

    <text class="title">手风琴模式</text>
    <view class="demo-content">
      <see-collapse v-model="active2" is-accordion>
        <see-collapse-item name="1" title="标题1">
          <text class="collapse-text">手风琴模式只能展开一个</text>
        </see-collapse-item>
        <see-collapse-item name="2" title="标题2">
          <text class="collapse-text">点击其他项会自动收起</text>
        </see-collapse-item>
        <see-collapse-item name="3" title="标题3">
          <text class="collapse-text">当前展开的项</text>
        </see-collapse-item>
      </see-collapse>
    </view>

    <text class="title">禁用项</text>
    <view class="demo-content">
      <see-collapse v-model="active3">
        <see-collapse-item name="1" title="正常项">
          <text class="collapse-text">可以点击</text>
        </see-collapse-item>
        <see-collapse-item name="2" title="禁用项" is-disabled>
          <text class="collapse-text">不可点击</text>
        </see-collapse-item>
        <see-collapse-item name="3" title="正常项">
          <text class="collapse-text">可以点击</text>
        </see-collapse-item>
      </see-collapse>
    </view>

    <text class="title">带图标</text>
    <view class="demo-content">
      <see-collapse v-model="active4">
        <see-collapse-item name="1" title="设置" icon="⚙️">
          <text class="collapse-text">设置内容</text>
        </see-collapse-item>
        <see-collapse-item name="2" title="通知" icon="🔔">
          <text class="collapse-text">通知内容</text>
        </see-collapse-item>
      </see-collapse>
    </view>

    <text class="title">无边框</text>
    <view class="demo-content">
      <see-collapse v-model="active5" :is-show-border="false">
        <see-collapse-item name="1" title="标题1">
          <text class="collapse-text">无边框样式</text>
        </see-collapse-item>
        <see-collapse-item name="2" title="标题2">
          <text class="collapse-text">内容2</text>
        </see-collapse-item>
      </see-collapse>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active1 = ref<string[]>([])
const active2 = ref<string[]>([])
const active3 = ref<string[]>(['1'])
const active4 = ref<string[]>([])
const active5 = ref<string[]>([])
</script>

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
.collapse-text {
  font-size: 26rpx;
  color: var(--see-content-color);
  line-height: 1.6;
}
</style>
