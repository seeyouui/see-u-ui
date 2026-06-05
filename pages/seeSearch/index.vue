<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法</text>
      <view class="content">
        <see-search v-model="val1" placeholder="请输入搜索内容" />
        <text class="tip">当前值：{{ val1 }}</text>
      </view>

      <text class="title">圆角形状（默认）</text>
      <view class="content">
        <see-search v-model="val2" shape="round" placeholder="圆角搜索框" />
      </view>

      <text class="title">方形形状</text>
      <view class="content">
        <see-search v-model="val3" shape="square" placeholder="方形搜索框" />
      </view>

      <text class="title">显示操作按钮</text>
      <view class="content">
        <see-search v-model="val4" is-show-action placeholder="搜索" />
      </view>

      <text class="title">自定义操作按钮文字</text>
      <view class="content">
        <see-search v-model="val5" is-show-action action-text="搜索" placeholder="请输入关键词" />
      </view>

      <text class="title">显示边框</text>
      <view class="content">
        <see-search v-model="val6" is-border placeholder="带边框的搜索框" />
      </view>

      <text class="title">自定义背景色</text>
      <view class="content">
        <see-search v-model="val7" bg-color="#e8f5e9" placeholder="自定义背景色" />
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-search model-value="禁用状态" is-disabled />
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-search model-value="只读状态" is-readonly />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content-col">
        <see-search v-model="val8" size="small" placeholder="小尺寸" />
        <view class="gap" />
        <see-search v-model="val8" size="default" placeholder="默认尺寸" />
        <view class="gap" />
        <see-search v-model="val8" size="large" placeholder="大尺寸" />
      </view>

      <text class="title">自定义插槽</text>
      <view class="content-col">
        <see-search v-model="val9" placeholder="左侧带文字">
          <template #left>
            <text class="slot-text">取消</text>
          </template>
        </see-search>
        <view class="gap" />
        <see-search v-model="val9" placeholder="右侧带图标">
          <template #right>
            <text class="slot-text">筛选</text>
          </template>
        </see-search>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref('')
const val2 = ref('')
const val3 = ref('')
const val4 = ref('')
const val5 = ref('')
const val6 = ref('')
const val7 = ref('')
const val8 = ref('')
const val9 = ref('')
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
    margin-top: 6px;
    margin-bottom: 24px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .content-col {
    margin-top: 6px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .tip {
    font-size: 14px;
    color: #666;
    margin-left: 12px;
  }

  .gap {
    height: 12px;
  }

  .slot-text {
    font-size: 14px;
    color: #007aff;
    white-space: nowrap;
  }
}
</style>
