<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法</text>
      <view class="content">
        <see-rate v-model="val1" />
        <text class="tip">当前评分：{{ val1 }}</text>
      </view>

      <text class="title">半星</text>
      <view class="content">
        <see-rate v-model="val2" allow-half />
        <text class="tip">当前评分：{{ val2 }}</text>
      </view>

      <text class="title">自定义图标颜色</text>
      <view class="content">
        <see-rate v-model="val3" color="#ff6b6b" void-color="#ddd" />
        <text class="tip">红色主题</text>
      </view>

      <text class="title">自定义图标</text>
      <view class="content">
        <see-rate v-model="val4" icon="♥" void-icon="♡" color="#ee0a24" />
        <text class="tip">爱心评分</text>
      </view>

      <text class="title">清除评分</text>
      <view class="content">
        <see-rate v-model="val5" is-clearable />
        <text class="tip">再次点击已选星级可清除，当前：{{ val5 }}</text>
      </view>

      <text class="title">自定义数量和大小</text>
      <view class="content">
        <see-rate v-model="val6" :count="10" :size="18" :gap="2" />
        <text class="tip">10颗星</text>
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-rate :model-value="3.5" is-disabled allow-half />
        <text class="tip">不可操作</text>
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-rate :model-value="4" is-readonly />
        <text class="tip">只读展示</text>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref(3)
const val2 = ref(3.5)
const val3 = ref(4)
const val4 = ref(3)
const val5 = ref(4)
const val6 = ref(7)
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
}
</style>
