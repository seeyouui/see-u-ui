<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法</text>
      <view class="content">
        <see-switch v-model="val1" />
        <text class="info">当前值：{{ val1 }}</text>
      </view>

      <text class="title">自定义颜色</text>
      <view class="content">
        <see-switch v-model="val2" active-color="#07c160" inactive-color="#ee0a24" />
        <text class="info">绿色开启 / 红色关闭</text>
      </view>

      <text class="title">自定义值</text>
      <view class="content">
        <see-switch v-model="val3" active-value="开" inactive-value="关" />
        <text class="info">当前值：{{ val3 }}</text>
      </view>

      <text class="title">文字描述（两侧布局）</text>
      <view class="content">
        <see-switch v-model="val4" active-text="开" inactive-text="关" />
      </view>

      <text class="title">文字描述（右侧布局）</text>
      <view class="content">
        <see-switch v-model="val5" active-text="开启" inactive-text="关闭" />
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-switch :model-value="true" is-disabled />
        <view class="ml-12" />
        <see-switch :model-value="false" is-disabled />
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-switch :model-value="true" is-readonly />
        <view class="ml-12" />
        <see-switch :model-value="false" is-readonly />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-switch v-model="val6" size="small" />
        <view class="ml-12" />
        <see-switch v-model="val6" size="default" />
        <view class="ml-12" />
        <see-switch v-model="val6" size="large" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref(false)
const val2 = ref(true)
const val3 = ref('关')
const val4 = ref(true)
const val5 = ref(false)
const val6 = ref(true)
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
  }
}

.info {
  font-size: 12px;
  color: #999;
}

.ml-12 {
  margin-left: 12px;
}
</style>
