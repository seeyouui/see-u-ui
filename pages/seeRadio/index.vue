<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法</text>
      <view class="content">
        <see-radio-group v-model="basicValue">
          <see-radio label="apple">苹果</see-radio>
          <see-radio label="banana">香蕉</see-radio>
          <see-radio label="orange">橘子</see-radio>
        </see-radio-group>
        <text class="info">选中值：{{ basicValue || '无' }}</text>
      </view>

      <text class="title">行内排列</text>
      <view class="content">
        <see-radio-group v-model="inlineValue" is-inline>
          <see-radio label="a">选项 A</see-radio>
          <see-radio label="b">选项 B</see-radio>
          <see-radio label="c">选项 C</see-radio>
        </see-radio-group>
      </view>

      <text class="title">块级排列</text>
      <view class="content">
        <see-radio-group v-model="blockValue" :is-inline="false">
          <see-radio label="a">选项 A</see-radio>
          <see-radio label="b">选项 B</see-radio>
          <see-radio label="c">选项 C</see-radio>
        </see-radio-group>
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-radio-group v-model="smallValue" size="small" is-inline>
          <see-radio label="a">小型</see-radio>
          <see-radio label="b">小型</see-radio>
        </see-radio-group>
        <see-radio-group v-model="defaultValue" size="default" is-inline>
          <see-radio label="a">默认</see-radio>
          <see-radio label="b">默认</see-radio>
        </see-radio-group>
        <see-radio-group v-model="largeValue" size="large" is-inline>
          <see-radio label="a">大型</see-radio>
          <see-radio label="b">大型</see-radio>
        </see-radio-group>
      </view>

      <text class="title">带边框</text>
      <view class="content">
        <see-radio-group v-model="borderValue" is-border>
          <see-radio label="a">选项 A</see-radio>
          <see-radio label="b">选项 B</see-radio>
          <see-radio label="c">选项 C</see-radio>
        </see-radio-group>
      </view>

      <text class="title">带边框（行内）</text>
      <view class="content">
        <see-radio-group v-model="borderInlineValue" is-border is-inline>
          <see-radio label="a">选项 A</see-radio>
          <see-radio label="b">选项 B</see-radio>
          <see-radio label="c">选项 C</see-radio>
        </see-radio-group>
      </view>

      <text class="title">自定义颜色</text>
      <view class="content">
        <see-radio-group v-model="colorValue" checked-color="#e43d33" is-inline>
          <see-radio label="a">红色</see-radio>
          <see-radio label="b">红色</see-radio>
        </see-radio-group>
        <see-radio-group v-model="colorValue2" checked-color="#19be6b" is-border is-inline>
          <see-radio label="a">绿色</see-radio>
          <see-radio label="b">绿色</see-radio>
        </see-radio-group>
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-radio-group v-model="disabledValue" is-inline>
          <see-radio label="a">正常</see-radio>
          <see-radio label="b" is-disabled>禁用项</see-radio>
          <see-radio label="c">正常</see-radio>
        </see-radio-group>
      </view>

      <text class="title">整组禁用</text>
      <view class="content">
        <see-radio-group v-model="disabledGroupValue" is-disabled is-inline>
          <see-radio label="a">选项 A</see-radio>
          <see-radio label="b">选项 B</see-radio>
          <see-radio label="c">选项 C</see-radio>
        </see-radio-group>
      </view>

      <text class="title">整组只读</text>
      <view class="content">
        <see-radio-group v-model="readonlyValue" is-readonly is-inline>
          <see-radio label="a">选项 A</see-radio>
          <see-radio label="b">选项 B</see-radio>
          <see-radio label="c">选项 C</see-radio>
        </see-radio-group>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const basicValue = ref('apple')
const inlineValue = ref('a')
const blockValue = ref('a')
const smallValue = ref('a')
const defaultValue = ref('a')
const largeValue = ref('a')
const borderValue = ref('a')
const borderInlineValue = ref('a')
const colorValue = ref('a')
const colorValue2 = ref('a')
const disabledValue = ref('a')
const disabledGroupValue = ref('b')
const readonlyValue = ref('a')
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
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .info {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
