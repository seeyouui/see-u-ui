<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法</text>
      <view class="content">
        <see-slider v-model="val1" />
        <text class="info">当前值：{{ val1 }}</text>
      </view>

      <text class="title">显示当前值</text>
      <view class="content">
        <see-slider v-model="val2" is-show-value />
      </view>

      <text class="title">范围选择</text>
      <view class="content">
        <see-slider v-model="val3" is-range is-show-value />
        <text class="info">范围：[{{ val3[0] }}, {{ val3[1] }}]</text>
      </view>

      <text class="title">步长和刻度</text>
      <view class="content">
        <see-slider v-model="val4" :min="0" :max="100" :step="10" is-show-step is-show-value />
      </view>

      <text class="title">自定义颜色</text>
      <view class="content">
        <see-slider v-model="val5" active-color="#07c160" inactive-color="#eee" />
      </view>

      <text class="title">自定义高度</text>
      <view class="content">
        <see-slider v-model="val6" :bar-height="8" active-color="#ff6b6b" />
      </view>

      <text class="title">垂直模式</text>
      <view class="content vertical-box">
        <see-slider v-model="val7" is-vertical is-show-value />
        <see-slider v-model="val8" is-vertical is-show-value active-color="#07c160" />
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-slider :model-value="40" is-disabled />
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-slider :model-value="60" is-readonly />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref(30)
const val2 = ref(50)
const val3 = ref<[number, number]>([20, 80])
const val4 = ref(30)
const val5 = ref(40)
const val6 = ref(50)
const val7 = ref(30)
const val8 = ref(60)
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
    flex-direction: column;
    gap: 12px;
  }
}

.vertical-box {
  height: 300px;
  align-items: flex-start;
}

.info {
  font-size: 12px;
  color: #999;
}
</style>
