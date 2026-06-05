<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法</text>
      <view class="content">
        <see-number-box v-model="val1" />
        <text class="tip">当前值：{{ val1 }}</text>
      </view>

      <text class="title">步长设置</text>
      <view class="content">
        <see-number-box v-model="val2" :step="5" />
        <text class="tip">步长为 5，当前值：{{ val2 }}</text>
      </view>

      <text class="title">限制范围</text>
      <view class="content">
        <see-number-box v-model="val3" :min="1" :max="10" />
        <text class="tip">范围 1~10，当前值：{{ val3 }}</text>
      </view>

      <text class="title">小数位数</text>
      <view class="content">
        <see-number-box v-model="val4" :step="0.1" :decimal-length="1" />
        <text class="tip">1位小数，当前值：{{ val4 }}</text>
      </view>

      <text class="title">禁用输入框</text>
      <view class="content">
        <see-number-box v-model="val5" is-disabled-input />
        <text class="tip">仅可通过按钮操作</text>
      </view>

      <text class="title">禁用增加按钮</text>
      <view class="content">
        <see-number-box v-model="val6" is-disabled-plus />
      </view>

      <text class="title">禁用减少按钮</text>
      <view class="content">
        <see-number-box v-model="val7" is-disabled-minus />
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-number-box :model-value="5" is-disabled />
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-number-box :model-value="8" is-readonly />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-number-box v-model="val8" size="small" />
        <view class="ml-12" />
        <see-number-box v-model="val8" size="default" />
        <view class="ml-12" />
        <see-number-box v-model="val8" size="large" />
      </view>

      <text class="title">自定义输入框宽度</text>
      <view class="content">
        <see-number-box v-model="val9" :input-width="100" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref(1)
const val2 = ref(0)
const val3 = ref(5)
const val4 = ref(1.0)
const val5 = ref(3)
const val6 = ref(0)
const val7 = ref(5)
const val8 = ref(1)
const val9 = ref(0)
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

  .tip {
    font-size: 14px;
    color: #666;
    margin-left: 12px;
  }

  .ml-12 {
    margin-left: 12px;
  }
}
</style>
