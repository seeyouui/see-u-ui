<template>
  <see-config>
    <text class="title">点击触发</text>
    <view class="demo-content">
      <see-popover v-model:show="show1">
        <see-button title="点击显示" type="primary" />
        <template #content>
          <view class="popover-content">
            <text class="popover-text">这是 Popover 内容</text>
          </view>
        </template>
      </see-popover>
    </view>

    <text class="title">带标题</text>
    <view class="demo-content">
      <see-popover v-model:show="show2" title="标题">
        <see-button title="带标题" type="primary" />
        <template #content>
          <view class="popover-content">
            <text class="popover-text">带标题的 Popover</text>
          </view>
        </template>
      </see-popover>
    </view>

    <text class="title">不同位置</text>
    <view class="demo-content">
      <view class="popover-grid">
        <see-popover v-model:show="show3" position="top">
          <see-button title="上" type="primary" size="small" />
          <template #content>
            <view class="popover-content">
              <text class="popover-text">顶部</text>
            </view>
          </template>
        </see-popover>
        <see-popover v-model:show="show4" position="bottom">
          <see-button title="下" type="primary" size="small" />
          <template #content>
            <view class="popover-content">
              <text class="popover-text">底部</text>
            </view>
          </template>
        </see-popover>
        <see-popover v-model:show="show5" position="left">
          <see-button title="左" type="primary" size="small" />
          <template #content>
            <view class="popover-content">
              <text class="popover-text">左侧</text>
            </view>
          </template>
        </see-popover>
        <see-popover v-model:show="show6" position="right">
          <see-button title="右" type="primary" size="small" />
          <template #content>
            <view class="popover-content">
              <text class="popover-text">右侧</text>
            </view>
          </template>
        </see-popover>
      </view>
    </view>

    <text class="title">带关闭按钮</text>
    <view class="demo-content">
      <see-popover v-model:show="show7" title="可关闭" is-show-close-btn>
        <see-button title="带关闭按钮" type="primary" />
        <template #content>
          <view class="popover-content">
            <text class="popover-text">点击右上角关闭</text>
          </view>
        </template>
      </see-popover>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)
const show6 = ref(false)
const show7 = ref(false)
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
.popover-content {
  padding: 16rpx;
}
.popover-text {
  font-size: 26rpx;
  color: var(--see-main-color);
}
.popover-grid {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
